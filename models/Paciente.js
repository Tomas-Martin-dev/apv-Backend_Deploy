import mongoose from "mongoose";

const pacienteSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true,
    },
    propietario:{
        type: String,
        require: true,
    },
    telefono: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
        require: true,
    },
    fechaAlta: {
        type: Date,
        default: Date.now()
    },
    diagnostico: {
        type: String,
        default: null,
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario",
    },
}, {
    timestamps: true,
})

const Paciente =  mongoose.model("Paciente", pacienteSchema);

export default Paciente