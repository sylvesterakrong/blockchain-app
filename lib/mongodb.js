import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
    }
    /**
     * Global is used here to maintain a cached connection across hot reloads in development.
     * This prevents connections growing exponentially during API Route usage.
     */
    let cached = global.mongoose;

    if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
    }


    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
        bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;

};