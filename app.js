import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import cron from "node-cron"
import fetch from 'node-fetch';

const app = express(); /* inicializa en una variable a Express */
app.use(express.json()); /* Middleware que permite a la app procesar datos en formato JSON */

dotenv.config(); /* Carga las variables definidas en un archivo .env para usarlas con process.env */

// dominios permitidos
const dominiosPermitidos = [process.env.URL, "http://localhost:5173/"];

const corsOptions = {
    origin: function(origin,callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            callback(null,true)
        }else{
            callback(new Error("No permitido por Cors"))
        }
    }
};

app.use(cors(corsOptions));

const PORT =  process.env.PORT || 4000;

cron.schedule('*/14 * * * *', async () => {
    try {
      const response = await fetch('https://apv-backend-deploy-vouk.onrender.com');
      console.log(`Ping al servidor exitoso: ${response.status} - ${new Date()}`);
    } catch (error) {
      console.error('Error al pingear el servidor:', error);
    }
});

app.listen(PORT, ()=>{
    console.log(`servidor conectado en el puerto ${PORT}`);
}); /* Inicia el servidor en el puerto especificado y ejecuta una función de callback cuando el servidor está listo. */

app.use("/api/veterinario", veterinarioRoutes); /* Define un middleware para manejar solicitudes que comiencen con la ruta especificada */

app.use("/api/paciente", pacienteRoutes);


// funcion para conectar la DB
conectarDB();

