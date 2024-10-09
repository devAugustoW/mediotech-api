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

			// Gerar token JWT
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
			console.error('Erro no login:', error);  
			console.log('Request body:', req.body);  
			return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
	}

	// cria um novo usuário por coordenador
	async storeByCoordinator(req, res) {
		try {
			// Verifica se o usuário autenticado é um coordenador
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

			return res.status(201).json({ message: 'Usuário cadastrado com sucesso', newUser });

		} catch (error) {
			console.error('Erro no cadastro de usuário por coordenador:', error);
			console.log('Request body:', req.body);
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
			console.error('Erro na busca de usuários:', error);
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

			// extrai os dados da requisição
      const { id } = req.params;
      const { name, email, password, userType } = req.body;

			// procura o usuário pelo ID
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

			// atualiza os campos fornecidos pela requisição
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password_hash = await bcrypt.hash(password, 8);
      if (userType) user.userType = userType;

      await user.save();
      return res.status(200).json({ message: 'Usuário atualizado com sucesso', user });

    } catch (error) {
			console.error('Erro na atualização do usuário:', error);
			res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

	// deleta um usuário
  async deleteUser(req, res) {
		try {
			if (req.user.userType !== 'coordenador') {
				return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem deletar usuários.' });
			}
	
			const { id } = req.params;
	
			const user = await User.findById(id);
			if (!user) res.status(404).json({ error: 'Usuário não encontrado.' });
	
			// método para procurar e deletar
			await User.findByIdAndDelete(id);
			return res.status(200).json({ message: 'Usuário deletado com sucesso' });
	
		} catch (error) {
			console.error('Erro na exclusão do usuário:', error);
			res.status(500).json({ message: 'Erro no servidor', error: error.message });
		}
	}
}

export default new UserController();