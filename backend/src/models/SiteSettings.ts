import mongoose, { type Document, type Model, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  companyName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  aboutShort?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  ogImage?: string;
  googleVerification?: string;
  robotsContent?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  whatsappEnabled: boolean;
  whatsappDefaultMessage: string;
  address?: string;
  googleMapsUrl?: string;
  footerDescription?: string;
  copyrightText?: string;
  heroImages: {
    home?: string;
    about?: string;
    services?: string;
    projects?: string;
    clients?: string;
    contact?: string;
  };
  updatedAt: Date;
}

export interface ISiteSettingsModel extends Model<ISiteSettings> {
  getSettings(): Promise<ISiteSettings>;
}

const siteSettingsSchema = new Schema<ISiteSettings, ISiteSettingsModel>(
  {
    companyName: {
      type: String,
      default: 'KUN Glass & Aluminium',
    },
    tagline: {
      type: String,
      default: 'One Stop Solution For Glass & Aluminium Works',
    },
    logo: {
      type: String,
      default: undefined,
    },
    favicon: {
      type: String,
      default: undefined,
    },
    aboutShort: {
      type: String,
      trim: true,
    },
    seoTitle: {
      type: String,
      maxlength: [70, 'SEO title cannot exceed 70 characters'],
    },
    seoDescription: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters'],
    },
    seoKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    ogImage: {
      type: String,
      default: undefined,
    },
    googleVerification: {
      type: String,
      trim: true,
    },
    robotsContent: {
      type: String,
      trim: true,
    },
    facebookUrl: {
      type: String,
      trim: true,
    },
    instagramUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      trim: true,
    },
    whatsappEnabled: {
      type: Boolean,
      default: true,
    },
    whatsappDefaultMessage: {
      type: String,
      default: 'Hello! I am interested in your glass and aluminium services.',
    },
    address: {
      type: String,
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      trim: true,
    },
    footerDescription: {
      type: String,
      trim: true,
    },
    copyrightText: {
      type: String,
      trim: true,
    },
    heroImages: {
      home: { type: String, trim: true },
      about: { type: String, trim: true },
      services: { type: String, trim: true },
      projects: { type: String, trim: true },
      clients: { type: String, trim: true },
      contact: { type: String, trim: true },
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

siteSettingsSchema.statics.getSettings = async function (): Promise<ISiteSettings> {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const SiteSettings = mongoose.model<ISiteSettings, ISiteSettingsModel>(
  'SiteSettings',
  siteSettingsSchema
);

export default SiteSettings;
