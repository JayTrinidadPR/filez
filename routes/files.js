import express from "express";
import { getAllFiles } from "#db/queries/files";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const files = await getAllFiles();
    res.send(files);
  } catch (err) {
    next(err);
  }
});

export default router;
