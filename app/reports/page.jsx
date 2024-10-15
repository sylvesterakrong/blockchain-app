'use client'
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar'
import { useEffect, useState } from "react";
import { Table, TableBody,TableHeader, TableHead , TableRow,TableCell } from "@/components/ui/table";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, LineController, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components
Chart.register(
  CategoryScale,    // Register the "category" scale
  LinearScale,      // For the y-axis
  PointElement,     // For points on the line
  LineElement,      // For the line itself
  LineController,   // The controller for the Line chart
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // Using router for redirection
  const [reports, setReports] = useState([]);
  const [reportData, setReportData] = useState({ labels: [], datasets: [] });
   // Initialize with empty arrays

   const handleDelete = async (reportId) => {
    if (confirm("Are you sure you want to delete this report?")) {
      try {
        const res = await fetch(`/api/deleteReport/${reportId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error(`Failed to delete report: ${res.statusText}`);
        }

        const data = await res.json();
        console.log(data.message);

        setReports((prevReports) => prevReports.filter(report => report._id !== reportId));
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  // Fetch reports
  useEffect(() => {
    if (status === "authenticated") {
      fetchReports();
    }
  }, [status]);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/getReports');
      if (!res.ok) throw new Error('Failed to fetch reports');
      
      const data = await res.json();
      setReports(data.reports || []);
      
      if (data.reportCounts && data.reportCounts.length > 0) {
        const dates = data.reports.map(r => {
          const date = new Date(r.submittedAt);
          return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        });
        const counts = data.reportCounts.map(r => r.count);

        setReportData({
          labels: dates,
          datasets: [
            {
              label: 'Report Count',
              data: counts,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };
  
  return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* <!-- Sidebar --> */}
        <Sidebar/>

        {/* <!-- Main Content Area --> */}
        <div className="flex-1 flex flex-col">
          {/* <!-- Top Title Navigation --> */}
          <nav className="bg-gray-200 shadow-slate-200 p-4">
            <h1 className="text-2xl font-bold">Sharded Blockchain Data Management and Monetization System</h1>
          </nav>

          {/* <!-- Main Content --> */}
          <main className="p-6 bg-gray-50 flex-1">
          <div className="p-6">
            <h2 className="text-xl mb-4">Reports</h2>

            <div className='mb-7 p-3'>
              <h3>Report Submissions Over Time</h3>
              <Line data={reportData} />
            </div>

            {/* Reports Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report, index) => (
                  <TableRow key={report._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{new Date(report.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{report.status || 'Submitted'}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(report._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Reports