import bcrypt from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import dotenv from 'dotenv'
import ck from 'cookie-parser'
import { json } from "express";
import {BD} from './bdEmulada.js'
import cookieParser from "cookie-parser";

dotenv.config();

async function login(req, res, next) {
    const usuario = req.body.username
    const contra = req.body.password

    //validar si los datos se encuentran vacios
    if(!usuario || !contra){
        return res.status(400).send({status: "ERROR", message: "Campos vacios"})
    }
    //valida si el usuario se encuentra registrado
    const Revision = BD.usuarios.find(u => u.username === usuario);
    if (!Revision){
        return res.status(400).send({status: "ERROR", message: "Error al iniciar sesion"})
    }
    const correcto = await bcrypt.compare(contra, Revision.password)
    if (!correcto){
        return res.status(400).send({status: "ERROR", message: "Error al iniciarrr sesion"})
    }

    const jsonToken = jsonwebtoken.sign(
        {username: Revision.username},
        process.env.JWT_SECRETO,
        {expiresIn:process.env.JWT_EXP})
    const cookieOP = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 *60 * 1000),
        path: "/"
    }
    res.cookie("jwt", jsonToken, cookieOP)
    res.status(200).send({status: "OK", message: "logeado", token: jsonToken, redirect: "/home"})
    next()
}

async function registro(req, res) {
    const usuario = req.body.username
    const contra = req.body.password
    const email = req.body.email

    //validar si los datos se encuentran vacios
    if(!usuario || !contra || !email){
        return res.status(400).send({status: "ERROR", message: "Campos vacios"})
    }
    //valida si el usuario ya se ecuentra registrado
    const Revision = BD.usuarios.find(u => u.username === usuario);
    if (Revision){
        return res.status(400).send({status: "ERROR", message: "Error al registrarse"})
    }
    //encriptar contrasenia
    const salt = await bcrypt.genSalt(5);
    const hashContra = await bcrypt.hash(contra,salt); 

    const nuevoUsu = {
        username: usuario, email, password: hashContra
    }
    BD.usuarios.push(nuevoUsu);
    res.status(201).send({status: "OK", message: "Usuario creado", redirect: "/login"})

}

async function middleware(req, res, next) {
    const auto = req.get('authorization');

    let token = {}
    if(auto && auto.toLowerCase().startsWith("bearer")){
        token = auto.split(' ')[1]

        let decodeadoJWT = {}
        if(!token || BD.ListaNegra.includes(token)){
            return res.status(400).send({status: "ERROR", message:"Token no valido"})
        }
        decodeadoJWT = jsonwebtoken.verify(token, process.env.JWT_SECRETO)
        //valida si el usuario se encuentra registrado
        if(!decodeadoJWT.username){
            return res.status(400).send({status: "ERROR", message: "Campos vacios"})
        }
        const Revision = BD.usuarios.find(u => u.username === decodeadoJWT.username);
        if (!Revision){
            return res.status(400).send({status: "ERROR", message: "Usuario no existente"})
        }
        return next()
    }
    res.status(400).send({status: "ERROR", message: "Authorization de tipo no Bearer"})
}

async function logout(req, res, next) {
    const auto = req.get('authorization');
    let token = {}
    if(auto && auto.toLowerCase().startsWith("bearer")){
        token = auto.split(' ')[1]
        if(!token){
            return res.status(400).send({status: "ERROR", message: "Token no valido"})
        }
        BD.ListaNegra.push(token)
        res.status(200).send({status: "OK", message: "Cierre de sesion exitoso"})
    }
        res.status(400).send({status: "ERROR", message: "Problemas al cerrar sesion"})
}

export const methods = {
    login,
    registro,
    middleware,
    logout
}