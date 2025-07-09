import mongoose from "mongoose"

type Connection = {
    isConnected?: number
}

const connection : Connection = {}

async function connectToDB() : Promise<void> {
    if(connection.isConnected){
        console.log("Database connection is already setup");
        return
    }

    try {
        const dbInstance = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected = dbInstance.connections[0].readyState;
        console.log("Database connection Done");
        
    } catch (error) {
        console.log("Database connection failed | ", error);
        process.exit(1);
        
    }
}

export default connectToDB;