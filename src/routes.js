import { Router } from 'express';
import userController from './controller/userController';
import classController from './controller/classController';
import disciplineController from './controller/disciplineController';
import announcementController from './controller/announcementController';
import teacherDisciplineController from './controller/teacherDisciplineController';
import classDisciplineController from './controller/classDisciplineController';
import studentClassController from './controller/studentClassController';
import conceptController from './controller/conceptController';
import authMiddleware from './middleware/authMiddleware';

const routes = new Router();
routes.post('/createUser', userController.store);
routes.post('/login', userController.login);


// criação de usuário por coordenador
routes.post('/createUserByCoordinator', authMiddleware, userController.storeByCoordinator);
routes.get('/users', authMiddleware, userController.getAllUsers);
routes.put('/users/:id', authMiddleware, userController.updateUser);
routes.delete('/users/:id', authMiddleware, userController.deleteUser);

// criação de turmas por coordenador
routes.post('/createTurma', authMiddleware, classController.store);

// criação de disciplinas por coordenador
routes.post('/createDiscipline', authMiddleware, disciplineController.store);

// criação de anúncios por coordenador ou professor
routes.post('/createAnnouncement', authMiddleware, announcementController.store);

// relacionar professores a disciplinas por coordenador
routes.post('/teacherToDiscipline', authMiddleware, teacherDisciplineController.store);

// relacionar turmas a disciplinas por coordenador
routes.post('/classToDiscipline', authMiddleware, classDisciplineController.store);

// relacionar alunos a turmas por coordenador
routes.post('/studentToClass', authMiddleware, studentClassController.store);

// cadastrar conceitos por professor
routes.post('/concept', authMiddleware, conceptController.store);

export default routes;