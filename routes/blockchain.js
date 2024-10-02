import express from 'express'
import {actByStatus,par} from '../controllers/blockchain.js'

const router = express.Router()

router.get('/actByStatus',actByStatus)
router.get('/par',par)


export default router