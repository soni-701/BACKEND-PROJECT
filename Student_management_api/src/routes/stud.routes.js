const express= require('express');
const {createStudent,getStudent}=require('../controllers/stud.contollers');

const router=express.Router();


router.post('/create',createStudent);
router.get('/create',getStudent);

module.exports=router;