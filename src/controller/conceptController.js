import Concept from '../model/conceptModel';
import TeacherDiscipline from '../model/teacherDisciplineModel';
import ClassDiscipline from '../model/classDisciplineModel';
import StudentClass from '../model/studentClassModel';
import User from '../model/userModel';

class ConceptController {
  async store(req, res) {
    try {
      if (req.user.userType !== 'professor') {
        return res.status(403).json({ error: 'Acesso negado. Apenas professores podem cadastrar conceitos.' });
      }

      const { studentId, classId, disciplineId, concept } = req.body;

      const teacherDiscipline = await TeacherDiscipline.findOne({ teacher: req.user._id, discipline: disciplineId });
      if (!teacherDiscipline) {
        return res.status(403).json({ message: 'Você não tem permissão para acessar esta disciplina.' });
      }

      const studentClass = await StudentClass.findOne({ student: studentId, class: classId });
      if (!studentClass) {
        return res.status(400).json({ message: 'O aluno não está matriculado nesta turma.' });
      }

      let existingConcept = await Concept.findOne({ student: studentId, discipline: disciplineId });

      if (existingConcept) {
        existingConcept.concept = concept;
        await existingConcept.save();
        return res.status(200).json({ message: 'Conceito atualizado com sucesso', concept: existingConcept });
      } else {
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

      const teacherDiscipline = await TeacherDiscipline.findOne({ teacher: teacherId, discipline: disciplineId });
      if (!teacherDiscipline) {
        return res.status(403).json({ message: 'Você não tem permissão para acessar esta disciplina.' });
      }

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

  async getDisciplineStudentsAndGrades(req, res) {
    try {
      const { disciplineId } = req.params;
      console.log('Buscando para disciplina:', disciplineId);

      const classDisciplines = await ClassDiscipline.find({ discipline: disciplineId });
      console.log('ClassDisciplines:', classDisciplines);

      const studentClasses = await StudentClass.find({
        class: { $in: classDisciplines.map(cd => cd.class) }
      }).populate('student', 'name');
      console.log('StudentClasses:', studentClasses);

      const concepts = await Concept.find({
        discipline: disciplineId,
        student: { $in: studentClasses.map(sc => sc.student._id) }
      });
      console.log('Concepts:', concepts);

      const formattedData = studentClasses.map(sc => ({
        studentId: sc.student._id,
        studentName: sc.student.name,
        concept: concepts.find(c => c.student.toString() === sc.student._id.toString())?.concept || 'Não atribuído'
      }));

      console.log('Formatted Data:', formattedData);
      res.json(formattedData);
    } catch (error) {
      console.error('Erro detalhado:', error);
      res.status(500).json({ message: 'Erro ao buscar alunos e conceitos', error: error.message });
    }
  }
}

export default new ConceptController();