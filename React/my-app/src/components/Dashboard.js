import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const PIE_COLORS = ["#12911f", "#060678"];
const BAR_COLORS = { INCOME: "#12911f", EXPENSE: "#060678" };

const Dashboard = ({ transactions }) => {
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + t.amount, 0);

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];
  const barData = [
    { name: "Income", Income: totalIncome, Expense: 0 },
    { name: "Expense", Income: 0, Expense: totalExpense },
  ];

  return (
    <div style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}>
      <h2 style={{ textAlign: "center", color: "#fff", marginBottom: "20px" }}>
        Financial Dashboard
      </h2>

      <div
        className="dashboard-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        <div style={{ 
          flex: "1 1 300px", 
          minHeight: "320px", 
          backgroundColor: "#adc3be", 
          borderRadius: "15px", 
          padding: "15px",
          boxSizing: "border-box" 
        }}>
          <h3 style={{ textAlign: "center", color: "#333", margin: "0 0 10px 0" }}>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={30}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ 
          flex: "1 1 300px", 
          minHeight: "320px", 
          backgroundColor: "#adc3be", 
          borderRadius: "15px", 
          padding: "15px",
          boxSizing: "border-box"
        }}>
          <h3 style={{ textAlign: "center", color: "#333", margin: "0 0 10px 0" }}>Analysis Bar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Income" fill={BAR_COLORS.INCOME} />
              <Bar dataKey="Expense" fill={BAR_COLORS.EXPENSE} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ 
        marginTop: "30px", 
        display: "flex", 
        flexDirection: "column", 
        gap: "15px",
        padding: "10px" 
      }}>
       
      </div>
    </div>
  );
};

export default Dashboard;