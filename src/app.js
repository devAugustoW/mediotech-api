import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import mongoose from 'mongoose';

class App{
	constructor(){
		this.server = express();

		mongoose.connect(process.env.MONGO_URI);
		
		this.middleware();
		this.routes();
	}

	middleware(){
		this.server.use(cors({
      origin: 'http://localhost:5173', // Permições requisições do seu frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
      allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    }));
		
		this.server.use(express.json());
	}

	routes(){
		this.server.use(routes);
	}
}
export default new App().server;