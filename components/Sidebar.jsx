'use client'

import { HomeIcon, PlusIcon, FileTextIcon, GearIcon, ExitIcon  } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
    const { data: session } = useSession();
    console.log('Session Data:', session);

  return (
    <aside className="w-full lg:w-64 bg-purple-800 text-white flex flex-col justify-between">
    <div>
    <div className="p-4 text-center">
        {/* <!-- Profile Section --> */}
        <img className="rounded-full w-24 mx-auto" src="https://i.pinimg.com/564x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg" alt="Profile" />
        <h3 className="mt-4 text-lg font-bold">{session?.user?.username }</h3>
    </div>
    {/* <!-- Navigation --> */}
    <nav className="mt-4">
        <ul className="space-y-4">
        <li>
            <a href="/dashboard" className="flex items-center px-4 py-2 hover:bg-purple-700 rounded">
            <HomeIcon className="mr-2 w-5 h-5" />
            Dashboard
            </a>
        </li>
        <li>
            <a href="/newreport" className="flex items-center px-4 py-2 hover:bg-purple-700 rounded">
            <PlusIcon className="mr-2 w-5 h-5" />
            New Report
            </a>
        </li>
        <li>
            <a href="/reports" className="flex items-center px-4 py-2 hover:bg-purple-700 rounded">
            <FileTextIcon className="mr-2 w-5 h-5" />
            Reports
            </a>
        </li>
        <li>
            <a href="/settings" className="flex items-center px-4 py-2 hover:bg-purple-700 rounded">
            <GearIcon className="mr-2 w-5 h-5" />
            Settings
            </a>
        </li>
        </ul>
    </nav>
    </div>
    {/* <!-- Logout Button --> */}
    <button onClick = {() => signOut()} className="p-4 w-full bg-red-600 hover:bg-red-700 flex justify-center items-center" >
    <ExitIcon className="mr-2 w-5 h-5" />
        Logout
    </button>
    </aside>
  )
}

export default Sidebar