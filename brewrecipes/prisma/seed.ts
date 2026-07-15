import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// tasting_notes و steps تُخزَّن كنص JSON لأن SQLite لا يدعم المصفوفات
const recipes = [
  {
    title: "V60 - إثيوبيا يرغاتشيف",
    slug: "v60-ethiopia-yirgacheffe",
    description: "وصفة نظيفة وحمضية رائعة من أفضل مناطق إثيوبيا. مثالية لعشاق القهوة الخفيفة ذات النكهات الزهرية والفواكهية.",
    coffee_type: "V60",
    roastery: "Blue Bottle Coffee",
    origin_country: "إثيوبيا",
    roast_level: "Light",
    tasting_notes: ["فواكه استوائية", "ياسمين", "حمضية مشرقة", "عسل"],
    coffee_grams: 15,
    water_ml: 250,
    temperature: 92,
    grind_size: "متوسط ناعم (مثل ملح الطعام)",
    brew_time: 180,
    steps: [
      "سخن الفلتر والـ V60 بماء ساخن ثم تخلص من الماء.",
      "ضع ١٥ جرام بن مطحون في الفلتر.",
      "صب ٣٠ مل ماء (٩٢°م) لعملية الـ Bloom لمدة ٣٠ ثانية.",
      "صب الماء المتبقي (٢٢٠ مل) على ٣ مراحل كل ٣٠ ثانية.",
      "حرك بلطف في النهاية واتركها تستقر.",
      "الوقت الإجمالي يجب أن يكون حوالي ٣ دقائق."
    ],
    image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80",
    price: 45,
  },
  {
    title: "Espresso - البرازيل سيراادو",
    slug: "espresso-brazil-cerrado",
    description: "إسبريسو متوازن وغني بالنكهات الشوكولاتية والمكسرات من البرازيل. جسم كامل وقوام كريمي يناسب البدء الصباحي.",
    coffee_type: "Espresso",
    roastery: "Counter Culture Coffee",
    origin_country: "البرازيل",
    roast_level: "Medium",
    tasting_notes: ["شوكولاتة داكنة", "مكسرات محمصة", "كراميل", "جسم كامل"],
    coffee_grams: 18,
    water_ml: 36,
    temperature: 93,
    grind_size: "ناعم جداً (مثل السكر البودرة)",
    brew_time: 28,
    steps: [
      "اطحن البن ناعماً جداً.",
      "زن ١٨ جرام بن في الـ portafilter.",
      "وزّع البن بالتساوي.",
      "اضغط بقوة ١٥-٢٠ كجم.",
      "استخرج لمدة ٢٥-٣٠ ثانية حتى يصل الوزن إلى ٣٦ جرام."
    ],
    image_url: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=1200&q=80",
    price: 39,
  },
  {
    title: "Cold Brew - كولومبيا سوبريمو",
    slug: "cold-brew-colombia",
    description: "كولد برو ناعم ومنعش مع نكهات الكاكاو والتوابل الدافئة. تحضير بطيء يمنحك قهوة باردة منخفضة الحموضة.",
    coffee_type: "Cold Brew",
    roastery: "Stumptown Coffee",
    origin_country: "كولومبيا",
    roast_level: "Medium-Dark",
    tasting_notes: ["كاكاو", "توابل دافئة", "حلاوة", "جسم ثقيل"],
    coffee_grams: 60,
    water_ml: 600,
    temperature: 20,
    grind_size: "خشن (مثل حبوب الفلفل)",
    brew_time: 43200,
    steps: [
      "اطحن ٦٠ جرام بن خشناً.",
      "ضع البن في وعاء أو كيس Cold Brew.",
      "صب ٦٠٠ مل ماء بارد أو بدرجة حرارة الغرفة.",
      "حرك جيداً واتركه في الثلاجة لمدة ١٢-١٨ ساعة.",
      "صفِّ القهوة واستمتع."
    ],
    image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&q=80",
    price: 35,
  },
  {
    title: "Chemex - غواتيمالا أنتيغوا",
    slug: "chemex-guatemala",
    description: "كوب نظيف وصافٍ بنكهات التوت والحمضيات من مرتفعات غواتيمالا. فلتر الكيمكس السميك يمنحك صفاءً استثنائياً.",
    coffee_type: "Chemex",
    roastery: "Intelligentsia",
    origin_country: "غواتيمالا",
    roast_level: "Light",
    tasting_notes: ["توت", "حمضيات", "نظيف", "شاي أسود"],
    coffee_grams: 30,
    water_ml: 500,
    temperature: 94,
    grind_size: "متوسط خشن",
    brew_time: 270,
    steps: [
      "اشطف فلتر الكيمكس بماء ساخن وتخلص من الماء.",
      "ضع ٣٠ جرام بن مطحون متوسط خشن.",
      "صب ٦٠ مل ماء لعملية الـ Bloom لمدة ٤٥ ثانية.",
      "صب الماء المتبقي بحركات دائرية على ٣ دفعات.",
      "يجب أن يكتمل الاستخلاص خلال ٤-٥ دقائق."
    ],
    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
    price: 42,
  },
  {
    title: "Origami - كينيا نييري",
    slug: "origami-kenya-nyeri",
    description: "وصفة أوريغامي مشرقة بحمضية الكشمش الأسود المميزة لقهوة كينيا. مقدَّمة بأسلوب يبرز حلاوة الكوب وتعقيده.",
    coffee_type: "Origami",
    roastery: "Onyx Coffee Lab",
    origin_country: "كينيا",
    roast_level: "Light",
    tasting_notes: ["كشمش أسود", "برتقال دموي", "سكر بني"],
    coffee_grams: 16,
    water_ml: 260,
    temperature: 93,
    grind_size: "متوسط",
    brew_time: 165,
    steps: [
      "ركّب فلتر مخروطي على الأوريغامي واشطفه بماء ساخن.",
      "أضف ١٦ جرام بن مطحون متوسط.",
      "ابدأ بـ ٤٠ مل ماء لعملية الـ Bloom لمدة ٣٥ ثانية.",
      "صب حتى ١٥٠ مل ثم انتظر حتى ينخفض مستوى الماء.",
      "أكمل الصب حتى ٢٦٠ مل وانتظر اكتمال التصفية."
    ],
    image_url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80",
    price: 48,
  },
  {
    title: "Kalita Wave - كوستاريكا تاراسو",
    slug: "kalita-costa-rica-tarrazu",
    description: "استخلاص متوازن ومستقر بفضل قاعدة الكاليتا المسطحة. نكهات العسل والتفاح المطبوخ من مزارع تاراسو العالية.",
    coffee_type: "Kalita Wave",
    roastery: "Heart Coffee Roasters",
    origin_country: "كوستاريكا",
    roast_level: "Medium",
    tasting_notes: ["عسل", "تفاح مطبوخ", "لوز", "قوام ناعم"],
    coffee_grams: 20,
    water_ml: 320,
    temperature: 92,
    grind_size: "متوسط",
    brew_time: 210,
    steps: [
      "ضع فلتر Wave واشطفه بماء ساخن.",
      "أضف ٢٠ جرام بن مطحون متوسط وسوِّ السطح.",
      "صب ٥٠ مل ماء لعملية الـ Bloom لمدة ٣٠ ثانية.",
      "صب على دفعات صغيرة متساوية (٦٠-٧٠ مل) كل ٣٠ ثانية.",
      "حافظ على مستوى ماء منخفض وثابت حتى ٣٢٠ مل."
    ],
    image_url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80",
    price: 44,
  },
]

async function main() {
  // إعادة البذر من الصفر
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.recipe.deleteMany()

  for (const recipe of recipes) {
    await prisma.recipe.create({
      data: {
        ...recipe,
        tasting_notes: JSON.stringify(recipe.tasting_notes),
        steps: JSON.stringify(recipe.steps),
      },
    })
  }

  console.log(`✅ تم بذر قاعدة البيانات بـ ${recipes.length} وصفات بنجاح!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
