import mongoose, { type Document, type Model, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ISpecification {
  label: string;
  value: string;
}

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  featuredImage?: string;
  gallery: string[];
  features: string[];
  specifications: ISpecification[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceModel extends Model<IService> {}

const serviceSchema = new Schema<IService, IServiceModel>(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    featuredImage: {
      type: String,
      default: undefined,
    },
    gallery: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: [
      {
        label: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    seoTitle: {
      type: String,
      maxlength: [70, 'SEO title cannot exceed 70 characters'],
    },
    seoDescription: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters'],
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ isActive: 1 });
serviceSchema.index({ displayOrder: 1 });

serviceSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Service = mongoose.model<IService, IServiceModel>('Service', serviceSchema);

export default Service;
