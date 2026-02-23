import React from "react";

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  
  console.log("🔍 TransactionList component rendered");
  console.log("🔍 Number of transactions:", transactions?.length);
  console.log("🔍 Delete function exists?", typeof onDeleteTransaction === 'function');

  const handleDeleteClick = (transaction) => {
    console.log("🔴 DELETE CLICKED!");
    console.log("🔴 Transaction:", transaction);
    console.log("🔴 ID:", transaction.id);
    
    if (window.confirm(`Delete "${transaction.description}"?`)) {
      console.log("🔴 User confirmed, calling onDeleteTransaction");
      onDeleteTransaction(transaction.id);
    } else {
      console.log("🔴 User cancelled delete");
    }
  };

  return (
    <div className="transaction-list">
      <h3>Transactions History</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {transactions.map((t) => (
            <li key={t.id} className={t.type.toLowerCase()}>
              <span className="description">{t.description}</span>
              <span className="amount">
                {t.type === "INCOME" ? ` +₹${t.amount}` : ` -₹${t.amount}`}
              </span>
              <button 
                onClick={() => handleDeleteClick(t)}
                onMouseDown={() => console.log("🟡 Mouse down on delete button")}
                onMouseUp={() => console.log("🟢 Mouse up on delete button")}
                type="button"
                style={{
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  zIndex: 1000
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;