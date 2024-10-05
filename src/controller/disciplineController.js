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
}

export default new DisciplineController();