import Class from '../model/classModel';
import ClassDiscipline from '../model/classDisciplineModel';
import Discipline from '../model/disciplineModel';
import StudentClass from '../model/studentClassModel';
import Concept from '../model/conceptModel';
import User from '../model/userModel';

class classController {
  // cria uma nova turma
  async store(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem criar turmas.' });

      const { name, year, semester } = req.body;

      // cria a turma
      const newClass = await Class.create({ name, year, semester });

      return res.status(201).json({ message: 'Turma cadastrada com sucesso', newClass });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // lista todas as turmas
  async getAllClasses(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem visualizar turmas.' });
      }

      const classes = await Class.find();
      return res.status(200).json(classes);

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

	
  // edita uma turma
  async updateClass(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem editar turmas.' });
      }

      const { id } = req.params;
      const { name, year, semester } = req.body;

      const classToUpdate = await Class.findById(id);
      if (!classToUpdate) return res.status(404).json({ error: 'Turma não encontrada.' });

      if (name) classToUpdate.name = name;
      if (year) classToUpdate.year = year;
      if (semester) classToUpdate.semester = semester;

      await classToUpdate.save();
      return res.status(200).json({ message: 'Turma atualizada com sucesso', classToUpdate });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // deleta uma turma
  async deleteClass(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem deletar turmas.' });
      }

      const { id } = req.params;

      const classToDelete = await Class.findById(id);
      if (!classToDelete) return res.status(404).json({ error: 'Turma não encontrada.' });

      await Class.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Turma deletada com sucesso' });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

	async getClassesWithDisciplines(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem visualizar turmas e disciplinas.' });
      }

      const classes = await Class.find().lean();
      
      const classesWithDisciplines = await Promise.all(classes.map(async (classItem) => {
        const classDisciplines = await ClassDiscipline.find({ class: classItem._id })
          .populate('discipline', 'name description')
          .lean();
        
        const disciplines = classDisciplines.map(cd => cd.discipline);
        
        return {
          ...classItem,
          disciplines: disciplines
        };
      }));

      res.json(classesWithDisciplines);
    } catch (error) {
      console.error('Erro ao buscar turmas e disciplinas:', error);
      res.status(500).json({ message: 'Erro ao buscar turmas e disciplinas' });
    }
  }

	async getDisciplineStudentsAndConcepts(req, res) {
    try {
      const { disciplineId } = req.params;

      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem visualizar alunos e conceitos.' });
      }

      // Buscar as relações entre classe e disciplina
      const classDisciplines = await ClassDiscipline.find({ discipline: disciplineId });

      // Buscar os alunos de todas as turmas que têm esta disciplina
      const studentClasses = await StudentClass.find({
        class: { $in: classDisciplines.map(cd => cd.class) }
      }).populate('student', 'name');

      // Buscar os conceitos dos alunos para esta disciplina
      const concepts = await Concept.find({
        discipline: disciplineId,
        student: { $in: studentClasses.map(sc => sc.student._id) }
      });

      // Combinar os dados
      const studentsWithConcepts = studentClasses.map(sc => ({
        studentId: sc.student._id,
        studentName: sc.student.name,
        concept: concepts.find(c => c.student.toString() === sc.student._id.toString())?.concept || 'Não atribuído'
      }));

      res.json(studentsWithConcepts);
    } catch (error) {
      console.error('Erro ao buscar alunos e conceitos:', error);
      res.status(500).json({ message: 'Erro ao buscar alunos e conceitos', error: error.message });
    }
  }
}

export default new classController();