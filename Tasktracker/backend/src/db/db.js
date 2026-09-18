const mongoose=require('mongoose');

async function connectDB(req,res){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected successfully")
    } catch (error) {
        console.log('MongoDb is not connected',error);
        throw error;
    }
}

module.exports=connectDB;