// app/api/updateProfile/route.js
import User from '@/models/user';  // Ensure path to your User model is correct
import { connectMongoDB } from '@/lib/mongodb'; // Ensure connection to MongoDB

export async function PUT(req) { 
    try {
        await connectMongoDB();  // Ensure MongoDB is connected

        const { userId, username, email } = await req.json(); // Extract JSON body from request

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Check if the email or username is already in use by another user
        if (username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername && existingUsername._id.toString() !== userId) {
                return new Response(JSON.stringify({ message: 'Username is already taken' }), { status: 400 });
            }
        }

        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== userId) {
                return new Response(JSON.stringify({ message: 'Email is already in use' }), { status: 400 });
            }
        }

        // Update user fields
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();  // Save the updated user

        return new Response(JSON.stringify({ message: 'Profile updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error updating profile:', error);  // Log the actual error for debugging
        return new Response(JSON.stringify({ message: 'Error updating profile', error }), { status: 500 });
    }
}
