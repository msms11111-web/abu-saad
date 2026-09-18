# -*- coding: utf-8 -*-
"""
مولّد الشريط الصوتي لفيديو دعم الأهلي.
كل الأصوات مُركّبة صناعيًا هنا (جمهور، طبول، صافرة، هتافات، موسيقى)،
وصوت المعلّق مُولّد بمحرّك النطق espeak-ng ثم يُعالَج ليشبه تعليق البث.
لا يُستخدم أي مقطع محمي بحقوق نشر.

الاستخدام:
    python3 audio.py                 # يبني build/audio.wav
    python3 audio.py --no-tts        # بدون صوت المعلّق
    python3 audio.py --voice ملف.wav # استخدام تعليق حقيقي جاهز بدل المُولّد
"""
import argparse, json, math, os, subprocess, sys, tempfile, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
SR = 44100
DUR = TL['duration']
N = int(DUR * SR)
BPM = 100.0
BEAT = 60.0 / BPM          # 0.6 ثانية
S = TL['scenes']
CUE = TL['cues']
rng = np.random.default_rng(20260919)

t = np.arange(N) / SR


# ───────────────────────── أدوات عامة ─────────────────────────
def fft_band(x, lo, hi, slope=1.0):
    """ترشيح نطاقي سريع عبر تحويل فورييه."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    g = np.ones_like(f)
    if lo > 0:
        g *= 1 / (1 + (lo / np.maximum(f, 1e-6)) ** (2 * slope))
    if hi > 0:
        g *= 1 / (1 + (f / hi) ** (2 * slope))
    return np.fft.irfft(X * g, n)


def env_ar(n, attack, release, curve=2.5):
    """مغلّف بسيط: صعود ثم هبوط أسّي."""
    a = max(1, int(attack * SR))
    e = np.zeros(n)
    a = min(a, n)
    e[:a] = np.linspace(0, 1, a) ** 0.6
    if n > a:
        e[a:] = np.exp(-np.arange(n - a) / SR / max(release, 1e-3) * curve)
    return e


def add(dst, src, at):
    """يضيف مقطعًا في لحظة محددة مع قصّ الحدود."""
    i = int(at * SR)
    if i >= len(dst):
        return
    if i < 0:
        src = src[-i:]
        i = 0
    k = min(len(src), len(dst) - i)
    if k > 0:
        dst[i:i + k] += src[:k]


def ramp(t0, t1, lo=0.0, hi=1.0):
    """منحنى خطي زمني على كامل المقطع."""
    x = np.clip((t - t0) / max(t1 - t0, 1e-6), 0, 1)
    return lo + (hi - lo) * x


def seg_gain(points):
    """مستوى متغيّر عبر الزمن من نقاط (ثانية، مستوى) بتدرّج ناعم."""
    ts = np.array([p[0] for p in points], dtype=float)
    vs = np.array([p[1] for p in points], dtype=float)
    return np.interp(t, ts, vs)


def soft(x, drive=1.0):
    return np.tanh(x * drive)


def master_eq(x):
    """ميلان نهائي: قطع الترددات تحت ٤٥ هرتز، تخفيف الطين، وإضافة حضور للسمّاعات الصغيرة."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    g = 1 / (1 + (42 / np.maximum(f, 1e-6)) ** 4)                 # قطع منخفض
    g *= 1 - 0.30 * np.exp(-((np.log2(np.maximum(f, 1e-6) / 190)) ** 2) / 0.5)   # تقليل الطين
    g *= 1 + 0.55 / (1 + (2600 / np.maximum(f, 1e-6)) ** 2)       # رفّ عالٍ للحضور
    g *= 1 / (1 + (f / 15500) ** 6)
    return np.fft.irfft(X * g, n)


def duck_gain(voice, depth=0.42, smooth_s=0.09):
    """خفض بقية العناصر أثناء كلام المعلّق (كما في البث)."""
    k = max(1, int(smooth_s * SR))
    env = np.convolve(np.abs(voice), np.ones(k) / k, mode='same')
    peak = np.max(env) or 1.0
    env = np.clip(env / (peak * 0.35), 0, 1)
    k2 = max(1, int(0.25 * SR))
    env = np.convolve(env, np.ones(k2) / k2, mode='same')
    return 1.0 - depth * np.clip(env, 0, 1)


