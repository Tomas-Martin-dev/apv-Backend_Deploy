import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true,
        trim: true
    },
    password:{
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token:{
        type: String,
        default: generarId()
    },
    confirmado:{
        type: Boolean,
        default:false,
    },
});

// hash de password
veterinarioSchema.pre("save", async function (next) {
    // Verifica si el password no fue modificado
    if (!this.isModified("password")) {
        return next();
    }

    // Verifica que el password no sea undefined o vacío
    if (!this.password) {
        throw new Error("password undefined");
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// comprobar password ya hasheado
veterinarioSchema.methods.comprobarPassword = async function(passForm) {
    return await bcrypt.compare(passForm, this.password)
}

const Veterinario = mongoose.model("Veterinario", veterinarioSchema); /* "Veterinario es la collecion de la base de datos "apv" donde se guardaran los datos(mongoose hara plural y con minisculas simpre el nombre de las colecciones)" */
export default Veterinario;