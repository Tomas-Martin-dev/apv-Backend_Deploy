import Paciente from "../models/Paciente.js";

const crearPaciente = async (req, res) => {
    // creo nuevo paciente
    const pacienteNuevo = new Paciente(req.body);

    // Identificar el Veterinario y agrego al paciente nuevo.  
    pacienteNuevo.veterinario = req.veterinario._id; /* la variable req.veterinario existe porque estamos pasando antes de esta funcion el middlerware de checkauto, que almacena los datos del veterinario que esta ingresano */

    try {
        // Guardar el paciente nuevo
        const paceinteAlmacenado = await pacienteNuevo.save();
        res.json(paceinteAlmacenado)
        console.log("NUEVO PACIENTE ALMACENADO EN LA DB");
    } catch (error) {
        console.log(error);
    }
};

const obtenerPacientes = async (req, res) => {
    const paciente = await Paciente.find().where("veterinario").equals(req.veterinario); /* find: busca documentos en una coleccion y nos devuelve un array de objetos(se le puede pasar parametros);  Where(): filtra la busqueda de find y se enfoca en el campo "veterinario"; equals(): le agrega un condicion a where() y le pide que traiga lo datos que sean iguales al valor que le pasamos "req.vete..." */
    /* req.veterinario existe porque en la funcion checkauth esta creada, almacena el valor del veterinario que esta registrado */

    res.json(paciente)
};

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return  res.json( {mgs: "No se encontro ese paciente en la DB"} )
    }

    if (req.veterinario._id.toString() !== paciente.veterinario._id.toString()) { /* estamos comparando el id del veterinario logueado y el id del paciente que esta buscando, para ver si coinciden, lo ids los paso a string porq son objetos en mongooes y dan diferentes siempre */
        return  res.json( {mgs: "accion no valida!, solo puedes ver tus propios clientes"} )
    }

    if (paciente) {
        return  res.json( paciente )
    }
};

const actualizarPaciente = async (req, res) => { 
    const { id } = req.params;
    const { nombre, propietario, telefono, email, diagnostico, fechaAlta} = req.body;
    const paciente = await Paciente.findById(id);
    
    if (!paciente) {
        return  res.json( {mgs: "No se encontro ese paciente en la DB"} )
    }
    
    if (req.veterinario._id.toString() !== paciente.veterinario._id.toString()) { /* estamos comparando el id del veterinario logueado y el id del paciente que esta buscando, para ver si coinciden, lo ids los paso a string porq son objetos en mongooes y dan diferentes siempre */
        return  res.json( {mgs: "accion no valida!, solo puedes modificar tus propios clientes"} )
    }
    
    if (paciente) {
        
        try {
            paciente.nombre =  nombre || paciente.nombre;
            paciente.propietario = propietario || paciente.propietario;
            paciente.telefono =  telefono || paciente.telefono;
            paciente.email =  email || paciente.email;
            paciente.diagnostico =  diagnostico || paciente.diagnostico;
            paciente.fechaAlta = fechaAlta || paciente.fechaAlta;
            paciente.save();
            return res.json(paciente)
        } catch (error) {
            console.log(error);
        }
    }

}

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return  res.json( {mgs: "No se encontro ese paciente en la DB"} )
    };

    if (req.veterinario._id.toString() !== paciente.veterinario._id.toString()) { /* estamos comparando el id del veterinario logueado y el id del paciente que esta buscando, para ver si coinciden, lo ids los paso a string porq son objetos en mongooes y dan diferentes siempre */
        return  res.json( {mgs: "No puedes eliminar un paceinte que no es tuyo"} )
    };

    try {
        await paciente.deleteOne();
        return res.json( {msg: `El paciente "${paciente.nombre}" del propietario "${paciente.propietario}" !FUE ELIMINADO¡`} )
    } catch (error) {
        console.log(error);
    }
}


export {
    crearPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}