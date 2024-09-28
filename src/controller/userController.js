import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from "../model/userModel";

dotenv.config();

class UserController{
	// cria um novo usuário
	async store(req, res) {
		try {
			const { name, email, password, userType } = req.body;

			// Verifica se o usuário já existe
      let userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ error: 'Usuário já cadastrado.' });

			// criptografa a senha
			const password_hash = await bcrypt.hash(password, 8);

			// cria o usuário
			const newUser = await User.create({ name, email, password_hash, userType});
			console.log('Senha criptografada na criação do usuário:', password_hash);

			return res.status(201).json({ message: 'Usuário cadastrado com sucesso', newUser});
			
			
		} catch (error) {
			console.log('aqui')
			res.status(500).json({ message: 'Erro no servidor', error: error.message });
			
		}
	}

	// login de Usuário
	async login(req, res) {
    try {
			const { email, password } = req.body;

			const user = await User.findOne({ email });
			if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

			const isPasswordValid = await bcrypt.compare(password, user.password_hash);
			if (!isPasswordValid) return res.status(400).json({ message: 'Senha incorreta' });

			// Gerar token JWT
			const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h', });

			return res.json({ 
				user:{
					name: user.name,
					email: user.email,
					useType: user.userType
				}, 
				token
			});

    } catch (error) {
			return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
	}
}

export default new UserController();