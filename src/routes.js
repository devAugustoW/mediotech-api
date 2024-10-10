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
routes.post('/createClass', authMiddleware, classController.store);
routes.get('/getAllClasses', authMiddleware, classController.getAllClasses);
routes.put('/editClass/:id', authMiddleware, classController.updateClass);
routes.delete('/deleteClass/:id', authMiddleware, classController.deleteClass);

// criação de disciplinas por coordenador
routes.post('/createDiscipline', authMiddleware, disciplineController.store);
routes.get('/getAllDisciplines', authMiddleware, disciplineController.getAllDisciplines);
routes.put('/editDiscipline/:id', authMiddleware, disciplineController.updateDiscipline);
routes.delete('/deleteDiscipline/:id', authMiddleware, disciplineController.deleteDiscipline);

// criaçao do relacionamento professores/disciplinas por coordenador
routes.post('/teacherToDiscipline', authMiddleware, teacherDisciplineController.store);
routes.get('/getAllTeacherDisciplines', authMiddleware, teacherDisciplineController.getAllTeacherDisciplines);
routes.put('/editTeacherDiscipline/:id', authMiddleware, teacherDisciplineController.updateTeacherDiscipline);
routes.delete('/deleteTeacherDiscipline/:id', authMiddleware, teacherDisciplineController.deleteTeacherDiscipline);

// relacionar turmas/disciplinas por coordenador
routes.post('/classToDiscipline', authMiddleware, classDisciplineController.store);
routes.get('/getAllClassDisciplines', authMiddleware, classDisciplineController.getAllClassDisciplines);
routes.put('/editClassDiscipline/:id', authMiddleware, classDisciplineController.updateClassDiscipline);
routes.delete('/deleteClassDiscipline/:id', authMiddleware, classDisciplineController.deleteClassDiscipline);

// relacionar alunos/turmas por coordenador
routes.post('/studentToClass', authMiddleware, studentClassController.store);
routes.get('/studentClass', authMiddleware, studentClassController.getStudentClass);
routes.put('/editStudentClass/:id', authMiddleware, studentClassController.updateStudentClass);
routes.delete('/deleteStudentClass/:id', authMiddleware, studentClassController.deleteStudentClass);

// criação de anúncios por coordenador ou professor
routes.post('/announcements', authMiddleware, announcementController.store); 
routes.get('/announcements', authMiddleware, announcementController.getAllAnnouncements); 
routes.get('/announcements/:id', authMiddleware, announcementController.getAnnouncementById); 
routes.put('/announcements/:id', authMiddleware, announcementController.updateAnnouncement);
routes.delete('/announcements/:id', authMiddleware, announcementController.deleteAnnouncement); 

// rotas do professor
// buscar turmas e disciplinas vinculadas ao professor
routes.get('/teacher/classes-and-disciplines', authMiddleware, userController.getTeacherClassesAndDisciplines);

routes.get('/teacher/students-by-discipline/:disciplineId', authMiddleware, userController.getStudentsByDiscipline);
routes.get('/teacher/concepts-by-discipline/:disciplineId', authMiddleware, conceptController.getConceptsByDiscipline);
routes.get('/teacher/class-students/:classId', authMiddleware, userController.getStudentsByClass)



// cadastrar conceitos por professor
routes.post('/concept', authMiddleware, conceptController.store);
// routes.get('/concepts', authMiddleware, conceptController.getAllConcepts);
// routes.get('/concepts/:id', authMiddleware, conceptController.getConceptById);
// routes.put('/concepts/:id', authMiddleware, conceptController.updateConcept);
// routes.delete('/concepts/:id', authMiddleware, conceptController.deleteConcept);

export default routes;