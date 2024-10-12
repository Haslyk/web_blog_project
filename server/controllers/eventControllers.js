import db from "../config/db.js";

// GET ALL EVENTS
export async function getEvents(req, res) {
  try {
    const query = `SELECT * from events WHERE active = 1`;

    db.query(query, (error, result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function addEvent(req, res) {
  try {
    const { title, text } = req.body;
    const fileName = req.file ? req.file?.filename : "default.png";

    const query = `
            INSERT INTO events (title, text, image) 
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

export async function updateEvent(req, res) {
  try {
    const { id, title, text, file } = req.body;
    const fileName = req.file ? req.file?.filename : file;

    const query = `
            UPDATE events
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

export async function deleteEvent(req, res) {
  try {
    const id = req.body.id;
    const query = `UPDATE events SET active = 0 WHERE id = ?`;

    db.query(query, [id], (error, result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function getPastEvents(req, res) {
  try {
    const query = `SELECT * from events`;

    db.query(query, (error, result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}
