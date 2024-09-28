import { Router } from 'express';
import userController from './controller/userController';


const routes = new Router();
routes.post('/createUser', userController.store);
routes.post('/login', userController.login);


export default routes;