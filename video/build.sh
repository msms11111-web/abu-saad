#!/usr/bin/env bash
# بناء الفيديو كاملًا: الصوت ثم الإطارات ثم الدمج في ملف MP4
set -euo pipefail
cd "$(dirname "$0")"

# ffmpeg: من النظام إن وُجد، وإلا من حزمة imageio-ffmpeg
if [ -z "${FFMPEG:-}" ]; then
  if command -v ffmpeg >/dev/null 2>&1; then
    FFMPEG=ffmpeg
  else
    FFMPEG=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
  fi
fi

echo "» توليد الصوت…"
python3 audio.py "$@"

echo "» رسم الإطارات ودمجها…"
node render.mjs --ffmpeg="$FFMPEG" --out=ahli-support.mp4

ls -lh ahli-support.mp4
