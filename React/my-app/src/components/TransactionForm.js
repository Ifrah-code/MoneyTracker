import React, { useState } from "react";

const TransactionForm = ({ onAddTransaction }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAddTransaction({
      description,
      amount: parseFloat(amount),
      type: type.toUpperCase(),
    });

    setDescription("");
    setAmount("");
    setType("income");
  };

  // Shared style to force all inputs to be identical
  const inputStyle = {
    width: "100%",
    height: "50px", // Fixed height for all
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    marginBottom: "10px",
    boxSizing: "border-box", // Essential to prevent width overflow
    fontSize: "1rem"
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form" style={{ padding: "10px" }}>
      {/* Ensuring visual consistency across all form elements */}
      <input
        type="text"
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={inputStyle}
      />
      <select 
        value={type} 
        onChange={(e) => setType(e.target.value)}
        style={inputStyle}
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <button type="submit" style={{
        width: "100%",
        padding: "15px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(90deg, #ff4d4d, #007bff)",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer"
      }}>
        ADD TRANSACTION
      </button>
    </form>
  );
};

export default TransactionForm;