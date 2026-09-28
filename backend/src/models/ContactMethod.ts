import mongoose, { type Document, type Model, Schema } from 'mongoose';

export interface IContactMethod extends Document {
  type: 'phone' | 'whatsapp' | 'email';
  value: string;
  label?: string;
  isPrimary: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactMethodModel extends Model<IContactMethod> {}

const contactMethodSchema = new Schema<IContactMethod, IContactMethodModel>(
  {
    type: {
      type: String,
      required: [true, 'Contact type is required'],
      enum: ['phone', 'whatsapp', 'email'],
    },
    value: {
      type: String,
      required: [true, 'Contact value is required'],
      trim: true,
    },
    label: {
      type: String,
      trim: true,
    },
    isPrimary: {
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

contactMethodSchema.index({ type: 1 });
contactMethodSchema.index({ isActive: 1 });

const ContactMethod = mongoose.model<IContactMethod, IContactMethodModel>(
  'ContactMethod',
  contactMethodSchema
);

export default ContactMethod;
