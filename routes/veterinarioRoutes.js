import express from "express";
import {registrar, perfil, confirmar, autenticar, resetPassword, comprobarToken, modificarPassword, actualizarPerfil, actualizarPassword} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router =  express.Router();

// Area Publica
router.post( "/", registrar );
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/reset-password", resetPassword);
router.route("/reset-password/:token").get(comprobarToken).post(modificarPassword);
// la linea de arriba es igual a tener 2 routers con la misma url
// router.get("/reset-password/:token", comprobarToken);
// router.post("/reset-password/.token", modificarPassword);


// Area Privada
router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil)
router.put("/editar-password", checkAuth, actualizarPassword)



export default router;