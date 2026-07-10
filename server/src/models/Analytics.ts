import mongoose, { Schema, Document } from 'mongoose'

export interface IAnalytics extends Document {
  eventType: 'page_view' | 'add_to_cart' | 'purchase' | 'review' | 'search'
  userId: mongoose.Types.ObjectId
  productId?: mongoose.Types.ObjectId
  orderId?: mongoose.Types.ObjectId
  metadata: Record<string, any>
  timestamp: Date
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    eventType: {
      type: String,
      enum: ['page_view', 'add_to_cart', 'purchase', 'review', 'search'],
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: false }
)

// Index for efficient queries
analyticsSchema.index({ eventType: 1, timestamp: -1 })
analyticsSchema.index({ userId: 1, timestamp: -1 })
analyticsSchema.index({ productId: 1 })

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema)
