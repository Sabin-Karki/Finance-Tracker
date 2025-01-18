import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/income';

export const addIncome = async (incomeData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return await axios.post(`${BASE_URL}`, incomeData, config);
};

export const getAllIncome = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.'); // Handle missing token
    }
    
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return await axios.get(`${BASE_URL}`, config);
};

export const getIncomeStats = async () => {
  const token = localStorage.getItem('token');
  if(!token ){
    throw new Error('no authentication token found');

  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return await axios.get(`${BASE_URL}/chart-data`,config);
};

export const updateIncome = async(id,incomeData)=>{
  const token = localStorage.getItem(`token`);
  if(!token){
    throw new Error('No authentication token found');
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return await axios.put(`${BASE_URL}/${id}`,incomeData,config);

};

export const  deleteIncome = async ( id ) =>{
  const token  = localStorage.getItem(`token`);
  if(!token){
    throw new Error (' no authentication token found');
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return await axios.delete(`${BASE_URL}/${id}`,config);
};


