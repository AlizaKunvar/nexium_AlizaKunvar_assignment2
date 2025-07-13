import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("MongoDB URI missing");

export async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI);
}

const BlogSchema = new mongoose.Schema({
  url: String,
  fullText: String,
});

export const Blog =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
