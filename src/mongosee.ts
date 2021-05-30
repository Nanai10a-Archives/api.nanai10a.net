import * as uuid from "uuid";
import mongoose from "mongoose";

const DescriptionSchema = new mongoose.Schema({
  id: { default: () => uuid.v4(), required: true, type: String, unique: true },
  markdown: { required: true, type: String },
  timestamp: { default: Date.now, required: true, type: Date },
  updates: [
    {
      markdown: { required: true, type: String },
      timestamp: { default: Date.now, required: true, type: Date },
    },
  ],
});

export const Description = mongoose.model("Description", DescriptionSchema);
export type DescriptionType = mongoose.Model<{
  id: string;
  markdown: string;
  timestamp: Date;
  updates: Array<{ markdown: string; timestamp: Date }>;
}>;
