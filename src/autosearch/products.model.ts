import * as mongoose from 'mongoose';

export const AutoSearchSchema = new mongoose.Schema(
  {
    isActive: Boolean,
    url: String,
  },
  { timestamps: true, versionKey: false },
);
