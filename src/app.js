import express from "express";
import { Server } from 'socket.io';
import Handlebars from "express-handlebars";
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';

const app = express();

app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', Handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);

const server = app.listen(8080, () => console.log('Server Runing in port 8080'));
const io = new Server(server);

const messages = [];
io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', data => {
        messages.push(data);

        io.emit('messagesLogs', messages);
    });

    socket.on('authenticated', data => {
        socket.emit('messagesLogs', messages);
        socket.broadcast.emit('newUserConnected', data);
    });
});