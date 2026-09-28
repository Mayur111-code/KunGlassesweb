import mongoose, { type Document, type Model, Schema, Types } from 'mongoose';
import slugify from 'slugify';

export interface IProject extends Document {
  title: string;
  slug: string;
  client?: Types.ObjectId;
  clientName: string;
  location: string;
  category: string;
  serviceName?: string;
  description: string;
  images: string[];
  completionYear?: number;
  featured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectModel extends Model<IProject> {}

const projectSchema = new Schema<IProject, IProjectModel>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      default: undefined,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    serviceName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: [
      {
        type: String,
      },
    ],
    completionYear: {
      type: Number,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ isActive: 1 });

projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Project = mongoose.model<IProject, IProjectModel>('Project', projectSchema);

export default Project;
