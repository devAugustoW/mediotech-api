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
}

export default new classController();