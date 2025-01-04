import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generar-JWT.js";
import generarID from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req,res) =>{
    const { email, password, nombre } = req.body; 

    // prevenir users duplicados
    const existeUser =  await Veterinario.findOne({email})
    if (existeUser) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message })        
    }

    try {
        // Guardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioOK = await veterinario.save();
        // envio email de confirmacion
        emailRegistro({
            email,
            nombre,
            token: veterinarioOK.token,
        })
        res.json(veterinarioOK)
        console.log("NUEVO VETE ALMACENADO EN LA DB");
    } catch (error) {
        console.log(error);
    }
};

const perfil = (req,res)=> {
    const {veterinario} = req
    console.log(veterinario);
    
    res.send(veterinario)
};

const confirmar = async (req,res)=> {
    const { token } = req.params;
    const usuarioConfirmar = await Veterinario.findOne({token});
    
    if (!usuarioConfirmar) {
        const error = new Error("Token no valido");
        return res.status(404).json({msg : error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.send({msg: "User confirmado"})
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req,res)=> {
    const {email, contraseña} = req.body;
    
    const usuario = await Veterinario.findOne({email}); // busco usuario en la base de datos
    
    // Verificar que el user existe
    if (!usuario) {
        const error = new Error("El usuario no existe");
        return  res.status(403).json({msg: error.message});
    }

    // Verificar si el user esta confirmado 
    if(!usuario.confirmado){
        const error = new Error("El usuario no esta confirmado");
        return  res.status(403).json({msg: error.message});
    }

    // Verificar que el password esta bien
    if (await usuario.comprobarPassword(contraseña)) {
        console.log("pass correcto!!");
        // Autenticado retornamos los datos no sensibles del user y creamois un token con JWT
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            web: usuario.web,
            token: generarJWT(usuario.id)
        })
    }else{
        const error = new Error("El password es incorrecto");
        return  res.status(403).json({msg: error.message});
    }

};

const resetPassword =  async (req,res)=> {
    const {email} = req.body;
    const userExistente = await Veterinario.findOne({email});

    if (!userExistente) {
        const error = new Error("El Email es incorrecto");
        return  res.status(400).json({msg: error.message});
    }

    if (userExistente.confirmado == false) {
        const error = new Error("¡El usuario nunca fue confirmado!");
        return  res.status(400).json({msg: error.message});
    }

    try {
        userExistente.token =  generarID();
        await userExistente.save(); /* generamos un token nuevo, lo guardamos en la DB*/
        
        // envio Email con los datos del cliente y el nuevo token
        emailOlvidePassword({
           nombre: userExistente.nombre,
           email,
           token: userExistente.token
        })
        res.json({msg: "Revisa tu email te enviamos instrucciones"}) 
        
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken =  async (req,res)=> {
    const { token } = req.params;
    const userExistente = await Veterinario.findOne({token});
    
    if (!userExistente) {
        const error = new Error("Token no valido");
        return res.status(404).json({msg : error.message});
    }else{
        res.json({msg: "Token Correcto"})
    }
    
    
}

const modificarPassword =  async (req,res)=> {
    const {token} = req.params;
    const {contraseña} = req.body;
    console.log(contraseña);
    
    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(404).json({msg : error.message});
    }
    
    try {
        veterinario.password = contraseña;
        veterinario.token = null;
        await veterinario.save()
        res.send({msg: "Contraseña Modificada correctamente"});        
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req,res)=> {
    const {id} = req.params;
    const {perfilNuevo} = req.body;
    const {email} = perfilNuevo

    const veterinario = await Veterinario.findById(id)
    
    if (veterinario.email !== perfilNuevo.email) {
        const emailExistente = await Veterinario.findOne({email});
        if (emailExistente) {
            const error = new Error("Este Email ya esta ocupado");
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        veterinario.nombre = perfilNuevo.nombre ;        
        veterinario.email = perfilNuevo.email;        
        veterinario.telefono = perfilNuevo.telefono;        
        veterinario.web = perfilNuevo.web;        
        
        await veterinario.save();
        res.send({msg: "Datos Modificados correctamente"})
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req,res)=> {
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;

    const veterinario = await Veterinario.findById(id);

    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(404).json({msg : error.message});
    }

    if (!await veterinario.comprobarPassword(pwd_actual)) {
        const error = new Error("Password Incorrecto");
        return res.status(404).json({msg : error.message});
    }else{
        try {
            veterinario.password = pwd_nuevo;
            await veterinario.save();
            res.send({msg: "Contraseña Actualizada"});
        } catch (error) {
            console.log(error);
        }
    }

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar, 
    resetPassword,
    comprobarToken,
    modificarPassword,
    actualizarPerfil,
    actualizarPassword
}