import Report from '@/models/newreport';  // Ensure path to your Report model is correct

export async function GET(req, res) {
  try {
    // Fetch all reports
    const reports = await Report.find();

    // Fetch report counts grouped by date
    const reportCounts = await Report.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$submissionDate" },
            month: { $month: "$submissionDate" },
            day: { $dayOfMonth: "$submissionDate" },
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Calculate the total number of reports
    const totalReports = await Report.countDocuments();

    return new Response(JSON.stringify({ reports, reportCounts, totalReports }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching reports', error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
