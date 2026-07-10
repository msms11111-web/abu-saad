import mongoose, { Schema, Document } from 'mongoose'

export interface ICoupon extends Document {
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxUses: number
  currentUses: number
  minOrderValue: number
  expiryDate: Date
  isActive: boolean
  applicableCategories: string[]
  excludedProducts: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: /^[A-Z0-9]{3,20}$/
    },
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    maxUses: {
      type: Number,
      default: null
    },
    currentUses: {
      type: Number,
      default: 0
    },
    minOrderValue: {
      type: Number,
      default: 0
    },
    expiryDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    applicableCategories: [String],
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  { timestamps: true }
)

couponSchema.methods.isValid = function () {
  const now = new Date()
  return (
    this.isActive &&
    this.expiryDate > now &&
    (!this.maxUses || this.currentUses < this.maxUses)
  )
}

couponSchema.methods.calculateDiscount = function (total: number) {
  if (this.discountType === 'percentage') {
    return (total * this.discountValue) / 100
  }
  return this.discountValue
}

export default mongoose.model<ICoupon>('Coupon', couponSchema)
