import nodemailer from "nodemailer"

const envioCorreoRegistrar = async (to, token, nombre) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_GMAIL,
            pass: process.env.PASS_GMAIL
        },
    });

    let mailOptions = {
        from: "apv.veterinaria.bytomas.dev@gmail.com",
        to: to,
        subject: `Confirma tu Cuenta Dogtor: ${nombre}`,
        html: `<p>Hola ${nombre}, confirma tu cuenta de "Veterinario" para comenzar a registrar tus pacientes.</p>
        <p>Para confirmar debes ingresar al siguiente link..</p>
        <a href="${process.env.URL}/confirmar-cuenta/${token}"> Confirmar Cuenta</a>
        
        <p>En caso de no haber creado una cuenta<b> Ignora Este Correo</b></p>`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export default envioCorreoRegistrar