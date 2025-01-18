import { Link } from 'react-router-dom';
import { LayoutDashboard, Wallet, CreditCard, PiggyBank } from 'lucide-react';

const Sidebar = () => (
  <div className="bg-slate-900 text-gray-100 min-h-screen w-64 p-6 shadow-lg">
    <div className="mb-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
        Finance Tracker
      </h2>
    </div>
    
    <nav>
      <ul className="space-y-2">
        <li>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-all duration-200 group"
          >
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            <span className="font-medium group-hover:text-blue-400">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/income" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-all duration-200 group"
          >
            <Wallet className="w-5 h-5 text-green-400" />
            <span className="font-medium group-hover:text-green-400">Income</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/expenses" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-all duration-200 group"
          >
            <CreditCard className="w-5 h-5 text-red-400" />
            <span className="font-medium group-hover:text-red-400">Expenses</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/budget" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-all duration-200 group"
          >
            <PiggyBank className="w-5 h-5 text-purple-400" />
            <span className="font-medium group-hover:text-purple-400">Budget</span>
          </Link>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;