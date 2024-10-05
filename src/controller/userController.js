import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from "../model/userModel";

dotenv.config();

class UserController{
	// cria um novo usuário sem autenticação
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

			// Gerar token JWT com expiração de 1 dia
			const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '24h', });

			return res.json({ 
				user:{
					name: user.name,
					email: user.email,
					userType: user.userType
				}, 
				token
			});

    } catch (error) {
			return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
	}

	// cria um novo usuário por coordenador
	async storeByCoordinator(req, res) {
		try {
			// Verifica se o usuário autenticado é um coordenador
			console.log('Tipo de usuário autenticado:', req.user.userType);
			if (req.user.userType !== 'coordenador') {
				return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem criar usuários.' });
			}

			const { name, email, password, userType } = req.body;

			// Verifica se o usuário já existe
			let userExists = await User.findOne({ email });
			if (userExists) return res.status(400).json({ error: 'Usuário já cadastrado.' });

			// criptografa a senha
			const password_hash = await bcrypt.hash(password, 8);

			// cria o usuário
			const newUser = await User.create({ name, email, password_hash, userType });
			console.log('Senha criptografada na criação do usuário:', password_hash);

			return res.status(201).json({ message: 'Usuário cadastrado com sucesso', newUser });

		} catch (error) {
			res.status(500).json({ message: 'Erro no servidor', error: error.message });
		}
	}

	// resgata todos os usuários
  async getAllUsers(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem visualizar usuários.' });
      }

      const users = await User.find();
      return res.status(200).json(users);

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

	// atualiza um usuário
  async updateUser(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem atualizar usuários.' });
      }

      const { id } = req.params;
      const { name, email, password, userType } = req.body;

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password_hash = await bcrypt.hash(password, 8);
      if (userType) user.userType = userType;

      await user.save();
      return res.status(200).json({ message: 'Usuário atualizado com sucesso', user });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

	// deleta um usuário
  async deleteUser(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem deletar usuários.' });
      }

      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

      await user.remove();
      return res.status(200).json({ message: 'Usuário deletado com sucesso' });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new UserController();