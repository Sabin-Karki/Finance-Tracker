import React, { useState } from 'react';

const BudgetForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    spent: ''
  });

  const validInput = /^[A-Za-z\s]+$/;
  const [errorMessage , setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrorMessage('');
  };

  const validateForm = ()=>{
    if(!formData.name.trim()){
      setErrorMessage('Name is required');
      return false; 
    }
    if(!formData.name.match(validInput)){
      setErrorMessage('Name should contain only alphabets');
      return false;
    }
    if(!formData.amount){
      setErrorMessage('Amount is required');
      return false;
    } 
    if(!formData.category.trim()){
      setErrorMessage('Category is required');
      return false;
    }
     if(!formData.category.match(validInput)){
      setErrorMessage('Category should contain only alphabets');
      return false;
    }
    if(!formData.spent){
      setErrorMessage('Spent amount is not filled !');
      return false;
    }
    return true;
  }
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form refresh
    if(validateForm()){
    onSubmit(formData); // Submit the form data
    setFormData({
      name: '',
      amount: '',
      category: '',
      spent: ''
    }); // Reset form after submission
  
  setErrorMessage(''); 
}
};

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
      {errorMessage && (<div className='bg-red-100 text-red-700 p-4 rounded'>{errorMessage}</div>)}
      <div className="space-y-2">
        <label className="block text-gray-700 font-bold">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
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
        <label className="block text-gray-700 font-bold">Spent (Optional)</label>
        <input
          type="number"
          name="spent"
          value={formData.spent}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
        Add Budget
      </button>
    </form>
  );
};

export default BudgetForm;
