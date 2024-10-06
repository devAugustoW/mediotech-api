import Discipline from '../model/disciplineModel';

class DisciplineController {
  // cria uma nova disciplina
  async store(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem criar disciplinas.' });
      }

      const { name, description } = req.body;

      // cria a disciplina
      const newDiscipline = await Discipline.create({ name, description });

      return res.status(201).json({ message: 'Disciplina cadastrada com sucesso', newDiscipline });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // lista todas as disciplinas
  async getAllDisciplines(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem visualizar disciplinas.' });
      }

      const disciplines = await Discipline.find();
      return res.status(200).json(disciplines);

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // atualiza uma disciplina
  async updateDiscipline(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem atualizar disciplinas.' });
      }

      const { id } = req.params;
      const { name, description } = req.body;

      const disciplineToUpdate = await Discipline.findById(id);
      if (!disciplineToUpdate) return res.status(404).json({ error: 'Disciplina não encontrada.' });

      if (name) disciplineToUpdate.name = name;
      if (description) disciplineToUpdate.description = description;

      await disciplineToUpdate.save();
      return res.status(200).json({ message: 'Disciplina atualizada com sucesso', disciplineToUpdate });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // deleta uma disciplina
  async deleteDiscipline(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem deletar disciplinas.' });
      }

      const { id } = req.params;

      const disciplineToDelete = await Discipline.findById(id);
      if (!disciplineToDelete) return res.status(404).json({ error: 'Disciplina não encontrada.' });

      await Discipline.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Disciplina deletada com sucesso' });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new DisciplineController();