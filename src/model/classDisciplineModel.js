import mongoose from 'mongoose';

const ClassDisciplineSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  discipline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discipline',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('ClassDiscipline', ClassDisciplineSchema);