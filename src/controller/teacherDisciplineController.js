import TeacherDiscipline from '../model/teacherDisciplineModel';

class TeacherDisciplineController {
  // cria um novo relacionamento entre professor e disciplina
  async store(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem relacionar professores a disciplinas.' });
      }

      const { teacher, discipline } = req.body;

      // cria o relacionamento
      const newTeacherDiscipline = await TeacherDiscipline.create({ teacher, discipline });

      return res.status(201).json({ message: 'Relacionamento criado com sucesso', newTeacherDiscipline });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new TeacherDisciplineController();