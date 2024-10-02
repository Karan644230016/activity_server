import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import user from "./routes/user.js";
import student from "./routes/student.js";
import admin from "./routes/admin.js";
import teacher from "./routes/teacher.js";
import activity from "./routes/activity.js";
import participate from "./routes/participate.js";
import section from "./routes/section.js";
import forgotPassword from "./routes/forgotPassword.js";
import notification from "./routes/notification.js";
import status from "./routes/status.js";
import notify from "./routes/notify.js";
import blockchain from "./routes/blockchain.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/", user);
app.use("/", student);
app.use("/", admin);
app.use("/", teacher);
app.use("/", activity);
app.use("/", participate);
app.use("/", section);
app.use("/", forgotPassword);
app.use("/", notification);
app.use("/status", status);
app.use("/", notify);
app.use("/", blockchain);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server on port 3000"));
