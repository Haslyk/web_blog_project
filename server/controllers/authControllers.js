import crypto from "crypto";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import nodemailer from "nodemailer";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const hashedPass = crypto.createHash("md5").update(password).digest("hex");

    const query = `
            SELECT * from controls WHERE email = ? AND password = ?
        `;

    db.query(query, [email, hashedPass], (error, result) => {
      if (result.length > 0) {
        const secret_key = process.env.JWT_SECRET || "";

        const accessToken = jwt.sign(
          {
            id: result[0].id,
            email: result[0].email,
            full_name: result[0].full_name,
          },
          secret_key,
          { expiresIn: "10h" }
        );
        res
          .status(200)
          .json({
            result: true,
            user: {
              ...result[0],
              id: result[0].id,
              email: result[0].email,
              full_name: result[0].full_name,
            },
            access_token: accessToken,
          });
      } else {
        res.status(401).json({ data: "Hatalı Giriş" });
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

export async function verifyResetToken(req, res) {
  const { email, token } = req.body;
  const hashedToken = crypto.createHash("md5").update(token).digest("hex");

  const query = `
        SELECT * from controls WHERE email = ? AND reset_token = ?
    `;
  db.query(query, [email, hashedToken], (error, result) => {
    if (result.length > 0) {
      res.status(200).json({ valid: true });
    } else {
      res.status(400).json({ valid: false });
    }
  });
}

export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).json({ flag: req.app.locals.resetSession });
  }
  return res.status(404).json({ error: "Session Expired" });
}

export async function resetPass(req, res) {
  const { email } = req.body;

  const query = `
        SELECT * from controls WHERE email = ?
    `;
  db.query(query, [email], (error, result) => {
    if (result.length > 0) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("md5")
        .update(resetToken)
        .digest("hex");

      const updateQuery = `
                UPDATE controls SET reset_token = ? WHERE email = ?
            `;

      db.query(updateQuery, [hashedToken, email], async (updateError) => {
        if (updateError) {
          return res
            .status(500)
            .json({ error: "Failed to update reset token" });
        }

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Password Reset",
          html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset-password?token=${resetToken}&email=${email}">link</a> to reset your password</p>
                    `,
        };

        try {
          let info = await transporter.sendMail(mailOptions);
          console.log("Message sent: %s", info.messageId);
          res
            .status(200)
            .json({ message: "Sıfırlama linki mailinize gönderildi!" });
        } catch (mailError) {
          console.log("ERRROR:", mailError);
          res.status(500).json({ error: "Failed to send email" });
        }
      });
    } else {
      res.status(404).json({ error: "Email not found" });
    }
  });
}

export async function updatePass(req, res) {
    const { email, token, newPassword } = req.body;
    
    const hashedToken = crypto.createHash('md5').update(token).digest('hex');
    const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

    const query = `
        SELECT * from controls WHERE email = ? AND reset_token = ?
    `;
    db.query(query, [email, hashedToken], (error, result) => {
        if (result.length > 0) {
            const updateQuery = `
                UPDATE controls SET password = ?, reset_token = NULL WHERE email = ?
            `;
            db.query(updateQuery, [hashedPassword, email], (updateError) => {
                if (updateError) {
                    return res.status(500).json({ error: 'Failed to update password' });
                }
                res.status(200).json({ message: 'Password successfully updated' });
            });
        } else {
            res.status(400).json({ error: 'Invalid token or email' });
        }
    });
}