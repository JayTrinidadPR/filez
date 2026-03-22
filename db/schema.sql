DROP TABLE  IF EXISTS files; /* Drop the 'files' table if it exists to avoid conflicts when creating it again. */
DROP TABLE IF EXISTS folders; /* Drop the 'folders' table if it exists to avoid conflicts when creating it again. */

CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
name TEXT NOT NULL UNIQUE
); /* Create the 'folders' table with an auto-incrementing 'id' as the primary key and a unique 'name' field. */

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    size INTEGER NOT NULL,
    folder_id INTEGER NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    UNIQUE(name, folder_id)
);