import express from "express";
import { createFile } from "#db/queries/files";
import {
  getAllFolders,
  getFolderById,
  getFolderRecordById,
} from "#db/queries/folders";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const folders = await getAllFolders();
    res.send(folders);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const folder = await getFolderById(req.params.id);

    if (!folder) {
      return res.status(404).send("Folder not found.");
    }

    res.send(folder);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/files", async (req, res, next) => {
  try {
    const folder = await getFolderRecordById(req.params.id);

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

    const file = await createFile(name, size, req.params.id);
    res.status(201).send(file);
  } catch (err) {
    next(err);
  }
});

export default router;
