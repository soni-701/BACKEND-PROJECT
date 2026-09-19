const express= require('express');
const app=express();
const studRoutes= require('../src/routes/stud.routes');



app.use(express.json());
app.use('/api/student',studRoutes);

module.exports=app;