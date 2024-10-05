import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  year: { type: Number, required: true, },
  semester: { type: Number, required: true, },
}, { timestamps: true, });

export default mongoose.model('Class', ClassSchema);