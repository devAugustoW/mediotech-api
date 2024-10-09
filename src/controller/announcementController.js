import Announcement from '../model/announcementModel';

class AnnouncementController {
  
  async store(req, res) {
    try {
        console.log('Dados recebidos no backend:', req.body);

        // Verifica se o usuário autenticado é um coordenador ou professor
        if (req.user.userType !== 'coordenador' && req.user.userType !== 'professor') {
            console.log('Acesso negado para o usuário:', req.user._id);
            return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores e professores podem criar anúncios.' });
        }

        const { title, content, targetClasses, } = req.body;
        console.log('Dados do anúncio:', { title, content, targetClasses, });

        // cria o comunicado
        const newAnnouncement = await Announcement.create({
            title,
            content,
            targetClasses,
            createdBy: req.user._id,
        });

        console.log('Anúncio criado:', newAnnouncement);

        return res.status(201).json({ message: 'Anúncio criado com sucesso', newAnnouncement });
    } catch (error) {
        console.error('Erro ao criar anúncio:', error);
        console.error('Detalhes do erro:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
  

	// resgata todos os anúncios
	async getAllAnnouncements(req, res) {
		try {
			// Verifica se o usuário autenticado é um coordenador ou professor
			if (req.user.userType !== 'coordenador' && req.user.userType !== 'professor') {
				return res.status(403).json({ error: 'Acesso negado. Apenas coordenadores e professores podem visualizar anúncios.' });
			}

			const announcements = await Announcement.find()
				.populate('createdBy', 'name email')
				.populate('targetClasses', 'name'); 

			return res.status(200).json(announcements);

		} catch (error) {
			console.error('Erro ao resgatar anúncios:', error);
			console.error('Detalhes do erro:', error.message);
			console.error('Stack trace:', error.stack);
			res.status(500).json({ message: 'Erro no servidor', error: error.message });
		}
	}

	// resgata um anúncio específico
  async getAnnouncementById(req, res) {
    try {
      const { id } = req.params;
      const announcement = await Announcement.findById(id).populate('createdBy', 'name email');

      if (!announcement) {
        return res.status(404).json({ error: 'Anúncio não encontrado' });
      }

      return res.status(200).json(announcement);

			
	    } catch (error) {
      console.error('Erro ao resgatar anúncio específico:', error);
      console.error('Detalhes do erro:', error.message);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  async updateAnnouncement(req, res) {
    try {
      console.log('Iniciando atualização do anúncio');
      const { id } = req.params;
      const { title, content, targetClasses } = req.body;

      console.log('ID do anúncio:', id);
      console.log('Dados recebidos para atualização:', { title, content, targetClasses });

      const announcement = await Announcement.findByIdAndUpdate(
        id,
        { title, content, targetClasses },
        { new: true, runValidators: true }
      );

      if (!announcement) {
        console.log('Anúncio não encontrado');
        return res.status(404).json({ error: 'Anúncio não encontrado' });
      }

      console.log('Anúncio atualizado com sucesso:', announcement);
      return res.status(200).json({ message: 'Anúncio atualizado com sucesso', announcement });

    } catch (error) {
      console.error('Erro ao atualizar anúncio:', error);
      console.error('Detalhes do erro:', error.message);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }

  // deleta um anúncio
  async deleteAnnouncement(req, res) {
    try {
      const { id } = req.params;

      const announcement = await Announcement.findByIdAndDelete(id);

      if (!announcement) {
        return res.status(404).json({ error: 'Anúncio não encontrado' });
      }

      return res.status(200).json({ message: 'Anúncio deletado com sucesso' });

    } catch (error) {
      console.error('Erro ao deletar anúncio:', error);
      console.error('Detalhes do erro:', error.message);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

export default new AnnouncementController();