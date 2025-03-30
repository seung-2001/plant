import mongoose, { Document, Types } from 'mongoose';

export interface IPost extends Document {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: {
    content: string;
    author: Types.ObjectId;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

export const Post = mongoose.model<IPost>('Post', postSchema); 