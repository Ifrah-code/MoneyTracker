import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Dashboard from "./components/Dashboard";
import "./App.css";
import SmartInsights from "./components/SmartInsights";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

console.log("🌐 App initialized, BASE_URL:", BASE_URL);

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    console.log("📥 Fetching transactions...");
    axios
      .get(`${BASE_URL}/api/transactions`)
      .then((res) => {
        console.log("✅ Transactions fetched:", res.data);
        setTransactions(res.data);
      })
      .catch((err) => console.error("❌ Error fetching transactions:", err));
  }, []);

  const addTransaction = (transaction) => {
    console.log("➕ Adding transaction:", transaction);
    const positiveAmount = Math.abs(transaction.amount);

    axios
      .post(`${BASE_URL}/api/transactions`, { 
        ...transaction,
        amount: positiveAmount,
      })
      .then((res) => {
        console.log("✅ Transaction added:", res.data);
        setTransactions([...transactions, res.data]);
      })
      .catch((err) => console.error("❌ Error adding transaction:", err));
  };

  const deleteTransaction = (id) => {
    console.log("🗑️ DELETE FUNCTION CALLED in App.js");
    console.log("🗑️ Deleting transaction with ID:", id);
    console.log("🗑️ Current transactions:", transactions);
    console.log("🗑️ Delete URL:", `${BASE_URL}/api/transactions/${id}`);

    axios
      .delete(`${BASE_URL}/api/transactions/${id}`)
      .then((response) => {
        console.log("✅ Delete successful! Response:", response);
        const updated = transactions.filter((t) => t.id !== id);
        console.log("✅ Updated transactions:", updated);
        setTransactions(updated);
      })
      .catch((err) => {
        console.error("❌ Error deleting transaction:", err);
        console.error("❌ Error response:", err.response);
        alert("Delete failed! Check console.");
      });
  };

  const totalBalance = transactions.reduce((acc, t) => {
    if (!t.type) return acc;
    return t.type === "INCOME" ? acc + t.amount : acc - t.amount;
  }, 0);

  console.log("🔄 Rendering App, transactions count:", transactions.length);

  return (
    <div className="app-container">
      <h1>💰AI Expense Tracker</h1>
      <h2>
        Balance: ₹{totalBalance >= 0 ? totalBalance : `-${Math.abs(totalBalance)}`}
      </h2>
      <TransactionForm onAddTransaction={addTransaction} />
      <TransactionList
        transactions={transactions}
        onDeleteTransaction={deleteTransaction}
      />
      <Dashboard transactions={transactions} />
      <SmartInsights transactions={transactions} />
    </div>
  );
}

export default App;