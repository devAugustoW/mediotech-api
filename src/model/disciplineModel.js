import mongoose from 'mongoose';

const DisciplineSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  description: { type: String, required: true, },
}, { timestamps: true, });

export default mongoose.model('Discipline', DisciplineSchema);