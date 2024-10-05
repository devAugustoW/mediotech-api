import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import mongoose from 'mongoose';

class App{
	constructor(){
		this.server = express();

		mongoose.connect(process.env.MONGO_URI)
			.then(() => console.log('Conectado ao MongoDB'))
			.catch(err => console.log('Erro ao conectar ao MongoDB:', err));
		
		this.middleware();
		this.routes();
	}

	middleware(){
		this.server.use(cors({
      origin: 'http://localhost:5173', 
      methods: ['GET', 'POST', 'PUT', 'DELETE'], 
      allowedHeaders: ['Content-Type', 'Authorization'], 
    }));
		
		this.server.use(express.json());
	}

	routes(){
		this.server.use(routes);
	}
}
export default new App().server;