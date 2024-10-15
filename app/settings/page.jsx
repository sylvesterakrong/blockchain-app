'use client'
import Sidebar from '@/components/Sidebar'
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";

const Settings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: session, status } = useSession(); // Get the session
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "loading") return; // Avoid flash of unauthenticated content

    if (!session) {
      signIn('credentials', { callbackUrl: '/login' });
 // Redirect to sign-in page
      return;
    }

    // Populate fields with session data
    setUsername(session.user.username);
    setEmail(session.user.email);
  }, [session, status]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/updateProfile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, username, email }),
    });

    if (res.ok) {
      alert('Profile updated successfully');
      const sessionRes = await fetch('/api/auth/session');
      if (sessionRes.ok) {
        const newSession = await sessionRes.json();
        console.log('New Session:', newSession);
        window.location.reload();
      } else {
        const errorData = await sessionRes.json();
        console.error('Error refreshing session:', errorData);
        alert('Error refreshing session');
      }
    } else {
      alert('Error updating profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    const res = await fetch('/api/updatePassword', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, oldPassword, newPassword }),
    });

    if (res.ok) {
      alert('Password updated successfully');
    } else {
      alert('Error updating password');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <nav className="bg-gray-200 shadow-slate-200 p-4">
          <h1 className="text-2xl font-bold">Sharded Blockchain Data Management and Monetization System</h1>
        </nav>

        <main className="p-6 bg-gray-50 flex-1">
          <div className="p-6">
            <h2 className="text-xl mb-4">Settings</h2>

            <div className='border border-3 p-4'>
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label>Update username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="username"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label>Update email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="New email"
                    required
                  />
                </div>

                <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
                  Apply changes
                </button>
              </form>
            </div>

            <hr className="my-8" />

            <div className='border border-3 p-4'>
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-4 relative">
                  <label>Old password</label>
                  <input
                    type={showOldPassword ? "text" : "password"} 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="Old password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-2 mt-5"
                    onClick={() => setShowOldPassword((prev) => !prev)} 
                  >
                    {showOldPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>

                <div className="mb-4 relative">
                  <label>New password</label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="New password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-2 mt-5"
                    onClick={() => setShowNewPassword((prev) => !prev)} 
                  >
                    {showNewPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>

                <div className="mb-4 relative">
                  <label>Confirm new password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-2 mt-5"
                    onClick={() => setShowConfirmPassword((prev) => !prev)} 
                  >
                    {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>

                <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
                  Change password
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
