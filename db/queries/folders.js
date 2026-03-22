import db from "#db/client";

export async function getAllFolders() {
  const { rows } = await db.query("SELECT * FROM folders");
  return rows;
}

export async function getFolderById(id) {
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
  const { rows } = await db.query(sql, [id]);
  return rows[0];
}

export async function getFolderRecordById(id) {
  const { rows } = await db.query("SELECT * FROM folders WHERE id = $1", [id]);
  return rows[0];
}
