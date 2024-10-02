import express from "express";
import {
  readManage,
  readManageOne,
  reserveActivity,
  cancelReserve,
  decreaseNumStd,
  upload,
  getByStd_ID,
  getByAct_ID,
  updateStatus,
  countNumStdReserve,
} from "../controllers/participate.js";

const router = express.Router();

router.get("/participate", getByStd_ID);
router.get("/reserve", getByAct_ID);
router.get("/countNumStdReserve/:act_ID", countNumStdReserve);

router.get("/reserve/:id", readManageOne);
router.get("/upload", upload);

router.post("/participate", reserveActivity);

router.delete("/reserve", cancelReserve);
router.put("/cancelReserve", decreaseNumStd);

// status join notjoin activity
router.put("/participate", updateStatus);

export default router;
