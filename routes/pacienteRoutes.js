import express from "express";
import Paciente from "../models/Paciente.js";
import { crearPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router =  express.Router();


router.route("/")
.post(checkAuth, crearPaciente) /* crea pacientes nuevos y les agrega el id del veterinario que los creo */
.get(checkAuth, obtenerPacientes); /* obtiene la lista total de pacientes */

/* Se le pasa le id de un paciente en espeficico */
router.route("/:id")
.get(checkAuth, obtenerPaciente) /* trae su info */
.put(checkAuth, actualizarPaciente) /* permite actualizarlo */
.delete(checkAuth, eliminarPaciente); /* lo puede eliminar */

export default router