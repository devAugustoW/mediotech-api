import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
	name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  userType: { type: String, enum: ['aluno', 'professor', 'coordenador'], required: true },
	createdAt: { type: Date, default: Date.now, }	
});


UserSchema.pre('save', async function(next){
  const user = this;

	// Verifica se a senha foi modificada antes de criptografá-la
  if(!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(8);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
    next();

  } catch (error) {
    next(error);
  }
})

export default model('User', UserSchema);