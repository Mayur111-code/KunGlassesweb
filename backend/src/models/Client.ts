import mongoose, { type Document, type Model, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IClient extends Document {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  websiteUrl?: string;
  category?: string;
  location?: string;
  projectDescription?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClientModel extends Model<IClient> {}

const clientSchema = new Schema<IClient, IClientModel>(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    logo: {
      type: String,
      default: undefined,
    },
    description: {
      type: String,
      trim: true,
    },
    websiteUrl: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    projectDescription: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

clientSchema.index({ isActive: 1 });

clientSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Client = mongoose.model<IClient, IClientModel>('Client', clientSchema);

export default Client;
