import type { Recipe } from '@/app/types';

const coffeeTypes = ['V60', 'Espresso', 'Chemex', 'Cold Brew', 'Origami', 'Kalita Wave', 'Aeropress', 'French Press'];
const roastLevels = ['Light', 'Medium', 'Medium-Dark', 'Dark'];

// نموذج مشترك بين صفحتي الإضافة والتعديل — يعمل مع Server Actions
export default function RecipeForm({
  action,
  recipe,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  recipe?: Recipe;
  submitLabel: string;
}) {
  return (
    <form action={action} className="card p-8 rounded-3xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2">اسم الوصفة *</label>
          <input name="title" required className="input" placeholder="V60 - إثيوبيا يرغاتشيف" defaultValue={recipe?.title} />
        </div>
        <div>
          <label className="block text-sm mb-2">الـ Slug (رابط الصفحة — يُولَّد تلقائياً إذا تُرك فارغاً)</label>
          <input name="slug" className="input" placeholder="v60-ethiopia-yirgacheffe" defaultValue={recipe?.slug} dir="ltr" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2">الوصف</label>
        <textarea name="description" rows={3} className="input" placeholder="وصف مختصر عن الوصفة..." defaultValue={recipe?.description}></textarea>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm mb-2">نوع التحضير</label>
          <select name="coffee_type" className="input" defaultValue={recipe?.coffee_type ?? 'V60'}>
            {coffeeTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2">المحمصة</label>
          <input name="roastery" className="input" placeholder="Blue Bottle" defaultValue={recipe?.roastery} />
        </div>
        <div>
          <label className="block text-sm mb-2">بلد المنشأ</label>
          <input name="origin_country" className="input" placeholder="إثيوبيا" defaultValue={recipe?.origin_country} />
        </div>
        <div>
          <label className="block text-sm mb-2">درجة التحميص</label>
          <select name="roast_level" className="input" defaultValue={recipe?.roast_level ?? 'Medium'}>
            {roastLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div>
          <label className="block text-sm mb-2">السعر (ر.س)</label>
          <input name="price" type="number" step="0.5" min="0" className="input" defaultValue={recipe?.price ?? 45} />
        </div>
        <div>
          <label className="block text-sm mb-2">البن (جرام)</label>
          <input name="coffee_grams" type="number" min="1" className="input" defaultValue={recipe?.coffee_grams ?? 15} />
        </div>
        <div>
          <label className="block text-sm mb-2">الماء (مل)</label>
          <input name="water_ml" type="number" min="1" className="input" defaultValue={recipe?.water_ml ?? 250} />
        </div>
        <div>
          <label className="block text-sm mb-2">الحرارة (°م)</label>
          <input name="temperature" type="number" min="0" max="100" className="input" defaultValue={recipe?.temperature ?? 92} />
        </div>
        <div>
          <label className="block text-sm mb-2">الوقت (ثانية)</label>
          <input name="brew_time" type="number" min="1" className="input" defaultValue={recipe?.brew_time ?? 180} />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2">درجة الطحن</label>
        <input name="grind_size" className="input" placeholder="متوسط ناعم (مثل ملح الطعام)" defaultValue={recipe?.grind_size} />
      </div>

      <div>
        <label className="block text-sm mb-2">ملاحظات التذوق (افصل بينها بفاصلة)</label>
        <input
          name="tasting_notes"
          className="input"
          placeholder="فواكه استوائية، ياسمين، عسل"
          defaultValue={recipe?.tasting_notes.join('، ')}
        />
      </div>

      <div>
        <label className="block text-sm mb-2">خطوات التحضير (خطوة في كل سطر)</label>
        <textarea
          name="steps"
          rows={6}
          className="input"
          placeholder={"سخن الفلتر بماء ساخن.\nضع ١٥ جرام بن مطحون.\nصب الماء على مراحل."}
          defaultValue={recipe?.steps.join('\n')}
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2">رابط الصورة</label>
          <input name="image_url" type="url" className="input" placeholder="https://..." defaultValue={recipe?.image_url} dir="ltr" />
        </div>
        <div>
          <label className="block text-sm mb-2">رابط الفيديو (اختياري — رابط تضمين)</label>
          <input name="video_url" type="url" className="input" placeholder="https://www.youtube.com/embed/..." defaultValue={recipe?.video_url ?? ''} dir="ltr" />
        </div>
      </div>

      <button type="submit" className="btn btn-gold w-full py-4 text-lg mt-4">
        {submitLabel}
      </button>
    </form>
  );
}
