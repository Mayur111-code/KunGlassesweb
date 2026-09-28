import mongoose, { type Document, type Model, Schema, Types } from 'mongoose';
import { ENQUIRY_STATUS, type EnquiryStatus } from '../config/constants';

export interface IEnquiryNote {
  note: string;
  addedBy?: Types.ObjectId;
  createdAt: Date;
}

export interface IEnquiry extends Document {
  fullName: string;
  phone: string;
  email?: string;
  company?: string;
  serviceInterestedIn?: Types.ObjectId;
  serviceInterestedInName?: string;
  message: string;
  preferredContactMethod: 'phone' | 'email' | 'whatsapp';
  location?: string;
  source: 'website' | 'whatsapp' | 'phone' | 'email' | 'referral' | 'other';
  status: EnquiryStatus;
  assignedTo?: Types.ObjectId;
  followUpDate?: Date;
  notes: IEnquiryNote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IEnquiryModel extends Model<IEnquiry> {}

const enquiryNoteSchema = new Schema<IEnquiryNote>(
  {
    note: {
      type: String,
      required: true,
      trim: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: undefined,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const enquirySchema = new Schema<IEnquiry, IEnquiryModel>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    company: {
      type: String,
      trim: true,
    },
    serviceInterestedIn: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      default: undefined,
    },
    serviceInterestedInName: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email', 'whatsapp'],
      default: 'phone',
    },
    location: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'phone', 'email', 'referral', 'other'],
      default: 'website',
    },
    status: {
      type: String,
      enum: Object.values(ENQUIRY_STATUS),
      default: ENQUIRY_STATUS.NEW,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: undefined,
    },
    followUpDate: {
      type: Date,
      default: undefined,
    },
    notes: [enquiryNoteSchema],
  },
  {
    timestamps: true,
  }
);

enquirySchema.index({ status: 1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ phone: 1 });
enquirySchema.index({ createdAt: -1 });

const Enquiry = mongoose.model<IEnquiry, IEnquiryModel>('Enquiry', enquirySchema);

export default Enquiry;
