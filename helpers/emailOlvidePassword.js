import nodemailer from "nodemailer"

const emailOlvidePassword = async (datos) => {
    var transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_GMAIL,
          pass:  process.env.PASS_GMAIL
        }
      });
    const {nombre, email, token} = datos;
    // enviar email
    const info = await transport.sendMail({
        from:"APV - Administrador Veterinaria",
        to: email,
        subject: "Restablecer tu Password",
        text: "Restablecer tu Password",
        html: `<p>Hola ${nombre}, solicitaste restablecer tu password.</p>
        <p>ingrese al siguiente link para validarlo y podra cambiar su password</p>
        <a href="${process.env.URL}/recuperar-password/${token}"> Recuperar Cuenta</a>
        
        
        <p>Si tu no creaste una cuenta, ignora este mensaje porfavor</p>`
    });
      console.log("Mensaje enviado: %s", info.messageId);
      
}

export default emailOlvidePassword