def reverb(x, delays=(0.031, 0.047, 0.071, 0.097, 0.131), decay=0.42, tail=1.6):
    """ارتداد بسيط يوحي بحجم الملعب."""
    out = x.copy()
    for i, d in enumerate(delays):
        k = int(d * SR)
        g = decay ** (i * 0.6 + 1)
        out[k:] += x[:-k] * g
    k = int(0.19 * SR)
    fb = np.zeros_like(out)
    fb[k:] = out[:-k] * 0.34
    out += fft_band(fb, 180, 3800)
    return out * (1.0 / (1 + decay)) * tail


# ───────────────────────── الجمهور ─────────────────────────
def crowd_bed():
    """ضجيج الجمهور المستمر: طبقات ضجيج مرشّحة مع تموّج بطيء."""
    base = rng.standard_normal(N)
    low = fft_band(base, 90, 700) * 1.0
    mid = fft_band(rng.standard_normal(N), 500, 2600) * 0.75
    hi = fft_band(rng.standard_normal(N), 2200, 7000) * 0.22
    # تموّج الهمهمة
    lfo = 1.0
    for f, a in ((0.11, 0.22), (0.27, 0.15), (0.63, 0.09), (1.7, 0.05)):
        lfo = lfo + a * np.sin(2 * np.pi * f * t + rng.random() * 6.28)
    return (low + mid + hi) * np.clip(lfo, 0.25, 2.2)


def roar(at, length=4.2, power=1.0):
    """زئير الجمهور عند الأهداف: صعود سريع ثم انحسار."""
    n = int(length * SR)
    nz = rng.standard_normal(n)
    body = fft_band(nz, 260, 3200)
    low = fft_band(rng.standard_normal(n), 70, 320) * 0.8
    top = fft_band(rng.standard_normal(n), 3000, 9000) * 0.3
    e = env_ar(n, 0.22, length * 0.42, curve=2.2)
    # انزلاق النبرة للأعلى في البداية
    slide = np.interp(np.arange(n) / SR, [0, 0.35, 1.2, length], [0.35, 1.0, 0.92, 0.75])
    return (body + low + top) * e * slide * power


def claps(at, length, density=90.0, level=1.0):
    """تصفيق: نبضات قصيرة موزّعة عشوائيًا."""
    n = int(length * SR)
    out = np.zeros(n)
    count = int(length * density)
    pos = rng.random(count) * (length - 0.1)
    burst_n = int(0.05 * SR)
    win = np.exp(-np.arange(burst_n) / SR * 90)
    for p in pos:
        b = fft_band(rng.standard_normal(burst_n), 900, 6500) * win * (0.4 + rng.random())
        i = int(p * SR)
        out[i:i + burst_n] += b
    return out * level * 0.35


def rhythmic_claps(t0, t1, level=1.0):
    """تصفيق منتظم على الإيقاع (٢ و ٤)."""
    out = np.zeros(N)
    burst_n = int(0.12 * SR)
    win = np.exp(-np.arange(burst_n) / SR * 34)
    beat = t0
    i = 0
    while beat < t1:
        if i % 2 == 1:
            b = np.zeros(burst_n)
            for _ in range(14):   # عدة أيدٍ غير متزامنة تمامًا
                o = int(abs(rng.normal(0, 0.012)) * SR)
                nb = fft_band(rng.standard_normal(burst_n), 800, 6000) * win
                b[o:] += nb[:burst_n - o] * (0.5 + rng.random() * 0.6)
            add(out, b * 0.09 * level, beat)
        beat += BEAT
        i += 1
    return out


