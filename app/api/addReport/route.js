import { connectMongoDB } from "@/lib/mongodb";
import mongoose from 'mongoose';
import Report from '@/models/newreport';

export async function POST(req) {
    try {
        await connectMongoDB();
        
        const body = await req.json(); 
        const { reportTitle, reportContent, userId } = body;

        console.log('Received request body:', body);

        if (!userId) {
            return new Response(JSON.stringify({ message: 'User ID is missing' }), { status: 400 });
        }

        console.log('Received user ID:', userId);
        console.log('Is valid ObjectId:', mongoose.Types.ObjectId.isValid(userId));

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return new Response(JSON.stringify({ message: 'Invalid user ID format' }), { status: 400 });
        }

        if (!reportTitle || !reportContent) {
            return new Response(JSON.stringify({ message: 'Please provide all required fields' }), { status: 400 });
        }

        const newReport = new Report({
            title: reportTitle,
            content: reportContent,
            user: new mongoose.Types.ObjectId(userId), 
            status: 'Submitted',
            submittedAt: new Date(),
        });
    
        await newReport.save();

        const totalReports = await Report.countDocuments();

        return new Response(JSON.stringify({ message: 'Report submitted successfully', report: newReport, totalReports }), { status: 201 });
    } catch (error) {
        console.error('Error submitting report:', error);
        return new Response(JSON.stringify({ message: 'Error submitting report', error: error.message }), { status: 500 });
    }
}