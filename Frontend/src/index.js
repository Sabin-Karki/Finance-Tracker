import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './components/Dashboard';
import IncomePage from './pages/IncomePage';
import Sidebar from './components/SideBar';
import './index.css';
import BudgetPage from './pages/BudgetPage';
import ExpensePage from './pages/ExpensePage';

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  // Decode token and check expiration
  const tokenData = JSON.parse(atob(token.split('.')[1]));
  const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
  return Date.now() < expirationTime;
};

// Component to protect routes
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

// Layout with Sidebar for protected routes
const LayoutWithSidebar = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

// Rendering the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Public route for the Landing Page */}
        <Route 
          path="/" 
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <LandingPage />} 
        />
        
        {/* Protected routes with Sidebar */}
        <Route element={<ProtectedRoute><LayoutWithSidebar /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/budget" element={<BudgetPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
