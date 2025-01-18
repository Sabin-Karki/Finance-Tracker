import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import myImage from '../assets/image1.png';

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    try {
      let response;
      if (isLogin) {
        response = await axios.post('http://localhost:8081/api/auth/login', {
          username,
          password,
        });
        const { token } = response.data;
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        response = await axios.post('http://localhost:8081/api/auth/register', {
          username,
          email,
          password,
        });
        setIsLogin(true);
        setErrorMessage('Registration successful. Please log in.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to authenticate. Please try again.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;
      if (Date.now() < expirationTime) {
        navigate('/dashboard');
      } else {
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex items-top justify-center lg:justify-end order-2 lg:order-1">
          <div className="relative w-full max-w-lg">
            <div className="absolute -inset-1 bg-white/30 rounded-lg blur-xl"></div>
            <img
              src={myImage}
              alt="FinanceTracker Illustration"
              className="relative w-full h-auto rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white text-center lg:text-left tracking-tight">
              Welcome to FinanceTracker
            </h2>
            <p className="mt-4 text-xl text-indigo-100 text-center lg:text-left">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </p>

            <div className="mt-8">
              <div className="bg-white/95 backdrop-blur-sm p-8 shadow-2xl rounded-lg">
                {errorMessage && (
                  <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {errorMessage}
                  </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                      {isLogin ? 'Sign in' : 'Sign up'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </form>

                <div className="mt-6">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
                  >
                    {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}