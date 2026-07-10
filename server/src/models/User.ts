import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'admin' | 'vendor';
  profileImage?: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  preferences: {
    language: 'ar' | 'en';
    notifications: boolean;
    newsletter: boolean;
  };
  loyaltyPoints: number;
  totalSpent: number;
  orders: mongoose.Types.ObjectId[];
  wishlist: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'يرجى إدخال اسمك'],
      minlength: [2, 'الاسم يجب أن يكون على الأقل 2 حروف'],
      maxlength: [100, 'الاسم لا يمكن أن يتجاوز 100 حرف']
    },
    email: {
      type: String,
      required: [true, 'يرجى إدخال بريدك الإلكتروني'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'البريد الإلكتروني غير صحيح']
    },
    phone: {
      type: String,
      required: [true, 'يرجى إدخال رقم الهاتف'],
      match: [/^\+?966[0-9]{9}$/, 'رقم الهاتف غير صحيح']
    },
    password: {
      type: String,
      required: [true, 'يرجى إدخال كلمة المرور'],
      minlength: [6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'],
      select: false
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'vendor'],
      default: 'customer'
    },
    profileImage: {
      type: String,
      default: null
    },
    address: {
      street: String,
      city: String,
      region: String,
      postalCode: String,
      country: { type: String, default: 'Saudi Arabia' }
    },
    preferences: {
      language: { type: String, enum: ['ar', 'en'], default: 'ar' },
      notifications: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: true }
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      }
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
