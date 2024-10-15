import { useState, useEffect} from 'react';
import { Table, TableBody,TableHeader, TableHead , TableRow,TableCell } from "@/components/ui/table";

const ReportsTable = () => {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/getReports');
        if (!res.ok) throw new Error('Failed to fetch reports');
        
        const data = await res.json();
  
        // Log data to see structure
        console.log('Fetched reports:', data);
  
        setReports(data.reports || []); // Use an empty array if reports are undefined
  
        // Format chart data only if reportCounts is available
        if (data.reportCounts && data.reportCounts.length > 0) {
          const dates = data.reportCounts.map((r) => `${r._id.day}-${r._id.month}-${r._id.year}`);
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

    return (
      <div>
 {/* Reports Table */}
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report, index) => (
                  <TableRow key={report._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{new Date(report.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{report.status || 'Submitted'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
      </div>
    );
  };
  export default ReportsTable; 
