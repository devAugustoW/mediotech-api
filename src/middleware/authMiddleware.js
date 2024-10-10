import 'dotenv/config';
import jwt from 'jsonwebtoken';
import userModel from '../model/userModel';

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    console.log('Token não fornecido.');
    return res.status(401).json({ error: 'Token não fornecido.' });
  }
  
  try {
    console.log('Token recebido:', token);
    console.log('JWT_SECRET:', JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decodificado:', decoded);

    const user = await userModel.findById(decoded.id);
    
    if (!user) {
      console.log('Usuário não encontrado para o ID:', decoded.id);
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }
    
    req.userId = user._id;
    req.user = user;

    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

export default authMiddleware;