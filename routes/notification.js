import express from "express";
import {
  post,
  getMailbox,
  upload,
  newsCancelReserve,
} from "../controllers/notification.js";

const router = express.Router();

router.post("/upload", upload);
router.post("/notification", post);
router.post("/cancel-reserve", newsCancelReserve);
router.get("/notification", getMailbox);

export default router;
