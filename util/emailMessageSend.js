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

  
  export const sendMail = async(staffName,email,password)=>{
      try {
          console.log(email);
          
          const mailOptions = {
            from: "narolajeel29@gmail.com",
            to: email, // Replace with recipient's email
            subject: "Your College Management System Login Credentials",
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #2e6da4;">Welcome to the College Management System</h2>
                <p>Dear <strong>${staffName}</strong>,</p>
                <p>We’re excited to have you on board! Below are your login credentials:</p>
                <table style="width: 100%; margin-top: 15px; margin-bottom: 15px;">
                  <tr>
                    <td style="padding: 8px; background-color: #f9f9f9; border: 1px solid #ddd;"><strong>Email:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; background-color: #f9f9f9; border: 1px solid #ddd;"><strong>Password:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
                  </tr>
                </table>
                <p style="margin-top: 20px;">Please keep this information secure and do not share it with anyone.</p>
                <p>If you have any issues logging in, feel free to contact the admin.</p>
                <br>
                <p style="font-size: 14px; color: #666;">Regards,<br><strong>College Admin Team</strong></p>
              </div>
            `,
          };
      
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log("Error Nodemailr:", err);
            } else {
              console.log("Email sent:", info.response);
            }
          });
    } catch (error) {
        console.log(`Error By util For sendMail`,error);
        res.status(500).json({msg:'Internal  Error.', Error:error})
    }
  }