def chant(t0, t1, level=1.0):
    """هتاف الجمهور: مقاطع منغّمة على الإيقاع (يا أهـ‑لي)."""
    out = np.zeros(N)
    # نمط المقاطع داخل كل مازورة (٤ نبضات)
    pattern = [(0.0, 0.42, 1.0), (0.5, 0.42, 0.95), (1.0, 0.75, 1.0), (2.0, 0.42, 0.9), (2.5, 0.85, 1.0)]
    bar = t0
    while bar < t1:
        for off, dur, amp in pattern:
            start = bar + off * BEAT
            if start >= t1:
                break
            n = int(dur * BEAT * SR)
            if n < 64:
                continue
            tt = np.arange(n) / SR
            voice = np.zeros(n)
            # أصوات كثيرة غير متطابقة الطبقة = جمهور
            for k in range(11):
                f0 = 118 * (1 + rng.normal(0, 0.028)) * (1.0 if amp > 0.94 else 0.94)
                ph = rng.random() * 6.28
                vib = 1 + 0.012 * np.sin(2 * np.pi * (4.5 + rng.random()) * tt)
                v = np.zeros(n)
                for h, hg in ((1, 1.0), (2, 0.6), (3, 0.42), (4, 0.26), (5, 0.16), (7, 0.09)):
                    v += hg * np.sin(2 * np.pi * f0 * h * vib * tt + ph * h)
                voice += v / 11
            # تشكيل حرف العلة
            voice = fft_band(voice, 180, 2200)
            voice += fft_band(rng.standard_normal(n), 400, 2600) * 0.35   # نفَس الحشد
            e = np.minimum(np.linspace(0, 1, n) * 6, 1.0) * np.exp(-np.linspace(0, 1, n) * 1.4)
            e *= np.interp(np.linspace(0, 1, n), [0, 0.85, 1], [1, 1, 0])
            add(out, voice * e * amp * 0.5 * level, start)
        bar += 4 * BEAT
    return out


# ───────────────────────── إيقاع وضربات ─────────────────────────
def kick(level=1.0, length=0.42):
    n = int(length * SR)
    tt = np.arange(n) / SR
    f = 150 * np.exp(-tt * 26) + 44
    body = np.sin(2 * np.pi * np.cumsum(f) / SR)
    click = fft_band(rng.standard_normal(n), 1200, 6000) * np.exp(-tt * 180) * 0.25
    return (body * np.exp(-tt * 7.5) + click) * level


def taiko(level=1.0, length=0.7):
    n = int(length * SR)
    tt = np.arange(n) / SR
    f = 105 * np.exp(-tt * 9) + 62
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 5.2)
    skin = fft_band(rng.standard_normal(n), 120, 1400) * np.exp(-tt * 16) * 0.5
    return (body + skin) * level


def snare(level=1.0, length=0.26):
    n = int(length * SR)
    tt = np.arange(n) / SR
    nz = fft_band(rng.standard_normal(n), 260, 7000) * np.exp(-tt * 26)
    tone = np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 34) * 0.35
    return (nz + tone) * level


def hat(level=1.0, length=0.09):
    n = int(length * SR)
    tt = np.arange(n) / SR
    return fft_band(rng.standard_normal(n), 6000, 15000) * np.exp(-tt * 95) * level


def boom(level=1.0, length=2.6):
    """ضربة افتتاحية عميقة."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    f = 130 * np.exp(-tt * 3.4) + 32
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.1)
    crack = fft_band(rng.standard_normal(n), 400, 9000) * np.exp(-tt * 22) * 0.4
    return (sub * 1.1 + crack) * level


def riser(at, length=2.4, level=1.0):
    """صعود توتّر ينتهي عند اللحظة المحددة."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    p = tt / length
    nz = rng.standard_normal(n)
    bands = np.zeros(n)
    for lo, hi, w in ((300, 900, 0.5), (900, 2500, 0.8), (2500, 7000, 0.7)):
        bands += fft_band(nz, lo, hi) * w * np.clip((p - 0.15) / 0.85, 0, 1) ** 2
    tone = np.sin(2 * np.pi * (180 + 900 * p ** 2.4) * tt) * 0.16 * p ** 2
    return (bands * 0.5 + tone) * (p ** 1.6) * level


