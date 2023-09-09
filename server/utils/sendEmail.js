import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

export const sendEmail = async (subject, from, to, replyTo, template, name, link) => {
    //create email transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const handlerOptions = {
        viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve("./views"),
            defaultLayout: false
        },
        viewPath: path.resolve('views'),
        extName: ".handlebars"
    }

    transporter.use("compile", hbs(handlerOptions))

    //create options for sending email
    const options = {
        subject,
        from: 'Webdev Skool <webdevskool@outlook.com>',
        to,
        replyTo,
        template,
        context: {
            name,
            link
        }
    }

    //send mail
    transporter.sendMail(options, (err, info) => {
        if(err){
            console.log(err)
            return err
        }else{
            console.log(info)
            return info
        }
    })
}
