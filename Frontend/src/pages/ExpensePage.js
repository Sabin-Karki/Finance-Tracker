import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import ExpenseForm from '../components/ExpenseForm';
import { addExpense, getAllExpenses, updateExpense, deleteExpense } from '../services/expenseService';

const ExpensePage = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [editErrors, setEditErrors] = useState({});
  const validInput= /^[A-Za-z\s]+$/;

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const fetchExpenseData = async () => {
    try {
      const response = await getAllExpenses();
      setExpenseData(response.data);
    } catch (error) {
      console.error('Error fetching expense data:', error);
    }
  };

  const handleAddExpense = async (newExpense) => {
    try {
      await addExpense(newExpense);
      await fetchExpenseData();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const startEditing = (expense) => {
    setEditingId(expense.id);
    setEditData({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      description: expense.description
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
     const errors = {};

  if (!editData.title.trim()) {
    errors.title = 'Title is required';
  }
  if (!editData.amount) {
    errors.amount = 'Amount is required';
  }
  if (!editData.date) {
    errors.date = 'Date is required';
  }
  if (!editData.category.trim()) {
    errors.category = 'Category is required';
  }
  if (!editData.description.trim()) {
    errors.description = 'Description is required';
  }
  if (!editData.title.match(validInput)) {
    errors.title = 'Title should contain only letters and spaces';
  }
  if (!editData.category.match(validInput)) {
    errors.category = 'Category should contain only letters and spaces';
  }
  if(!editData.description.match(validInput)){
    errors.description = 'Description should contain only letters and spaces';
  }

  setEditErrors(errors);
  return Object.keys(errors).length === 0;
};
  
const handleUpdate = async (id) => {
  if (!validateForm()){
    return;
  }
  // Find the original expense entry
  const originalExpense = expenseData.find((expense) => expense.id === id);

  // Check if editData is different from the original data
  const isDataChanged =
    editData.title !== originalExpense.title ||
    editData.amount !== originalExpense.amount ||
    editData.date !== originalExpense.date ||
    editData.category !== originalExpense.category ||
    editData.description !== originalExpense.description;

  if (!isDataChanged) {
    alert("No changes made."); // Notify the user
    return; // Exit the function early
  }

  try {
    await updateExpense(id, editData);
    await fetchExpenseData();
    setEditingId(null);
    alert("Expense Updated Successfully !! ");
  } catch (error) {
    console.error("Error updating income:", error);
    alert("Failed to update. Please try again.");
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense entry?')) {
      try {
        await deleteExpense(id);
        await fetchExpenseData();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const renderExpenseItem = (expense) => {
   if (editingId === expense.id) {
  return (
    <div key={expense.id} className="p-4 bg-white rounded-md shadow-md space-y-3">
      <div className="flex gap-2">
        <input
          name="title"
          value={editData.title}
          onChange={handleChange}
          className={`flex-1 p-1 border rounded ${
            editErrors.title ? 'border-red-500' : ''
          }`}
          placeholder="Title"
        />
        <input
          name="amount"
          type="number"
          value={editData.amount}
          onChange={handleChange}
          className={`w-24 p-1 border rounded ${
            editErrors.amount ? 'border-red-500' : ''
          }`}
          placeholder="Amount"
        />
      </div>
      {editErrors.title && <p className="text-red-500 text-sm">{editErrors.title}</p>}
      {editErrors.amount && <p className="text-red-500 text-sm">{editErrors.amount}</p>}

      <div className="flex gap-2">
        <input
          name="date"
          type="date"
          value={editData.date}
          onChange={handleChange}
          className={`p-1 border rounded ${
            editErrors.date ? 'border-red-500' : ''
          }`}
        />
        <input
          name="category"
          value={editData.category}
          onChange={handleChange}
          className={`flex-1 p-1 border rounded ${
            editErrors.category ? 'border-red-500' : ''
          }`}
          placeholder="Category"
        />
      </div>
      {editErrors.date && <p className="text-red-500 text-sm">{editErrors.date}</p>}
      {editErrors.category && <p className="text-red-500 text-sm">{editErrors.category}</p>}

      <textarea
        name="description"
        value={editData.description}
        onChange={handleChange}
        className="w-full p-1 border rounded"
        placeholder="Description"
      />
      {editErrors.description && <p className="text-red-500 text-sm">{editErrors.description}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={() => setEditingId(null)} className="p-1 text-gray-600 hover:text-gray-800">
          <X size={16} />
        </button>
        <button onClick={() => handleUpdate(expense.id)} className="p-1 text-green-600 hover:text-green-800">
          <Check size={16} />
        </button>
      </div>
    </div>
  );
}

    return (
      <div key={expense.id} className="p-4 bg-white rounded-md shadow-md">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-lg font-semibold">{expense.title}</p>
            <p className="text-sm text-gray-600">Rs {expense.amount.toLocaleString()} • {expense.date} • {expense.category}</p>
            {expense.description && <p className="text-sm text-gray-500 mt-1">{expense.description}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => startEditing(expense)} className="p-1 text-blue-600 hover:text-blue-800">
              <Pencil size={16} />
            </button>
            <button onClick={() => handleDelete(expense.id)} className="p-1 text-red-600 hover:text-red-800">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
 return (
  <div className="p-4 sm:p-6 md:p-8 max-w-screen-md mx-auto space-y-4 sm:space-y-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Manage Expenses</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        <Plus size={20} />
        {showForm ? 'Close Form' : 'Add Expense'}
      </button>
    </div>

    {showForm && (
      <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
        <ExpenseForm onSubmit={handleAddExpense} />
      </div>
    )}

   
 <div className="space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-700">Expense List</h2>
      {expenseData.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No expense entries found</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">{[...expenseData].reverse().map(renderExpenseItem)}</div>
      )}
    </div>
  </div>
);
 
};
export default ExpensePage;
