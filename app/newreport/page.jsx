'use client'
import { useSession } from 'next-auth/react'; 
import Sidebar from '@/components/Sidebar'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const NewReport = () => {
  const { data: session, status } = useSession();
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log('Full session object:', session);

    if (status === "unauthenticated") {
      router.push('/'); // Redirect to login page if not logged in
    }
  }, [session, status, router]);

      // Redirect to login if unauthenticated
      
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user?.id) {
      setMessage('Error: User ID not available.');
      setLoading(false);
      return;
    }

    let userId = session.user.id;

    const res = await fetch('/api/addReport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reportTitle,
        reportContent,
        userId,
      }),
    });


    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage('Report submitted successfully');
      setReportTitle('');
      setReportContent('');

       // Update the total reports count in local storage
       const currentTotal = Number(localStorage.getItem('totalReports')) || 0;
       localStorage.setItem('totalReports', currentTotal + 1);
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };
  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied. Please log in to submit a report.</p>
  }


return(
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
    <h2 className="text-2xl font-semibold mb-4">Submit a New Report</h2>
    {message && <p className="text-green-600 font-semibold font-20 ">{message}</p>}

    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="reportTitle">Report Title</label>
        <input
          type="text"
          id="reportTitle"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter report title"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="reportContent">Report Content</label>
        <textarea
          id="reportContent"
          value={reportContent}
          onChange={(e) => setReportContent(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter report content"
          rows="6"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  </div>
  </main>
  </div>
  </div>
  )
}

export default NewReport