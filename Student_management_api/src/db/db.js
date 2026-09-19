const mongoose= require('mongoose');


async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully");
    } catch (error) {
        console.log("mongodb is not connected successfully");
    }
}

module.exports=connectDB;