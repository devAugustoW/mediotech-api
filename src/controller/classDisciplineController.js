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
	
  // resgata todos os relacionamentos entre turmas e disciplinas com logs
  async getAllClassDisciplines(req, res) {
    try {
      console.log('Iniciando a busca de todos os relacionamentos entre turmas e disciplinas');
      
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        console.log('Acesso negado. Usuário não é coordenador.');
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem visualizar os relacionamentos entre turmas e disciplinas.' });
      }

      // busca todos os relacionamentos
      const classDisciplines = await ClassDiscipline.find().populate('class').populate('discipline');
      console.log('Relacionamentos encontrados:', classDisciplines);

      return res.status(200).json(classDisciplines);

    } catch (error) {
      console.error('Erro ao buscar relacionamentos:', error.message);
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // edita um relacionamento entre turma e disciplina
  async updateClassDiscipline(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem editar relacionamentos entre turmas e disciplinas.' });
      }

      const { id } = req.params;
      const { class: classId, discipline } = req.body;

      // atualiza o relacionamento
      const updatedClassDiscipline = await ClassDiscipline.findByIdAndUpdate(id, { class: classId, discipline }, { new: true });

      if (!updatedClassDiscipline) return res.status(404).json({ error: 'Relacionamento não encontrado.' });

      return res.status(200).json({ message: 'Relacionamento atualizado com sucesso', updatedClassDiscipline });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // deleta um relacionamento entre turma e disciplina
  async deleteClassDiscipline(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem deletar relacionamentos entre turmas e disciplinas.' });
      }

      const { id } = req.params;

      const classDisciplineToDelete = await ClassDiscipline.findById(id);
      if (!classDisciplineToDelete) return res.status(404).json({ error: 'Relacionamento não encontrado.' });

      await ClassDiscipline.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Relacionamento deletado com sucesso' });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new ClassDisciplineController();