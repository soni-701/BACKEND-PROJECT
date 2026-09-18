const rateLimit = require("express-rate-limit");

const loginLimiter=rateLimit({
    windowMs:15*50*1000,
    max:10,
    message:{
        message:"Too many login attempt .Please try again later!!"
    }
});

module.exports={loginLimiter};