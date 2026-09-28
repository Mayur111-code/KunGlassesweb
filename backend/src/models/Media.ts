import mongoose, { type Document, type Model, Schema, Types } from 'mongoose';

export interface IMedia extends Document {
  sourceType: 'upload' | 'url';
  publicId?: string;
  secureUrl: string;
  resourceType: string;
  fileName?: string;
  folder?: string;
  altText?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  uploadedBy?: Types.ObjectId;
  createdAt: Date;
}

export interface IMediaModel extends Model<IMedia> {}

const mediaSchema = new Schema<IMedia, IMediaModel>(
  {
    sourceType: {
      type: String,
      enum: ['upload', 'url'],
      default: 'upload',
      required: true,
    },
    publicId: {
      type: String,
      sparse: true,
    },
    secureUrl: {
      type: String,
      required: [true, 'Secure URL is required'],
    },
    resourceType: {
      type: String,
      required: [true, 'Resource type is required'],
    },
    fileName: {
      type: String,
    },
    folder: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: undefined,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

mediaSchema.index({ folder: 1 });
mediaSchema.index({ createdAt: -1 });

const Media = mongoose.model<IMedia, IMediaModel>('Media', mediaSchema);

export default Media;
