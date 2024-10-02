import express from "express";
import {
  createActivity,
  updateActivity,
  getAll,
  readActivityOne,
  deleteActivity,
  updateStatus,
  transection,
  uploadWeb3,
} from "../controllers/activity.js";

const Router = express.Router();

Router.post("/activity", createActivity);

Router.get("/activitys", getAll);
Router.get("/activitys/:id", readActivityOne);

Router.put("/activity/:id", updateActivity);

Router.delete("/activitys/:id", deleteActivity);

Router.patch("/uploadWeb3", uploadWeb3);
export default Router;
