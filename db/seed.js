import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const folder = ["documents", "pictures", "music"];

  for (const folderName of folder) {
    const folderResults = await db.query(
      `
      INSERT INTO folders (name) 
      VALUES ($1) 
      RETURNING *;
      `,
      [folderName]
    );

    const folder = folderResults.rows[0];

    const files = [
      ["file1.text", 100, folder.id],
      ["file2.text", 200, folder.id],
      ["file3.text", 300, folder.id],
      ["file4.text", 400, folder.id],
      ["file5.text", 500, folder.id],
    ];

    for (const file of files) {
      await db.query(
        `
        INSERT INTO files (name, size, folder_id) 
        VALUES ($1, $2, $3);
        `,
        file
      );
    }
  }
}
