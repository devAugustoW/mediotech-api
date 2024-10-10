import Concept from '../model/conceptModel';
import TeacherDiscipline from '../model/teacherDisciplineModel.js';
import ClassDiscipline from '../model/classDisciplineModel.js';
import StudentClass from '../model/studentClassModel.js';

class ConceptController {
  // cria um novo conceito
  async store(req, res) {
    try {
      // Verifica se o usuário autenticado é um professor
      if (req.user.userType !== 'professor') {
        return res.status(403).json({ error: 'Acesso negado. Apenas professores podem cadastrar conceitos.' });
      }

      const { student, discipline, concept } = req.body;

      // Verificar se o professor está associado à disciplina
      const teacherDiscipline = await TeacherDiscipline.findOne({ teacher: req.user._id, discipline });
      if (!teacherDiscipline) {
        return res.status(403).json({ message: 'Você não tem permissão para acessar esta disciplina.' });
      }

      // cria o conceito
      const newConcept = await Concept.create({ student, discipline, concept });

      return res.status(201).json({ message: 'Conceito cadastrado com sucesso', newConcept });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
  
  async getConceptsByDiscipline(req, res) {
    try {
      const { disciplineId } = req.params;
      const teacherId = req.user._id;

      // Verificar se o professor está associado à disciplina
      const teacherDiscipline = await TeacherDiscipline.findOne({ teacher: teacherId, discipline: disciplineId });
      if (!teacherDiscipline) {
        return res.status(403).json({ message: 'Você não tem permissão para acessar esta disciplina.' });
      }

      // Buscar os conceitos da disciplina
      const concepts = await Concept.find({ discipline: disciplineId })
        .populate('student', 'name email')
        .select('student conceptValue createdAt updatedAt');

      res.json(concepts);
    } catch (error) {
      console.error('Erro ao buscar conceitos por disciplina:', error);
      res.status(500).json({ message: 'Erro ao buscar conceitos', error: error.message });
    }
  }
}

export default new ConceptController();