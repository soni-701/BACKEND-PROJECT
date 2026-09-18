const express=require('express');
const authRoutes=require('./routes/user.routes');
const taskRoutes=require('./routes/task.route');
const helmet = require('helmet');
const cors=require('cors');


const app=express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger");
app.use(express.json());
app.use(helmet());
app.use(cors());


// helmet use for security related http headers to your express response
//cors controls which fronted application are allowed to call your backend api
app.use('/api/auth',authRoutes);
app.use('/api/task',taskRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({
        message: "Task Tracker API is running",
        documentation: "/api-docs"
    });
});

module.exports=app;