import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "narolajeel29@gmail.com", // Replace with your email
      pass: "pegx spqm vfed jimw", // Use App Password (not your Gmail password)
    },
    tls: {
        rejectUnauthorized: false, // ✅ Fix for self-signed certificate error
      },
  });

  
  export const sendMail = async(email)=>{
      try {
          console.log(email);
          
          const mailOptions = {
            from: "narolajeel29@gmail.com",
            to: email, // Replace with recipient's email
            subject: "UserName & Password",
            text: "Hello, this is a test email sent from Node.js using Nodemailer!",
          };
      
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log("Error Nodemailr:", err);
            } else {
              console.log("Email sent:", info.response);
            }
          });
    } catch (error) {
        
    }
  }