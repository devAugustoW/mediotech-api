import mongoose from 'mongoose';

const StudentClassSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turma',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('StudentClass', StudentClassSchema);