def whistle(level=1.0, length=0.55, blasts=1):
    """صافرة الحكم."""
    out = np.zeros(int((length * blasts + 0.35) * SR))
    for b in range(blasts):
        n = int(length * SR)
        tt = np.arange(n) / SR
        trill = 1 + 0.035 * np.sin(2 * np.pi * 26 * tt)
        core = (np.sin(2 * np.pi * 2680 * trill * tt) +
                0.55 * np.sin(2 * np.pi * 3520 * trill * tt) +
                0.25 * np.sin(2 * np.pi * 4100 * trill * tt))
        air = fft_band(rng.standard_normal(n), 2200, 8000) * 0.5
        e = np.minimum(np.linspace(0, 1, n) * 22, 1) * np.interp(np.linspace(0, 1, n), [0, 0.7, 1], [1, 0.95, 0])
        add(out, (core * 0.5 + air) * e * level, b * (length + 0.12))
    return out


# ───────────────────────── موسيقى ─────────────────────────
def saw(freq, n, detune=0.0, phase=0.0):
    tt = np.arange(n) / SR
    f = freq * (1 + detune)
    ph = (f * tt + phase) % 1.0
    return 2 * ph - 1


def pad(chord, at, length, level=1.0, bright=2200):
    """وسادة أوركسترالية من مناشير مُزاحة."""
    n = int(length * SR)
    mix = np.zeros(n)
    for f in chord:
        for d in (-0.006, -0.002, 0.003, 0.007):
            mix += saw(f, n, d, rng.random()) * 0.25
        mix += np.sin(2 * np.pi * f * np.arange(n) / SR) * 0.35
    mix = fft_band(mix, 110, bright)
    e = np.minimum(np.linspace(0, 1, n) * 3.2, 1) * np.interp(np.linspace(0, 1, n), [0, 0.75, 1], [1, 0.95, 0])
    return mix * e * level / max(len(chord), 1)


def bass(freq, at, length, level=1.0):
    n = int(length * SR)
    tt = np.arange(n) / SR
    v = (np.sin(2 * np.pi * freq * tt) + 0.35 * saw(freq, n, 0.002)) * np.exp(-tt * 1.1)
    return fft_band(v, 25, 320) * level


def brass(freq, length, level=1.0):
    """نفخ بطولي قصير."""
    n = int(length * SR)
    tt = np.arange(n) / SR
    v = np.zeros(n)
    for d in (-0.004, 0.0, 0.005):
        v += saw(freq, n, d, rng.random())
    v += saw(freq * 2, n, 0.003) * 0.4
    v = fft_band(v, 150, 3000)
    e = np.minimum(tt * 12, 1) * np.interp(tt / length, [0, 0.7, 1], [1, 0.9, 0])
    return v * e * level * 0.33


# ───────────────────────── صوت المعلّق ─────────────────────────
LINES = [
    (11.9, "جُووول!",                              0.86, 78),
    (12.6, "غَالِينُو! يَا لَهَا مِنْ كُرَة!",        0.92, 150),
    (15.0, "وَهَدَفٌ ثَانٍ! فْرَانْك كِيسِييه!",       0.92, 150),
    (22.6, "جُووول!",                              0.90, 78),
    (23.3, "فِرَاس البُرَيْكَان! هَدَفٌ قَاتِل!",      0.94, 152),
    (28.3, "أَبُو الشَّامَات! هَدَفُ التَّأَهُّل!",     0.90, 150),
    (33.4, "وَغَدًا… نِهَائِيُّ كَأْسِ القَارَات!",     0.88, 148),
    (53.2, "الأَهْلِي… بَطَلُ آسِيَا مَرَّتَيْن!",      0.88, 146),
]


def commentary():
    """تعليق مُولّد آليًا ثم معالَج ليشبه صوت المعلّق عبر البث."""
    out = np.zeros(N)
    if not shutil_which('espeak-ng'):
        print('تنبيه: espeak-ng غير متوفر — سيُبنى الصوت بدون تعليق.', file=sys.stderr)
        return out
    with tempfile.TemporaryDirectory() as td:
        for i, (at, text, rate, speed) in enumerate(LINES):
            f = os.path.join(td, f'v{i}.wav')
            subprocess.run(['espeak-ng', '-v', 'ar+m3', '-s', str(speed), '-p', '18',
                            '-a', '190', '-g', '2', '-w', f, text],
                           check=True, capture_output=True)
            with wave.open(f) as w:
                sr0 = w.getframerate()
                raw = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
            # إعادة التردّد مع خفض الطبقة قليلًا (صوت أعمق)
            src_len = len(raw)
            dst_len = int(src_len * SR / sr0 / rate)
            v = np.interp(np.linspace(0, src_len - 1, dst_len), np.arange(src_len), raw)
            # سلسلة المعالجة: نطاق البث + تشبّع + ضغط + ارتداد الملعب
            v = fft_band(v, 240, 4200)
            v = soft(v * 3.4) * 0.5
            peak = np.max(np.abs(v)) or 1.0
            v = v / peak * 0.9
            v = v * 0.75 + reverb(v, decay=0.3, tail=0.9) * 0.3
            add(out, v, at)
    return out


