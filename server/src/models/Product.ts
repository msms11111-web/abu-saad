import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  discountPrice?: number;
  category: string;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: mongoose.Types.ObjectId[];
  sku: string;
  vendor: mongoose.Types.ObjectId;
  fragrance: {
    type: string;
    family: string;
    notes: string[];
  };
  specifications: {
    volume: string;
    concentration: string;
    origin: string;
    ingredients?: string[];
  };
  isFeature: boolean;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    nameAr: {
      type: String,
      required: [true, 'اسم المنتج مطلوب'],
      maxlength: [200, 'اسم المنتج لا يمكن أن يتجاوز 200 حرف']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Description must be at least 10 characters']
    },
    descriptionAr: {
      type: String,
      required: [true, 'وصف المنتج مطلوب'],
      minlength: [10, 'الوصف يجب أن يكون على الأقل 10 أحرف']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (v: number | null) {
          if (v === null) return true;
          return v < this.price;
        },
        message: 'Discount price must be less than original price'
      }
    },
    category: {
      type: String,
      required: true,
      enum: ['mens', 'womens', 'unisex', 'bakhoor', 'oils', 'accessories']
    },
    image: {
      type: String,
      required: [true, 'Product image is required']
    },
    images: [
      {
        type: String
      }
    ],
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative']
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    sku: {
      type: String,
      unique: true,
      required: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fragrance: {
      type: {
        type: String,
        enum: ['Eau de Parfum', 'Eau de Toilette', 'Eau de Cologne', 'Pure Perfume', 'Attar']
      },
      family: {
        type: String,
        enum: ['Floral', 'Oriental', 'Woody', 'Fresh', 'Fruity', 'Spicy']
      },
      notes: [String]
    },
    specifications: {
      volume: String,
      concentration: String,
      origin: {
        type: String,
        default: 'Saudi Arabia'
      },
      ingredients: [String]
    },
    isFeature: {
      type: Boolean,
      default: false
    },
    isNew: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

productSchema.index({ nameAr: 'text', descriptionAr: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ vendor: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
