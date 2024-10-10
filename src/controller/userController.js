import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from "../model/userModel";
import TeacherDiscipline from '../model/teacherDisciplineModel.js';
import ClassDiscipline from '../model/classDisciplineModel.js';
import StudentClass from '../model/studentClassModel.js';
import Concept from '../model/conceptModel.js';
import conceptController from './conceptController.js';

dotenv.config();

class UserController {
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
      const newUser = await User.create({ name, email, password_hash, userType });
      console.log('Senha criptografada na criação do usuário:', password_hash);

      return res.status(201).json({ message: 'Usuário cadastrado com sucesso', newUser });
    } catch (error) {
      console.log('Erro ao criar usuário:', error);
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
      const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '24h' });

      return res.json({
        user: {
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
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem deletar usuários.' });
      }

      const { id } = req.params;

      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      return res.status(200).json({ message: 'Usuário deletado com sucesso', deletedUser });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // busca as turmas e disciplinas vinculadas ao professor
  async getTeacherClassesAndDisciplines(req, res) {
		console.log('Requisição recebida para buscar turmas e disciplinas');
		try {
			const teacherId = req.user._id;
			console.log('ID do professor:', teacherId);
	
			const teacherDisciplines = await TeacherDiscipline.find({ teacher: teacherId }).populate('discipline');
			console.log('Disciplinas do professor:', teacherDisciplines);
	
			const classesAndDisciplines = await ClassDiscipline.find({
				discipline: { $in: teacherDisciplines.map(td => td.discipline._id) }
			}).populate('class').populate('discipline');
			console.log('Turmas e disciplinas:', classesAndDisciplines);
	
			const result = classesAndDisciplines.reduce((acc, cd) => {
				if (!acc[cd.class._id]) {
					acc[cd.class._id] = {
						classId: cd.class._id.toString(), // Adicione esta linha
						className: cd.class.name,
						disciplines: []
					};
				}
				acc[cd.class._id].disciplines.push({
					disciplineId: cd.discipline._id,
					disciplineName: cd.discipline.name
				});
				return acc;
			}, {});
	
			console.log('Resultado final:', result);
			res.json(Object.values(result));
		} catch (error) {
			console.error('Erro no servidor:', error);
			res.status(500).json({ message: 'Erro ao buscar dados', error: error.message });
		}
	}

	// buscar alunos por disciplina
	async getStudentsByDiscipline(req, res) {
		try {
			const { disciplineId } = req.params;
			const teacherId = req.user._id;
	
			// Verificar se o professor está associado à disciplina
			const teacherDiscipline = await TeacherDiscipline.findOne({ teacher: teacherId, discipline: disciplineId });
			if (!teacherDiscipline) {
				return res.status(403).json({ message: 'Você não tem permissão para acessar esta disciplina.' });
			}
	
			// Buscar as turmas associadas à disciplina
			const classDisciplines = await ClassDiscipline.find({ discipline: disciplineId }).populate('class');
	
			// Buscar os alunos de todas as turmas associadas
			const studentClasses = await StudentClass.find({
				class: { $in: classDisciplines.map(cd => cd.class._id) }
			}).populate('student');
	
			// Extrair apenas as informações necessárias dos alunos
			const students = studentClasses.map(sc => ({
				id: sc.student._id,
				name: sc.student.name,
				email: sc.student.email
			}));
	
			res.json(students);
		} catch (error) {
			console.error('Erro ao buscar alunos por disciplina:', error);
			res.status(500).json({ message: 'Erro ao buscar alunos', error: error.message });
		}
	}

	async getStudentsByClass(req, res) {
		try {
			const { classId } = req.params;
			const teacherId = req.user._id;
	
			// Verificar se o professor está associado à turma
			const teacherDisciplines = await TeacherDiscipline.find({ teacher: teacherId });
			const classDiscipline = await ClassDiscipline.findOne({
				class: classId,
				discipline: { $in: teacherDisciplines.map(td => td.discipline) }
			});
	
			if (!classDiscipline) {
				return res.status(403).json({ message: 'Você não tem permissão para acessar esta turma.' });
			}
	
			// Buscar os alunos da turma
			const studentClasses = await StudentClass.find({ class: classId }).populate('student');
	
			// Extrair apenas as informações necessárias dos alunos
			const students = studentClasses.map(sc => ({
				_id: sc.student._id,
				name: sc.student.name,
				email: sc.student.email
			}));
	
			res.json(students);
		} catch (error) {
			console.error('Erro ao buscar alunos da turma:', error);
			res.status(500).json({ message: 'Erro ao buscar alunos', error: error.message });
		}
	}

	async getStudentsAndConceptsByClass(req, res) {
		try {
			const { classId } = req.params;
			const teacherId = req.user._id;
	
			// Verificar se o professor está associado à turma
			const teacherDisciplines = await TeacherDiscipline.find({ teacher: teacherId });
			const classDiscipline = await ClassDiscipline.findOne({
				class: classId,
				discipline: { $in: teacherDisciplines.map(td => td.discipline) }
			});
	
			if (!classDiscipline) {
				return res.status(403).json({ message: 'Você não tem permissão para acessar esta turma.' });
			}
	
			// Buscar os alunos da turma
			const studentClasses = await StudentClass.find({ class: classId }).populate('student');
	
			// Buscar os conceitos dos alunos
			const studentsWithConcepts = await Promise.all(studentClasses.map(async (sc) => {
				const conceptDoc = await Concept.findOne({ 
					student: sc.student._id, 
					discipline: classDiscipline.discipline 
				});
	
				return {
					_id: sc.student._id,
					name: sc.student.name,
					concept: conceptDoc ? conceptDoc.concept : 'Não avaliado'
				};
			}));
	
			res.json(studentsWithConcepts);
		} catch (error) {
			console.error('Erro ao buscar alunos e conceitos da turma:', error);
			res.status(500).json({ message: 'Erro ao buscar alunos e conceitos', error: error.message });
		}
	}
}

export default new UserController();