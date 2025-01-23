import React from "react"
import { useState } from "react"

const ExpenseForm=({onSubmit})=>{
    const [formData,setFormData]=useState({
        title:'',
        amount:'',
        date:'',
        category:'',
        description:''
    });

    const validResult = /^[A-Za-z\s]+$/;
    const [errorMessage , setErrorMessage] = useState('');
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData((prevState)=>({
            ...prevState,
            [name]:value,
        }));
        setErrorMessage (''); // clear error Message when user starts typing
    }   
    
      const validateForm = () => {
      if (!formData.title.trim()){
        setErrorMessage('Title is required');
        return false;
      }
      if (!formData.title.match(validResult)){
        setErrorMessage('Title should contain only letters and spaces');
        return false;
      }
      if (!formData.amount){
        setErrorMessage('Amount is required');  
        return false;
      }
      if (!formData.date){
        setErrorMessage('Date is required');
        return false;
      }
      if(!formData.category.trim()){
        setErrorMessage('Category is required');
        return false;
      }
      if(!formData.category.match(validResult)){
        setErrorMessage('Category should contain only letters and spaces');
        return false;
      }
      if(!formData.description.trim()){
        setErrorMessage('Description is required');
        return false;
      }
      if(!formData.description.match(validResult)){
        setErrorMessage('Description should contain only letters and spaces');
      }
      return true;
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        if (validateForm()){
        onSubmit(formData);
        setFormData({
            title:'',
            amount:'',
            date:'',
            category:'',
            description:'',
        });
        setErrorMessage (''); // clear error message after submission.
    }
  };
  
    return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
      {errorMessage && ( 
        <div className="bg-red-100 text-red-700 p-4 rounded" >
        {errorMessage}
      </div>)}
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

      <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
        Add Expense
      </button>
    </form>
  );
}
export default ExpenseForm;
