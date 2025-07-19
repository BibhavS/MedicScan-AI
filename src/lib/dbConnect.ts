import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI){
    throw new Error("Please define mongodb uri in dot env");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {connection: null, promise: null};
}

async function connectToDB(){
    if(cached.connection){
        console.log("Database connection is already setup");
        return cached.connection;
    }

    if(!cached.promise){
        const options = {
            bufferCommands: true,
            maxPoolSize: 10
        }
        cached.promise = mongoose.connect(MONGODB_URI, options).
        then(() => mongoose.connection);
    } 

    try {
        cached.connection  = await cached.promise;   
    } catch (error) {
        cached.promise = null;
        console.log(error);
        throw new Error("Error connecting to database");   
    }
    
    return cached.connection;
}

export default connectToDB;