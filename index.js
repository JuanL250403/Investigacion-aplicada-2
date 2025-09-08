import express from 'express'
import path, { dirname } from 'path'
const app = express()
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//direccionamiento a paginas de inicio/registro de sesion
import { fileURLToPath } from 'url';
import { methods as autenticacion} from './controllers.js';
import cookieParser from 'cookie-parser';

//uso de css y js estatico
app.use(express.static(__dirname + "/"))
app.use(express.json())
app.use(cookieParser())

app.get('/login', (req, resp) => {
    resp.sendFile(__dirname + "/paginas/login.html")
})

app.post('/api/login', autenticacion.login)

app.get('/register', (req, resp) => {
    resp.sendFile(__dirname + "/paginas/registro.html")
})

app.post('/api/register', autenticacion.registro)

app.get('/home', (req, resp) => {
    resp.sendFile(__dirname + "/paginas/home.html")
})

app.get('/api/protected-resource', autenticacion.middleware, (req, res) => {
    return res.status(200).send({status: "OK", message:"usuario autorizado", protegido: "./../publico/img/banana.gif"})
})

app.post('/api/logout', autenticacion.middleware, autenticacion.logout)

app.listen(PORT, () => {
    console.log("Corriendo en puerto 3000")
})

export default app;