import Class from '../model/classModel';

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
}

export default new classController();