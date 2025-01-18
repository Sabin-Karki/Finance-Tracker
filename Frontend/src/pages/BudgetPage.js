import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import BudgetForm from '../components/BudgetForm';
import { addBudget, getAllBudgets, updateBudget, deleteBudget } from '../services/budgetService';

const BudgetPage = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      const response = await getAllBudgets();
      setBudgetData(response.data);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    }
  };

  const handleAddBudget = async (newBudget) => {
    try {
      await addBudget(newBudget);
      await fetchBudgetData();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const startEditing = (budget) => {
    setEditingId(budget.id);
    setEditData({
      name: budget.name,
      amount: budget.amount,
      category: budget.category,
      spent: budget.spent,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate if "spent" exceeds "amount"
    if (name === "spent" && parseFloat(value) > parseFloat(editData.amount)) {
      alert("Spent amount cannot exceed the budget amount!");
      return; // Stop updating the state
    }

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      await updateBudget(id, editData);
      await fetchBudgetData();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget entry?')) {
      try {
        await deleteBudget(id);
        await fetchBudgetData();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const renderBudgetItem = (budget) => {
    const isOverBudget = budget.spent > budget.amount;

    if (editingId === budget.id) {
      return (
        <div key={budget.id} className="p-4 bg-white rounded-md shadow-md space-y-3">
          <div className="flex gap-2">
            <input
              name="name"
              value={editData.name}
              onChange={handleChange}
              className="flex-1 p-1 border rounded"
              placeholder="Name"
            />
            <input
              name="amount"
              type="number"
              value={editData.amount}
              onChange={handleChange}
              className="w-24 p-1 border rounded"
              placeholder="Amount"
            />
          </div>
          <input
            name="category"
            value={editData.category}
            onChange={handleChange}
            className="flex-1 p-1 border rounded"
            placeholder="Category"
          />
          <input
            name="spent"
            type="number"
            value={editData.spent}
            onChange={handleChange}
            className="w-24 p-1 border rounded"
            placeholder="Spent"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditingId(null)} className="p-1 text-gray-600 hover:text-gray-800">
              <X size={16} />
            </button>
            <button onClick={() => handleUpdate(budget.id)} className="p-1 text-green-600 hover:text-green-800">
              <Check size={16} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={budget.id} className="p-4 bg-white rounded-md shadow-md">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-lg font-semibold">{budget.name}</p>
            <p className="text-sm text-gray-600">Rs {budget.amount.toLocaleString()} • {budget.category}</p>
            {budget.spent && (
              <p className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-500'} mt-1`}>
                Spent: Rs {budget.spent} {isOverBudget && "(Over Budget!)"}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => startEditing(budget)} className="p-1 text-blue-600 hover:text-blue-800">
              <Pencil size={16} />
            </button>
            <button onClick={() => handleDelete(budget.id)} className="p-1 text-red-600 hover:text-red-800">
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
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Manage Budget</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          <Plus size={20} />
          {showForm ? 'Close Form' : 'Add Budget'}
        </button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
          <BudgetForm onSubmit={handleAddBudget} />
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-700">Budget List</h2>
        {budgetData.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No budget entries found</p>
        ) : (
          <div className="space-y-3 sm:space-y-4">{[...budgetData].reverse().map(renderBudgetItem)}</div>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;