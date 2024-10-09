import StudentClass from '../model/studentClassModel';

class StudentClassController {
  async store(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        console.log('Acesso negado: usuário não é coordenador');
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem relacionar alunos a turmas.' });
      }

      const { student, class: classId } = req.body;

      // cria o relacionamento
      const newStudentClass = await StudentClass.create({ student, class: classId });
      console.log('Relacionamento criado com sucesso:', newStudentClass);

      return res.status(201).json({ message: 'Relacionamento criado com sucesso', newStudentClass });

    } catch (error) {
      console.error('Erro ao criar relacionamento entre aluno e turma:', error);
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  async getStudentClass(req, res) {
    try {
      console.log('Iniciando busca de relacionamento entre aluno e turma');
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        console.log('Acesso negado: usuário não é coordenador');
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem visualizar os relacionamentos entre alunos e turmas.' });
      }

      const { id } = req.params;
      console.log(`ID do relacionamento solicitado: ${id}`);

      if (id) {
        // busca o relacionamento específico
        const studentClass = await StudentClass.findById(id).populate('student').populate('class');
        if (!studentClass) {
          console.log('Relacionamento não encontrado');
          return res.status(404).json({ error: 'Relacionamento não encontrado.' });
        }
        console.log('Relacionamento encontrado:', studentClass);
        return res.status(200).json(studentClass);
      } else {
        // busca todos os relacionamentos
        const studentClasses = await StudentClass.find().populate('student').populate('class');
        console.log('Todos os relacionamentos encontrados:', studentClasses);
        return res.status(200).json(studentClasses);
      }

    } catch (error) {
      console.error('Erro ao buscar relacionamento entre aluno e turma:', error);
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  async updateStudentClass(req, res) {
    try {
      console.log('Iniciando atualização de relacionamento entre aluno e turma');
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        console.log('Acesso negado: usuário não é coordenador');
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem editar relacionamentos entre alunos e turmas.' });
      }

      const { id } = req.params;
      const { student, class: classId } = req.body;
      console.log(`ID do relacionamento a ser atualizado: ${id}`);
      console.log(`Dados recebidos para atualização - Aluno: ${student}, Turma: ${classId}`);

      // atualiza o relacionamento
      const updatedStudentClass = await StudentClass.findByIdAndUpdate(id, { student, class: classId }, { new: true });

      if (!updatedStudentClass) {
        console.log('Relacionamento não encontrado');
        return res.status(404).json({ error: 'Relacionamento não encontrado.' });
      }

      console.log('Relacionamento atualizado com sucesso:', updatedStudentClass);
      return res.status(200).json({ message: 'Relacionamento atualizado com sucesso', updatedStudentClass });

    } catch (error) {
      console.log('Erro no servidor:', error.message);
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // deleta um relacionamento entre aluno e turma
  async deleteStudentClass(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador
      if (req.user.userType !== 'coordenador') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores podem deletar relacionamentos entre alunos e turmas.' });
      }

      const { id } = req.params;

      const studentClassToDelete = await StudentClass.findById(id);
      if (!studentClassToDelete) return res.status(404).json({ error: 'Relacionamento não encontrado.' });

      await StudentClass.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Relacionamento deletado com sucesso' });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new StudentClassController();