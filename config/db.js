import mongoose from "mongoose";

const conectarDB = async ()=> {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL); /* retotna un objeto, con info si se conecto o no */
        const url =  `${db.connection.host}:${db.connection.port}`
        console.log(`MongoDB conectado en, ${url}`);
    } catch (error) {
        console.log("ERROR al conectar DB",error);
        process.exit(1);
    }
}

export default conectarDB