def shutil_which(x):
    from shutil import which
    return which(x)


# ───────────────────────── تركيب الشريط ─────────────────────────
def build(use_tts=True, voice_file=None):
    mix = np.zeros(N)

    # ١) الجمهور: مستوى متغيّر حسب المشهد
    bed = crowd_bed()
    bed_gain = seg_gain([
        (0.0, 0.10), (1.1, 0.16), (1.4, 0.42), (3.0, 0.50), (5.2, 0.55),
        (9.7, 0.50), (9.9, 0.58), (12.3, 0.55), (12.5, 1.00), (14.5, 0.72),
        (15.1, 0.62), (15.3, 1.00), (17.5, 0.70),
        (18.2, 0.42), (19.5, 0.30), (21.0, 0.26), (22.7, 0.30), (22.95, 1.15),
        (25.0, 0.92), (25.6, 0.72), (28.4, 0.66), (28.7, 1.00), (30.5, 0.72),
        (31.4, 0.80), (34.0, 0.66), (38.0, 0.72), (40.2, 0.95),
        (46.0, 1.00), (51.6, 1.05), (55.0, 0.95), (57.0, 0.45), (58.0, 0.0),
    ])
    mix += bed * bed_gain * 0.30

    # ٢) زئير عند كل هدف + تصفيق
    for g, p in zip(CUE['goal'], (1.0, 0.95, 1.25, 0.95)):
        add(mix, roar(g, 4.6, p) * 0.34, g - 0.06)
        add(mix, claps(g, 4.0, density=150, level=p * 0.9), g + 0.18)
    add(mix, roar(1.2, 3.4, 0.7) * 0.26, 1.15)          # افتتاحية
    add(mix, roar(31.45, 3.0, 0.75) * 0.26, 31.4)       # «غدًا»
    add(mix, roar(51.7, 5.0, 1.0) * 0.30, 51.6)         # الختام
    add(mix, claps(51.8, 6.0, density=120, level=0.9), 51.9)

    # ٣) هتاف الجمهور + تصفيق منتظم في مقطع التحفيز
    mix += chant(S['hype'] + 0.1, S['outro'] + 3.2, level=0.55) * 0.5
    mix += rhythmic_claps(S['hype'], S['outro'] + 4.0, level=1.0)
    mix += chant(6.0, 9.6, level=0.22) * 0.5

    # ٤) الطبول
    beat_t = S['final2025']
    i = 0
    while beat_t < DUR - 0.2:
        pos = i % 8
        # كثافة الإيقاع حسب المشهد
        if S['final2026'] + 0.6 <= beat_t < 22.7:          # مشهد التوتّر: نبض قلب فقط
            if pos % 4 == 0:
                add(mix, kick(0.45), beat_t)
                add(mix, kick(0.30), beat_t + 0.19)
            if pos % 2 == 0:
                add(mix, hat(0.05), beat_t + BEAT / 2)
        else:
            lvl = 0.60 if beat_t < S['hype'] else 0.85
            if pos in (0, 3, 6):
                add(mix, taiko(0.46 * lvl), beat_t)
            if pos % 2 == 0:
                add(mix, kick(0.55 * lvl), beat_t)
            if pos in (2, 6):
                add(mix, snare(0.30 * lvl), beat_t)
            if beat_t >= S['hype']:
                add(mix, hat(0.055), beat_t + BEAT / 2)
                if pos in (7,):
                    add(mix, snare(0.22), beat_t + BEAT / 2)
        beat_t += BEAT
        i += 1

    # ٥) ضربات ومنحنيات التوتّر
    for i, b in enumerate(CUE['boom']):
        add(mix, boom(0.55 if i else 0.75), b)
    for r in CUE['riser']:
        add(mix, riser(r, 2.4, 0.28), r - 2.4)
    add(mix, riser(22.9, 3.4, 0.42), 19.5)               # توتّر الوقت الإضافي
    # الصافرات
    add(mix, whistle(0.16, 0.5, 1), 9.86)                # بداية اللقاء
    add(mix, whistle(0.20, 0.55, 3), 24.7)               # نهاية النهائي
    add(mix, whistle(0.14, 0.45, 1), 31.42)

    # ٦) الموسيقى: دورة هارمونية (Dm – Bb – F – C)
    CH = [
        [146.83, 174.61, 220.00],   # Dm
        [116.54, 174.61, 233.08],   # Bb
        [174.61, 220.00, 261.63],   # F
        [130.81, 196.00, 261.63],   # C
    ]
    ROOT = [73.42, 58.27, 87.31, 65.41]
    bar_len = 4 * BEAT
    start = 1.15
    k = 0
    while start < DUR - 0.4:
        ch = CH[k % 4]
        lvl = np.interp(start, [0, 1.2, 5.2, 9.8, 18.2, 21.0, 23.0, 31.4, 40.2, 51.6, 57.5],
                        [0, 0.55, 0.62, 0.70, 0.40, 0.30, 0.85, 0.80, 0.90, 1.00, 0.0])
        bright = 1500 if start < 9.8 else (1100 if 18.2 <= start < 22.9 else 2600)
        add(mix, pad(ch, start, bar_len * 1.02, level=0.30 * lvl, bright=bright), start)
        add(mix, bass(ROOT[k % 4], start, bar_len * 0.95, level=0.34 * lvl), start)
        if start >= S['hype'] - 0.01:
            for j, mul in ((0, 1.0), (2, 1.5)):
                add(mix, brass(ch[0] * mul, BEAT * 1.6, 0.42 * lvl), start + j * BEAT)
        if start >= S['outro'] - 0.01:
            add(mix, brass(ch[-1] * 2, BEAT * 2.4, 0.34 * lvl), start + BEAT)
        start += bar_len
        k += 1

    # ٧) التعليق (يُمزج بعد خفض بقية العناصر)
    voice = np.zeros(N)
    if voice_file:
        with wave.open(voice_file) as w:
            sr0, ch0 = w.getframerate(), w.getnchannels()
            raw = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        if ch0 == 2:
            raw = raw.reshape(-1, 2).mean(axis=1)
        v = np.interp(np.linspace(0, len(raw) - 1, int(len(raw) * SR / sr0)), np.arange(len(raw)), raw)
        add(voice, v * 0.9, 0.0)
    elif use_tts:
        voice = commentary() * 0.46

    # ٨) المعالجة النهائية
    mix = mix * duck_gain(voice) + voice
    mix = master_eq(mix)
    mix = soft(mix * 1.30) * 0.82
    # استريو: توسيع خفيف عبر تأخير وترشيح مختلف للقناتين
    d = int(0.011 * SR)
    left = mix.copy()
    right = mix.copy()
    right[d:] += mix[:-d] * 0.16
    left[d:] += mix[:-d] * -0.10
    st = np.stack([left, right], axis=1)
    # تلاشٍ عند الحدين
    fi, fo = int(0.25 * SR), int(1.4 * SR)
    st[:fi] *= np.linspace(0, 1, fi)[:, None]
    st[-fo:] *= np.linspace(1, 0, fo)[:, None]
    peak = np.max(np.abs(st)) or 1.0
    st = st / peak * 0.94
    return st


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=os.path.join(HERE, 'build', 'audio.wav'))
    ap.add_argument('--no-tts', action='store_true')
    ap.add_argument('--voice', default=None, help='ملف WAV بتعليق جاهز يُمزج بدل المُولّد')
    a = ap.parse_args()
    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    st = build(use_tts=not a.no_tts, voice_file=a.voice)
    data = (np.clip(st, -1, 1) * 32767).astype('<i2')
    with wave.open(a.out, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print('تم إنشاء الصوت:', a.out, f'({len(st)/SR:.1f} ثانية)')


if __name__ == '__main__':
    main()
