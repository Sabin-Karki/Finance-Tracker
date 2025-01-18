import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { getAllIncome, getIncomeStats } from '../services/incomeService';
import { getAllBudgets, getBudgetStats } from '../services/budgetService';
import { getAllExpenses, getExpenseStats } from '../services/expenseService';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBudgets, setTotalBudgets] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null); // To store the selected data (income, expenses)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      setUsername(tokenData.sub);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  // Function to group data by month
  const groupByMonth = (data) => {
    const grouped = {};
    data.forEach((item) => {
      try {
        const date = new Date(item.date); // Parse the date from yyyy-mm-dd format
        if (isNaN(date.getTime())) {
          console.error('Invalid date:', item.date);
          return;
        }
        const month = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`; // Format: "Month Year"
        if (!grouped[month]) {
          grouped[month] = 0;
        }
        grouped[month] += item.amount;
      } catch (error) {
        console.error('Error parsing date:', item.date, error);
      }
    });
    return Object.entries(grouped).map(([month, amount]) => ({ month, amount }));
  };

  // Function to handle modal open
  const handleOpenModal = (type, data) => {
    const groupedData = groupByMonth(data);
    setSelectedData({ type, data: groupedData });
    setIsModalOpen(true);
  };
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const incomeResponse = await getAllIncome();
      const budgetResponse = await getAllBudgets();
      const expenseResponse = await getAllExpenses();

      setTotalIncome(incomeResponse.data.reduce((acc, entry) => acc + entry.amount, 0));
      setTotalBudgets(budgetResponse.data.reduce((acc, budget) => acc + parseFloat(budget.amount), 0));
      setTotalExpenses(expenseResponse.data.reduce((acc, entry) => acc + entry.amount, 0));

      const incomeStats = await getIncomeStats();
      const expenseStats = await getExpenseStats();
      const budgetStats = await getBudgetStats();

      // Sort incomeData by date
      const incomeDataFormatted = incomeStats.data
        .map(item => ({
          date: item.date,
          amount: item.totalAmount
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
      setIncomeData(incomeDataFormatted);

      // Sort expenseData by date
      const expenseDataFormatted = expenseStats.data
        .map(item => ({
          date: item.date,
          amount: item.totalAmount
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
      setExpenseData(expenseDataFormatted);

      const combinedDataPoints = [...new Set([...incomeDataFormatted, ...expenseDataFormatted].map(item => item.date))].map(date => ({
        date,
        income: incomeDataFormatted.find(item => item.date === date)?.amount || 0,
        expenses: expenseDataFormatted.find(item => item.date === date)?.amount || 0
      }));
      setCombinedData(combinedDataPoints.sort((a, b) => new Date(a.date) - new Date(b.date)));

      setBudgetData(budgetStats.data.map(item => ({
        name: item.category,
        value: parseFloat(item.spent)
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  fetchData();
}, []);

   return (
    <div className="flex-1 p-6 bg-gray-100">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>
        <div className="relative">
          <button
            className="flex items-center gap-2 p-2 bg-gray-200 rounded-md"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <User size={20} />
            <span>{username}</span>
            <ChevronDown size={16} />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          className="bg-green-500 text-white p-6 rounded-lg shadow cursor-pointer hover:bg-green-600 transition duration-200"
          onClick={() => handleOpenModal('income', incomeData)}
        >
          <p className="text-xl">Total Income</p>
          <p className="text-2xl font-bold">Rs {totalIncome.toFixed(2)}</p>
        </div>
        <div
          className="bg-red-500 text-white p-6 rounded-lg shadow cursor-pointer hover:bg-red-600 transition duration-200"
          onClick={() => handleOpenModal('expenses', expenseData)}
        >
          <p className="text-xl">Total Expenses</p>
          <p className="text-2xl font-bold">Rs {totalExpenses.toFixed(2)}</p>
        </div>
        <div
          className="bg-blue-500 text-white p-6 rounded-lg shadow cursor-pointer hover:bg-blue-600 transition duration-200"
        >
          <p className="text-xl">Total Budgets</p>
          <p className="text-2xl font-bold">Rs {totalBudgets.toFixed(2)}</p>
        </div>
      </div>

      {/* Modal for Monthly Breakdown */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedData.type.toUpperCase()} Monthly Breakdown</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3">
              {selectedData.data.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
                  <span className="font-medium">{item.month}</span>
                  <span className="font-bold">Rs {item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rest of the dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Income Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#4CAF50" name="Income" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Expense Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#f44336" name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Income vs Expense Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#f44336" name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Budget Allocation by Category</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={budgetData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {budgetData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;