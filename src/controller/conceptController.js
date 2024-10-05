import Concept from '../model/conceptModel';

class ConceptController {
  // cria um novo conceito
  async store(req, res) {
    try {
      // Verifica se o usuário autenticado é um professor
      if (req.user.userType !== 'professor') {
        return res.status(403).json({ error: 'Acesso negado. Apenas professores podem cadastrar conceitos.' });
      }

      const { student, discipline, concept } = req.body;

      // cria o conceito
      const newConcept = await Concept.create({ student, discipline, concept });

      return res.status(201).json({ message: 'Conceito cadastrado com sucesso', newConcept });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new ConceptController();