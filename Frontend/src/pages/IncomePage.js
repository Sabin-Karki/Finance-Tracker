import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import IncomeForm from '../components/IncomeForm';
import { addIncome, getAllIncome, updateIncome, deleteIncome } from '../services/incomeService';

const IncomePage = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // STATE FOR EDIT FORM VALIDATION ERRORS
  const [editErrors, setEditErrors] = useState({});

  // REGEX VALIDATION PATTERN
  const validInput = /^[A-Za-z\s]+$/;

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const fetchIncomeData = async () => {
    try {
      const response = await getAllIncome();
      setIncomeData(response.data);
    } catch (error) {
      console.error('Error fetching income data:', error);
    }
  };

  const handleAddIncome = async (newIncome) => {
    try {
      await addIncome(newIncome);
      await fetchIncomeData();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const startEditing = (income) => {
    setEditingId(income.id);
    setEditData({
      title: income.title,
      amount: income.amount,
      date: income.date,
      category: income.category,
      description: income.description,
    });
    // ADDED: CLEAR ERRORS WHEN STARTING TO EDIT
    setEditErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // ADDED: CLEAR ERROR FOR THE FIELD BEING EDITED
    setEditErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // ADDED: VALIDATION FUNCTION FOR EDIT FORM
  const validateEditForm = () => {
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
    if(!editData.description.trim()){
      errors.description = 'Description is requried';
    }

    // ADDED: REGEX VALIDATION USING .match()
    if (!editData.title.match(validInput)) {
      errors.title = 'Title should contain only letters and spaces';
    }
    if (!editData.category.match(validInput)) {
      errors.category = 'Category should contain only letters and spaces';
    }
    if (!editData.description.match(validInput)) {
      errors.description = 'Description should contain only letters and spaces';
    }


    setEditErrors(errors);
    return Object.keys(errors).length === 0; // RETURN TRUE IF NO ERRORS
  };

  const handleUpdate = async (id) => {
    // ADDED: VALIDATE EDIT FORM BEFORE PROCEEDING
    if (!validateEditForm()) {
      return; // STOP IF VALIDATION FAILS
    }

    // CHECK IF DATA HAS CHANGED
    const originalIncome = incomeData.find((income) => income.id === id);
    const isDataChanged =
      editData.title !== originalIncome.title ||
      editData.amount !== originalIncome.amount ||
      editData.date !== originalIncome.date ||
      editData.category !== originalIncome.category ||
      editData.description !== originalIncome.description;

    if (!isDataChanged) {
      alert('No changes made.');
      return;
    }

    try {
      await updateIncome(id, editData);
      await fetchIncomeData();
      setEditingId(null);
      alert('Income Updated Successfully !!');
    } catch (error) {
      console.error('Error updating income:', error);
      alert('Failed to update. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await deleteIncome(id);
        await fetchIncomeData();
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  };

  const renderIncomeItem = (income) => {
    if (editingId === income.id) {
      return (
        <div key={income.id} className="p-4 bg-white rounded-md shadow-md space-y-3">
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
          {/* ADDED: DISPLAY ERROR MESSAGES FOR TITLE and AMOUNT*/}
          {editErrors.title && (
            <p className="text-red-500 text-sm">{editErrors.title}</p>
          )}
          {editErrors.amount && (
            <p className="text-red-500 text-sm">{editErrors.amount}</p>
          )}

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
          {/* ADDED: DISPLAY ERROR MESSAGES FOR DATE AND CATEGORY */}
          {editErrors.date && (
            <p className="text-red-500 text-sm">{editErrors.date}</p>
          )}
          {editErrors.category && (
            <p className="text-red-500 text-sm">{editErrors.category}</p>
          )}

          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
            className="w-full p-1 border rounded"
            placeholder="Description"
          />
          {/* ADDED: DISPLAY ERROR MESSAGES FOR DESCRIPTION */}
          {editErrors.description && (
            <p className='text-red-500 text-sm'>{editErrors.description}</p>
          )}
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEditingId(null)}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <X size={16} />
            </button>
            <button
              onClick={() => handleUpdate(income.id)}
              className="p-1 text-green-600 hover:text-green-800"
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={income.id} className="p-4 bg-white rounded-md shadow-md">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-lg font-semibold">{income.title}</p>
            <p className="text-sm text-gray-600">
              Rs {income.amount.toLocaleString()} {income.date} {income.category}
            </p>
            {income.description && (
              <p className="text-sm text-gray-500 mt-1">{income.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => startEditing(income)}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(income.id)}
              className="p-1 text-red-600 hover:text-red-800"
            >
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
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Manage Income
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          <Plus size={20} />
          {showForm ? 'Close Form' : 'Add Income'}
        </button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
          <IncomeForm onSubmit={handleAddIncome} />
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-700">
          Income List
        </h2>
        {incomeData.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No income entries found</p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {[...incomeData].reverse().map(renderIncomeItem)}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomePage;
