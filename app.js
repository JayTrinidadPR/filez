import express from "express";
import db from "#db/client";

const app = express();

app.use(express.json());

app.get("/files", async (req, res, next) => {
  try {
    const sql = `
      SELECT
        files.*,
        folders.name AS folder_name
      FROM files
      JOIN folders ON files.folder_id = folders.id
    `;
    const { rows } = await db.query(sql);
    res.send(rows);
  } catch (err) {
    next(err);
  }
});

app.get("/folders", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM folders");
    res.send(rows);
  } catch (err) {
    next(err);
  }
});

app.get("/folders/:id", async (req, res, next) => {
  try {
    const sql = `
      SELECT
        folders.*,
        COALESCE(
          json_agg(files.*) FILTER (WHERE files.id IS NOT NULL),
          '[]'
        ) AS files
      FROM folders
      LEFT JOIN files ON folders.id = files.folder_id
      WHERE folders.id = $1
      GROUP BY folders.id
    `;
    const { rows } = await db.query(sql, [req.params.id]);
    const folder = rows[0];

    if (!folder) {
      return res.status(404).send("Folder not found.");
    }

    res.send(folder);
  } catch (err) {
    next(err);
  }
});

app.post("/folders/:id/files", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM folders WHERE id = $1", [
      req.params.id,
    ]);
    const folder = rows[0];

    if (!folder) {
      return res.status(404).send("Folder not found.");
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send("Request body required.");
    }

    const { name, size } = req.body;
    if (name == null || size == null) {
      return res.status(400).send("Missing required fields.");
    }

    const insertSql = `
      INSERT INTO files (name, size, folder_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(insertSql, [name, size, req.params.id]);
    res.status(201).send(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status ?? 500).send(err.message ?? "Internal Server Error");
});

export default app;
