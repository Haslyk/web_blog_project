import db from "../config/db.js";

export async function getAnns(req, res) {
  try {
    const query = `SELECT * from announcements WHERE active = 1`;

    db.query(query, (error, result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function addAnn(req, res) {
  try {
    const { title, text } = req.body;
    const fileName = req.file ? req.file?.filename : "default.png";

    const query = `
            INSERT INTO announcements (title, text, image) 
            VALUES (?, ? , ?)
        `;
    db.query(query, [title, text, fileName], (error, result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        console.log("Hata:", error);
      }
    });
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
}

export async function updateAnn(req, res) {
  try {
    const { id, title, text, file } = req.body;
    const fileName = req.file ? req.file?.filename : file;

    const query = `
            UPDATE announcements
            SET title = ? , text = ?, image = ?
            WHERE id = ?
        `;
    db.query(query, [title, text, fileName, id], (error, result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        console.log("Hata:", error);
      }
    });
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
}

export async function deleteAnn(req, res) {
  try {
    const id = req.body.id;
    const query = `UPDATE announcements SET active = 0 WHERE id = ?`;

    db.query(query, [id], (error, result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}
