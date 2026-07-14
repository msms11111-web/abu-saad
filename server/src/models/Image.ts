import mongoose, { Schema, Document } from 'mongoose'

export interface IImage extends Document {
  data: Buffer
  contentType: string
  createdAt: Date
}

// Stores product images as documents rather than files on disk — Render's
// free web service filesystem is wiped on every restart/redeploy, but
// MongoDB Atlas data persists, so this is the reliable place to keep them.
const imageSchema = new Schema<IImage>({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IImage>('Image', imageSchema)
