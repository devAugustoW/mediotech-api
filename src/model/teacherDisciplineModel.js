import mongoose from 'mongoose';

const TeacherDisciplineSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

export default mongoose.model('TeacherDiscipline', TeacherDisciplineSchema);