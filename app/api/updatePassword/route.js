// app/api/updatePassword/route.js
import bcrypt from 'bcrypt';
import User from '@/models/user';  // Ensure path to your User model is correct

export async function PUT(req) { // Use named export for PUT
    const { userId, oldPassword, newPassword } = await req.json(); // Extract JSON body from request

    try {
        const user = await User.findById(userId);

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ message: 'Incorrect old password' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        return new Response(JSON.stringify({ message: 'Password updated successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error updating password', error }), { status: 500 });
    }
}
