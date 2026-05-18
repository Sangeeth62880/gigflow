import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface ILead extends Document {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: string;
  createdBy: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      enum: ['Organic', 'Referral', 'LinkedIn', 'Twitter', 'Direct', 'Other', 'Website', 'Instagram'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead must belong to a user'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure email is unique per user
LeadSchema.index({ email: 1, createdBy: 1 }, { unique: true });

// Performance indexes
LeadSchema.index({ createdBy: 1 });
LeadSchema.index({ createdBy: 1, status: 1 });
LeadSchema.index({ createdBy: 1, source: 1 });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
