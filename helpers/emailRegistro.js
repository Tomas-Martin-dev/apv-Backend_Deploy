import nodemailer from "nodemailer"

const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.HOST_MAILTRAP,
        port: process.env.PORT_MAILTRAP,
        auth: {
          user: process.env.USER_MAILTRAP,
          pass: process.env.PASSWORD_MAILTRAP
        }
      });
    const {nombre, email, token} = datos;
    // enviar email
    const info = await transport.sendMail({
        from:"APV - Administrador Veterinaria",
        to: email,
        subject: "Confirmar Cuenta",
        text: "Confirma tu cuenta para comenzar a registrar tus pacientes!",
        html: `<p>Hola ${nombre}, confirma tu cuenta de "Veterinario" para comenzar a registrar tus pacientes.</p>
        <p>Para confirmar debes ingresar al siguiente link..</p>
        <a href="${process.env.URL}/confirmar-cuenta/${token}"> Confirmar Cuenta</a>
        
        
        <p>Si tu no creaste una cuenta, ignora este mensaje porfavor</p>`
    });
      console.log("Mensaje enviado: %s", info.messageId);
      
}

export default emailRegistro