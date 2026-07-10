import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  type: 'order' | 'product' | 'promotion' | 'system'
  title: string
  titleAr: string
  message: string
  messageAr: string
  icon?: string
  data?: Record<string, any>
  isRead: boolean
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['order', 'product', 'promotion', 'system'],
      default: 'system'
    },
    title: {
      type: String,
      required: true
    },
    titleAr: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    messageAr: {
      type: String,
      required: true
    },
    icon: String,
    data: Schema.Types.Mixed,
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date
  },
  { timestamps: true }
)

// Auto-delete old notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 })

export default mongoose.model<INotification>('Notification', notificationSchema)
