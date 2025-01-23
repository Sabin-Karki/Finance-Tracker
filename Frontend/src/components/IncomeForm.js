import React, { useState } from 'react';

const IncomeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    description: '',
  });

  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const validInput = /^[A-Za-z\s]+$/;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear the error message when the user starts typing
    setErrorMessage('');
  };

 const validateForm = () => {
  // Check if title is empty
  if (!formData.title.trim()) {
    setErrorMessage('Title is required');
    return false;
  }
  // Check if title contains invalid characters
  if (!formData.title.match(validInput)) {
    setErrorMessage('Title should contain only letters and spaces');
    return false;
  }

  // Check if amount is empty
  if (!formData.amount) {
    setErrorMessage('Amount is required');
    return false;
  }

  // Check if date is empty
  if (!formData.date) {
    setErrorMessage('Date is required');
    return false;
  }

  // Check if category is empty
  if (!formData.category.trim()) {
    setErrorMessage('Category is required');
    return false;
  }
  // Check if category contains invalid characters
  if (!formData.category.match(validInput)) {
    setErrorMessage('Category should contain only letters and spaces');
    return false;
  }

  // Check if description is empty
  if (!formData.description.trim()) {
    setErrorMessage('Description is required');
    return false;
  }
  // Check if description contains invalid characters
  if (!formData.description.match(validInput)) {
    setErrorMessage('Description should contain only letters and spaces');
    return false;
  }

  return true; // Form is valid
};
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData); // Call the parent function to handle submission
      setFormData({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
      });
      setErrorMessage(''); // Clear the error message after successful submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 py-8 px-6 shadow-xl sm:rounded-lg sm:px-10">
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-gray-700 font-bold">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-bold">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-bold">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-bold">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-bold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Add Income
      </button>
    </form>
  );
};

export default IncomeForm;
