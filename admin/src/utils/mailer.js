import Course from '@/model/Course';
import nodemailer from 'nodemailer';

export const sendEmail = async({email, courseId, title, reason}) => {
    console.log(email, reason, title, courseId)
    try {
        // await Course.findByIdAndUpdate(courseId, {approved: 'rejected'})

        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Course Rejected",
            html: `
            <p>
                <strong>Course title:</strong> ${title} <br />
                <strong>Reject reason:</strong> ${reason}
            </p>`
        }

        const mailresponse = await transport.sendMail(mailOptions)
        console.log(mailresponse)
        return mailresponse;

    } catch (error) {
        console.log(error)
        throw new Error(error?.message);
    }
}