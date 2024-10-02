import express from 'express'
import {
    login,
    register,
    register2,
    arrayregister,
    userName
} from "../controllers/auth.js"

const router = express.Router()

router.post("/register", register)
router.post("/register2", register2)
router.post("/arrayregister", arrayregister)
router.post("/login", login)
router.get("/login", userName)

export default router;