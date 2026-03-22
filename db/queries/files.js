import db from "#db/client";

export async function getAllFiles() {
  const sql = `
    SELECT
      files.*,
      folders.name AS folder_name
    FROM files
    JOIN folders ON files.folder_id = folders.id
  `;
  const { rows } = await db.query(sql);
  return rows;
}

export async function createFile(name, size, folderId) {
  const sql = `
    INSERT INTO files (name, size, folder_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows } = await db.query(sql, [name, size, folderId]);
  return rows[0];
}
