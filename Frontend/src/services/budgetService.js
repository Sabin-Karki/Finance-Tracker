import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/budget';

export const addBudget = async (budgetData) => {
  const token = localStorage.getItem('token'); // Ensure the token is retrieved
  if (!token) {
    throw new Error('No token found, user not authenticated');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    },
  };

  return await axios.post(`${BASE_URL}`, budgetData, config); // POST request to create a budget
};


export const getAllBudgets = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.'); // Handle missing token
    }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Add token in Authorization header
    },
  };
  return await axios.get(`${BASE_URL}/all`, config); // GET request to fetch all budgets
};
export const getBudgetStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return await axios.get(`${BASE_URL}/pie-data`, config);
};

export const updateBudget = async(id,budgetData)=>{
    const token  = localStorage.getItem(`token`);
    if(!token){
        throw new Error('No authentication token found');
    }
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return await axios.put(`${BASE_URL}/${id}`,budgetData,config);
};

export const  deleteBudget = async(id) =>{
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