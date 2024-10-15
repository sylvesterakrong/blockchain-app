// API Route (pages/api/deleteReport/[id].js)
import Report from '@/models/newreport';
import { NextResponse } from 'next/server';
import {connectMongoDB} from '@/lib/mongodb';



export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Missing report ID' }, { status: 400 });
  }

  try {
    await connectMongoDB(); // Ensure database connection is established

    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Report deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
