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

  // resgata todos os relacionamentos entre professores e disciplinas
  async getAllTeacherDisciplines(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem visualizar os relacionamentos entre professores e disciplinas.' });
      }

      // busca todos os relacionamentos
      const teacherDisciplines = await TeacherDiscipline.find().populate('teacher').populate('discipline');

      return res.status(200).json(teacherDisciplines);

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // edita um relacionamento entre professor e disciplina
  async updateTeacherDiscipline(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem editar relacionamentos entre professores e disciplinas.' });
      }

      const { id } = req.params;
      const { teacher, discipline } = req.body;

      // atualiza o relacionamento
      const updatedTeacherDiscipline = await TeacherDiscipline.findByIdAndUpdate(id, { teacher, discipline }, { new: true });

      if (!updatedTeacherDiscipline) {
        return res.status(404).json({ error: 'Relacionamento não encontrado.' });
      }

      return res.status(200).json({ message: 'Relacionamento atualizado com sucesso', updatedTeacherDiscipline });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // deleta um relacionamento entre professor e disciplina
  async deleteTeacherDiscipline(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem deletar relacionamentos entre professores e disciplinas.' });
      }

      const { id } = req.params;

      // deleta o relacionamento
      const deletedTeacherDiscipline = await TeacherDiscipline.findByIdAndDelete(id);

      if (!deletedTeacherDiscipline) {
        return res.status(404).json({ error: 'Relacionamento não encontrado.' });
      }

      return res.status(200).json({ message: 'Relacionamento deletado com sucesso' });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new TeacherDisciplineController();