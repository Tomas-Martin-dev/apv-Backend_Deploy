import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) { /* verifico que haya token y que comience con Bearer */

        try {
            token = req.headers.authorization.split(" ")[1]; /* quitamos la palabra bearer */

            const decoded = jwt.verify(token, process.env.JWT_SECRET); /* le paso el token y la firma de seguridad, si existe el token nos devuelve la informacion del usuario, en este caso el id, iat y exp */

            req.veterinario = await Veterinario.findById(decoded.id).select("-password"); /* busco con el id que nos pasa el jwt si tengo un usuario y paso al info menos password a la session veterinario */
            
            return next()
        }
        catch (error) {
            console.log(error);
            const errorr = new Error("Token no valido");
            return res.status(403).json({ msg: errorr.message });
        }
    }

    if (!token) {
        const errorr = new Error("Token no valido");
        res.status(403).json({ msg: errorr.message });
    }
    next();
}

export default checkAuth