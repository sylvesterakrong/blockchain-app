'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ReportsTable from '@/components/ReportsTable';
import Sidebar from '@/components/Sidebar';
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, LineController, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [reportData, setReportData] = useState({ labels: [], datasets: [] });
  const [totalReports, setTotalReports] = useState(0); // State for total reports
  const [revenue, setRevenue] = useState(0); // State for revenue
  const REVENUE_PER_REPORT = 10; // Define revenue per report submission

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/getReports');
        if (!res.ok) throw new Error('Failed to fetch reports');
        
        const data = await res.json();
        
        setReports(data.reports || []); 

        setTotalReports(data.totalReports || 0);
        setRevenue(data.totalReports ? data.totalReports * REVENUE_PER_REPORT : 0); // Calculate initial revenue

      
        // Log data to see structure
        console.log('Fetched reports:', data);
  
        // Format chart data only if reportCounts is available
        if (data.reportCounts && data.reportCounts.length > 0) {
          const dates = data.reports.map((r) => {
            const date = new Date(r.submittedAt);
            return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`; // Day-Month-Year
          });
          const counts = data.reportCounts.map((r) => r.count);
  
          setReportData({
            labels: dates,
            datasets: [
              {
                label: 'Report Count',
                data: counts,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1 // Add slight curve to the line graph
              },
            ],
          });
        } else {
          console.warn('No report counts available.');
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    }

    fetchReports();
  }, []);

// Function to handle report submission
const handleAddReport = async (newReportData) => {
  try {
    const res = await fetch('/api/addReport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReportData),
    });

    if (!res.ok) throw new Error('Failed to add report');

    const data = await res.json();
    console.log(data.message); // Log success message

    // Update the total reports count and revenue
    setTotalReports((prevTotal) => {
      const newTotal = prevTotal + 1;
      setRevenue(newTotal * REVENUE_PER_REPORT); // Update revenue based on the new total
      return newTotal; // Return the updated total reports
    });
    
  } catch (error) {
    console.error('Error adding report:', error);
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-50 gap-x-[60px]">
            {/* <!-- Sales Chart Card (occupies 2 columns on desktop, 1 on mobile) --> */}
            <Card className="lg:col-span-2 border">
              <CardHeader>
                <CardTitle>Reports over time</CardTitle>
                <CardContent>
                  <div className='mb p-0'>
                    <h3>Report Submissions Over Time</h3>
                    <Line data={reportData} />
                  </div>
                </CardContent>
              </CardHeader>
            </Card>

            {/* <!-- Right-side cards (occupy 1 column on desktop, stacked on mobile) --> */}
            <div className="flex flex-col gap-y-6 w-full lg:w-auto mt-2">
              {/* <!-- Revenue Card --> */}
              <Card className='p-0 w-60'>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl">${revenue.toFixed(2)}</p> {/* Display revenue */}
                </CardContent>
              </Card>

              {/* <!-- Reports Submitted Card --> */}
              <Card className='p-0 w-60'> 
                <CardHeader>
                  <CardTitle>Reports submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl">{totalReports}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className='mt-20 w-full'> {/* Full width container */}
            {/* <!-- Recently Submitted Reports Card --> */}
            <Card className="w-full"> {/* Ensure the card takes full width */}
              <CardHeader>
                <CardTitle>Recently submitted reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-4 p-4 rounded">
                  {/* <!-- Placeholder for table --> */}
                  <ReportsTable/>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
