import mongoose from 'mongoose';

const ConceptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  discipline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discipline',
    required: true,
  },
  concept: {
    type: String, 
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Concept', ConceptSchema);