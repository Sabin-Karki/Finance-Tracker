import axios from "axios";


const BASE_URL = 'http://localhost:8081/api/expense';

export const addExpense = async(expenseData)=>{
    const token = localStorage.getItem('token');
  
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    };
    return await axios.post(`${BASE_URL}`,expenseData,config);
};

export const getAllExpenses=async()=>{
    const token = localStorage.getItem('token');
    if(!token){
        throw new Error("No authentication.");
    }
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        },
    };
    return await axios.get(`${BASE_URL}/all`,config);
};

export const getExpenseStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return await axios.get(`${BASE_URL}/expense-stats`, config);
};

export const updateExpense = async(id,expenseData)=>{
    const token  = localStorage.getItem(`token`);
    if(!token){
        throw new Error('No authentication token found');
    }
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return await axios.put(`${BASE_URL}/${id}`,expenseData,config);
};

export const  deleteExpense = async(id) =>{
    const token = localStorage.getItem(`token`);
    if(!token){
        throw new Error('authentication token not found');
    }
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return await axios.delete(`${BASE_URL}/${id}`,config);
};