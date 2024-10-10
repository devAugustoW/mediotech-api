import Concept from '../model/conceptModel';
import TeacherDiscipline from '../model/teacherDisciplineModel.js';
import ClassDiscipline from '../model/classDisciplineModel.js';
import StudentClass from '../model/studentClassModel.js';

class ConceptController {
  async store(req, res) {
    console.log('Requisição recebida para adicionar conceito');
    console.log('Corpo da requisição:', req.body);
    console.log('Usuário autenticado:', req.user);

    try {
      // Verifica se o usuário autenticado é um professor
      if (req.user.userType !== 'professor') {
        return res.status(403).json({ error: 'Acesso negado. Apenas professores podem cadastrar conceitos.' });
      }

      const { studentId, classId, disciplineId, concept } = req.body;

      // Verificar se o professor está associado à disciplina
      const teacherDiscipline = await TeacherDiscipline.findOne({ teacher: req.user._id, discipline: disciplineId });
      if (!teacherDiscipline) {
        return res.status(403).json({ message: 'Você não tem permissão para acessar esta disciplina.' });
      }

      // Verificar se o aluno está na turma
      const studentClass = await StudentClass.findOne({ student: studentId, class: classId });
      if (!studentClass) {
        return res.status(400).json({ message: 'O aluno não está matriculado nesta turma.' });
      }

      // Verificar se já existe um conceito para este aluno nesta disciplina
      let existingConcept = await Concept.findOne({ student: studentId, discipline: disciplineId });

      if (existingConcept) {
        // Se já existe, atualiza o conceito
        existingConcept.concept = concept;
        await existingConcept.save();
        return res.status(200).json({ message: 'Conceito atualizado com sucesso', concept: existingConcept });
      } else {
        // Se não existe, cria um novo conceito
        const newConcept = await Concept.create({ student: studentId, discipline: disciplineId, concept });
        return res.status(201).json({ message: 'Conceito cadastrado com sucesso', concept: newConcept });
      }

    } catch (error) {
      console.error('Erro ao cadastrar/atualizar conceito:', error);
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
        .select('student concept createdAt updatedAt');

      res.json(concepts);
    } catch (error) {
      console.error('Erro ao buscar conceitos por disciplina:', error);
      res.status(500).json({ message: 'Erro ao buscar conceitos', error: error.message });
    }
  }

	async update(req, res) {
    try {
      const { studentId } = req.params;
      const { concept, disciplineId } = req.body;

      const updatedConcept = await Concept.findOneAndUpdate(
        { student: studentId, discipline: disciplineId },
        { concept },
        { new: true, upsert: true }
      );

      if (!updatedConcept) {
        return res.status(404).json({ message: 'Conceito não encontrado' });
      }

      res.json(updatedConcept);
    } catch (error) {
      console.error('Erro ao atualizar conceito:', error);
      res.status(500).json({ message: 'Erro ao atualizar conceito', error: error.message });
    }
  }

	async delete(req, res) {
    try {
      const { studentId, disciplineId } = req.params;

      const deletedConcept = await Concept.findOneAndDelete({
        student: studentId,
        discipline: disciplineId
      });

      if (!deletedConcept) {
        return res.status(404).json({ message: 'Conceito não encontrado' });
      }

      res.json({ message: 'Conceito deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar conceito:', error);
      res.status(500).json({ message: 'Erro ao deletar conceito', error: error.message });
    }
  }
}

export default new ConceptController();