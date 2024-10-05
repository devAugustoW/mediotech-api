import StudentClass from '../model/studentClassModel';

class StudentClassController {
  // cria um novo relacionamento entre aluno e turma
  async store(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem relacionar alunos a turmas.' });
      }

      const { student, class: classId } = req.body;

      // cria o relacionamento
      const newStudentClass = await StudentClass.create({ student, class: classId });

      return res.status(201).json({ message: 'Relacionamento criado com sucesso', newStudentClass });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new StudentClassController();