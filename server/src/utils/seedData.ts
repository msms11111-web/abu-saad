import Product from '../models/Product.js'
import User from '../models/User.js'

export interface SeedResult {
  products: number
  users: number
}

// Inserts the demo catalog and test accounts. Assumes an empty database —
// callers must check/clear existing data first.
export const runSeed = async (): Promise<SeedResult> => {
  const adminUser = new User({
    name: 'Admin User',
    email: 'admin@saudiessence.sa',
    phone: '+966501234567',
    password: 'SaEssence#Admin26',
    role: 'admin'
  })
  await adminUser.save()

  const products = [
    {
      name: 'Oud Perfume Deluxe',
      nameAr: 'عطر العود الفاخر',
      description: 'Premium Saudi Oud perfume with rich woody notes',
      descriptionAr: 'عطر عود سعودي فاخر برائحة خشبية عميقة',
      price: 450,
      discountPrice: 350,
      category: 'mens',
      image: 'https://via.placeholder.com/300?text=Oud+Perfume',
      stock: 50,
      rating: 4.8,
      vendor: adminUser._id,
      sku: 'OUD-001',
      isFeature: true,
      isLatest: true,
      fragrance: {
        type: 'Eau de Parfum',
        family: 'Oriental',
        notes: ['Oud', 'Amber', 'Sandalwood']
      },
      specifications: {
        volume: '100ml',
        concentration: '15%',
        origin: 'Saudi Arabia',
        ingredients: ['Oud Oil', 'Amber', 'Rose Oil']
      }
    },
    {
      name: 'Rose Garden Essence',
      nameAr: 'عطر روضة الورد',
      description: 'Floral women perfume with fresh rose notes',
      descriptionAr: 'عطر نسائي زهري برائحة الورد الطازجة',
      price: 350,
      discountPrice: 280,
      category: 'womens',
      image: 'https://via.placeholder.com/300?text=Rose+Garden',
      stock: 75,
      rating: 4.6,
      vendor: adminUser._id,
      sku: 'ROSE-001',
      isFeature: true,
      isLatest: true,
      fragrance: {
        type: 'Eau de Toilette',
        family: 'Floral',
        notes: ['Rose', 'Lavender', 'Musk']
      },
      specifications: {
        volume: '100ml',
        concentration: '10%',
        origin: 'Saudi Arabia',
        ingredients: ['Rose Oil', 'Lavender', 'White Musk']
      }
    },
    {
      name: 'Musk Elegance',
      nameAr: 'عطر أناقة المسك',
      description: 'Unisex musky fragrance for all occasions',
      descriptionAr: 'عطر مسكي للرجال والنساء لكل المناسبات',
      price: 300,
      category: 'unisex',
      image: 'https://via.placeholder.com/300?text=Musk+Elegance',
      stock: 100,
      rating: 4.5,
      vendor: adminUser._id,
      sku: 'MUSK-001',
      isFeature: true,
      fragrance: {
        type: 'Eau de Parfum',
        family: 'Oriental',
        notes: ['Musk', 'Amber', 'Vanilla']
      },
      specifications: {
        volume: '100ml',
        concentration: '12%',
        origin: 'Saudi Arabia'
      }
    },
    {
      name: 'Bakhoor Premium',
      nameAr: 'بخور فاخر',
      description: 'Traditional Saudi bakhoor incense',
      descriptionAr: 'البخور السعودي التقليدي الفاخر',
      price: 150,
      category: 'bakhoor',
      image: 'https://via.placeholder.com/300?text=Bakhoor',
      stock: 200,
      rating: 4.7,
      vendor: adminUser._id,
      sku: 'BAKH-001',
      isFeature: true,
      fragrance: {
        type: 'Bakhoor',
        family: 'Oriental',
        notes: ['Oud', 'Musk', 'Amber']
      },
      specifications: {
        volume: '100g',
        origin: 'Saudi Arabia'
      }
    },
    {
      name: 'Attar Oil Gold',
      nameAr: 'زيت العطار الذهبي',
      description: 'Pure concentrated attar oil',
      descriptionAr: 'زيت عطار سائل مركز نقي',
      price: 200,
      discountPrice: 160,
      category: 'oils',
      image: 'https://via.placeholder.com/300?text=Attar+Oil',
      stock: 80,
      rating: 4.9,
      vendor: adminUser._id,
      sku: 'OIL-001',
      isFeature: true,
      isLatest: true,
      fragrance: {
        type: 'Pure Oil',
        family: 'Oriental',
        notes: ['Oud', 'Rose', 'Musk']
      },
      specifications: {
        volume: '30ml',
        concentration: '100%',
        origin: 'Saudi Arabia'
      }
    },
    {
      name: 'Amber Luxe Spray',
      nameAr: 'رذاذ العنبر الفاخر',
      description: 'Luxurious amber fragrance spray',
      descriptionAr: 'رذاذ العنبر الفاخر للرجال',
      price: 320,
      category: 'mens',
      image: 'https://via.placeholder.com/300?text=Amber+Luxe',
      stock: 60,
      rating: 4.4,
      vendor: adminUser._id,
      sku: 'AMBE-001',
      fragrance: {
        type: 'Eau de Parfum',
        family: 'Oriental',
        notes: ['Amber', 'Sandalwood', 'Vanilla']
      },
      specifications: {
        volume: '100ml',
        concentration: '15%',
        origin: 'Saudi Arabia'
      }
    }
  ]

  const createdProducts = await Product.insertMany(products)

  const customerUser = new User({
    name: 'Test Customer',
    email: 'customer@saudiessence.sa',
    phone: '+966501234568',
    password: 'SaEssence#Cust26',
    role: 'customer',
    loyaltyPoints: 500
  })
  await customerUser.save()

  return { products: createdProducts.length, users: 2 }
}
