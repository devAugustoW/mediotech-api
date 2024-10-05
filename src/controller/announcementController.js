import Announcement from '../model/announcementModel';

class AnnouncementController {
  // cria um novo anúncio
  async store(req, res) {
    try {
      // Verifica se o usuário autenticado é um coordenador ou professor
      if (req.user.userType !== 'coordenador' && req.user.userType !== 'professor') {
        return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores e professores podem criar anúncios.' });
      }

      const { title, content, targetClasses } = req.body;

      // cria o anúncio
      const newAnnouncement = await Announcement.create({
        title,
        content,
        targetClasses,
        createdBy: req.userId,
      });

      return res.status(201).json({ message: 'Anúncio criado com sucesso', newAnnouncement });

    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new AnnouncementController();