import mongoose, { Document } from 'mongoose';

export interface IVolunteer extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  requirements: string[];
  maxParticipants: number;
  currentParticipants: number;
  organizer: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  status: 'open' | 'closed' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const volunteerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  maxParticipants: {
    type: Number,
    required: true
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['open', 'closed', 'completed'],
    default: 'open'
  }
}, {
  timestamps: true
});

export const Volunteer = mongoose.model<IVolunteer>('Volunteer', volunteerSchema); 