import React from "react";
const TransactionList = ({ transactions, onDeleteTransaction }) => {
  return (
    <div className="transaction-list">
      <h3>Transactions History</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {transactions.map((t) => (
            <li key={t.id} className={t.type}>
              <span>{t.description}</span>
              <span>
                {t.type === "INCOME" ? ` +₹${t.amount}` : ` -₹${t.amount}`}
              </span>
            <button onClick={() => onDeleteTransaction(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default TransactionList;
