import express from 'express'
import {
    createStudent,
    getStudent,

    updateStudent,
    deleteStudent,
    getStudentOne
} from '../controllers/student.js'

const router = express.Router()


router.post('/students', createStudent)
router.get('/students', getStudent)
router.get('/student/:id', getStudentOne)
router.put('/student/:id', updateStudent)
router.delete('/students/:id', deleteStudent)

export default router