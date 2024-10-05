import ClassDiscipline from '../model/classDisciplineModel';

class ClassDisciplineController {
  // cria um novo relacionamento entre turma e disciplina
  async store(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem relacionar turmas a disciplinas.' });
      }

      const { class: classId, discipline } = req.body;

      // cria o relacionamento
      const newClassDiscipline = await ClassDiscipline.create({ class: classId, discipline });

      return res.status(201).json({ message: 'Relacionamento criado com sucesso', newClassDiscipline });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new ClassDisciplineController();