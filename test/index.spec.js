
import request from 'supertest'
import app from '../index.js'
import e from 'express'
import {BD} from '../bdEmulada.js'

const UsuarioRegistro = {
    username: "nuevo_usuario",
    password: "password_seguro",
    email: "correo@ejemplo.com"
}

const UsuarioLogin = {
    username: "usuario_existente",
    password : "password_correcto"
}

const recursoProtegido = "./../publico/img/banana.gif"

const JWTToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzdWFyaW9fZXhpc3RlbnRlIiwiaWF0IjoxNzU3MTE4ODg1LCJleHAiOjE3NTc3MjM2ODV9.bBBrQJym0fMHxWdfHbOL0BSsD69MLYvsfXA7ocF87Q0"


describe('POST /api/register', () => {
    test('Verificar que un usuario pueda registrarse correctamente', async () => {
        const response = await request(app).post('/api/register').send(UsuarioRegistro);
        expect(response.statusCode).toBe(201);  
        expect(response.body).toHaveProperty("message", "Usuario creado");
    })
})

describe ('POST /api/login', () => {
    test('Verificar que un usuario pueda iniciar sesión correctamente', async () => {
        const response = await request(app).post("/api/login").send(UsuarioLogin);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body.token).not.toBe(null || undefined || "");
    })
})

describe('GET /api/protected-resource', () => {
    test('Verificar que solo los usuarios autenticados puedan acceder a un recurso protegido', async () => {
        const response = await request(app).get("/api/protected-resource").set('Authorization', 'Bearer ' + JWTToken);
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty("protegido", recursoProtegido)
    })
})

describe('POST /api/logout', () => {
    test('Verificar que el usuario  cerro sesion correctamente y de manera segura', async () => {
        const response = await request(app).post("/api/logout").set('Authorization', 'Bearer ' + JWTToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Cierre de sesion exitoso")
    })
    test('Verificar que el token de autenticación ya no es valido para futuras solicitudes', async () => {
        const response = await request(app).get("/api/protected-resource").set('Authorization', 'Bearer ' + JWTToken);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Token no valido")
    })
})