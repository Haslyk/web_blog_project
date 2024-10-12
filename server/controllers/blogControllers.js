import slugify from "slugify";
import db from "../config/db.js";

export async function getBlogs(req, res) {
  try {
    const query = `SELECT * from blogs WHERE active = 1`;

    db.query(query, (error, result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function addBlog(req, res) {
  try {
    const { title, text } = req.body;
    const fileName = req.file ? req.file?.filename : "default.png";

    const slug = slugify(title, { lower: true, strict: true });

    const query = `
            INSERT INTO blogs (title, text, slug, image) 
            VALUES (?, ? , ? , ?)
        `;
    db.query(query, [title, text, slug, fileName], (error, result) => {
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

export async function updateBlog(req, res) {
  try {
    const { id, title, text, file } = req.body;
    const fileName = req.file ? req.file?.filename : file;

    const slug = slugify(title, { lower: true, strict: true });

    const query = `
            UPDATE blogs
            SET title = ? , text = ?, image = ?, slug = ?
            WHERE id = ?
        `;
    db.query(query, [title, text, fileName, slug, id], (error, result) => {
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

export async function deleteBlog(req, res) {
  try {
    const id = req.body.id;
    const query = `UPDATE blogs SET active = 0 WHERE id = ?`;

    db.query(query, [id], (error, result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}
