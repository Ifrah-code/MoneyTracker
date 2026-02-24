import { useState } from "react";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = "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"; // Replace with your OpenAI API key

const SmartInsights = ({ transactions }) => {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usingAI, setUsingAI] = useState(true);

  const totalIncome = transactions?.filter(t => t.type === "INCOME").reduce((acc, t) => acc + t.amount, 0) || 0;
  const totalExpense = transactions?.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + t.amount, 0) || 0;
  const savings = totalIncome - totalExpense;

  const getBaseAlert = () => {
    if (savings >= 50000) {
      return {
        type: "success",
        icon: "🎉",
        title: "Excellent Financial Health!",
        baseMessage: `Amazing! You have ₹${savings.toLocaleString()} in savings. Keep up the great work!`,
        tip: "Consider investing some of your savings for better returns.",
        color: "#22c55e",
        bg: "rgba(34, 197, 94, 0.15)",
        border: "rgba(34, 197, 94, 0.4)"
      };
    } else if (savings >= 20000) {
      return {
        type: "warning",
        icon: "⚠️",
        title: "Moderate Savings",
        baseMessage: `You have ₹${savings.toLocaleString()} saved. Try to save more to reach ₹50,000 for better financial security.`,
        tip: "Try the 50/30/20 rule - 50% needs, 30% wants, 20% savings.",
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.15)",
        border: "rgba(245, 158, 11, 0.4)"
      };
    } else if (savings >= 0) {
      return {
        type: "danger",
        icon: "🚨",
        title: "Low Savings Alert!",
        baseMessage: `Your savings are only ₹${savings.toLocaleString()}. Consider reducing expenses to build an emergency fund.`,
        tip: "Review your expenses and cut non-essential spending immediately.",
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.15)",
        border: "rgba(239, 68, 68, 0.4)"
      };
    } else {
      return {
        type: "critical",
        icon: "💸",
        title: "Critical! Negative Balance",
        baseMessage: `You're spending ₹${Math.abs(savings).toLocaleString()} more than you earn! Urgent action needed.`,
        tip: "Create a strict budget and eliminate unnecessary expenses now.",
        color: "#dc2626",
        bg: "rgba(220, 38, 38, 0.2)",
        border: "rgba(220, 38, 38, 0.5)"
      };
    }
  };

  const getAIInsights = async () => {
    if (transactions.length === 0) {
      setAlert({
        ...getBaseAlert(),
        aiMessage: null,
        message: "Add some transactions first to get insights!"
      });
      return;
    }

    setLoading(true);
    const baseAlert = getBaseAlert();

    try {
      const topExpenses = transactions
        .filter(t => t.type === "EXPENSE")
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3)
        .map(t => `${t.description}: ₹${t.amount}`)
        .join(", ");

      const prompt = `You are a friendly financial advisor. Analyze this data:

Income: ₹${totalIncome}
Expenses: ₹${totalExpense}
Savings: ₹${savings}
Status: ${baseAlert.type}
Top expenses: ${topExpenses}

Give ONE personalized sentence of advice (max 20 words) based on their ${baseAlert.type} status. Be encouraging, specific, and actionable. Do NOT use emojis.`;

      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // or "gpt-4" for better results
          messages: [
            {
              role: "system",
              content: "You are a helpful financial advisor who gives concise, actionable advice."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 50,
          temperature: 0.7
        }),
      });

      if (!response.ok) throw new Error("API failed");

      const data = await response.json();
      const aiAdvice = data.choices?.[0]?.message?.content?.trim();

      if (aiAdvice) {
        setAlert({
          ...baseAlert,
          aiMessage: aiAdvice,
          message: aiAdvice
        });
        setUsingAI(true);
      } else {
        throw new Error("No AI response");
      }

    } catch (err) {
      console.log("AI failed, using fallback:", err.message);
      setAlert({
        ...baseAlert,
        aiMessage: null,
        message: baseAlert.baseMessage
      });
      setUsingAI(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      marginTop: "30px",
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "20px",
      padding: "25px",
      boxSizing: "border-box"
    }}>
      
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <h3 style={{ margin: 0, color: "#fff", fontSize: "1.5rem" }}>
          🤖 AI Financial Insights
        </h3>
        <button 
          onClick={getAIInsights}
          disabled={loading || transactions.length === 0}
          style={{
            background: loading ? "#6b7280" : "linear-gradient(135deg, #10a37f, #1a7f64)",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: "bold",
            cursor: loading || transactions.length === 0 ? "not-allowed" : "pointer",
            fontSize: "0.95rem",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(16, 163, 127, 0.3)"
          }}
        >
          {loading ? "🔄 ChatGPT Analyzing..." : "✨ Get ChatGPT Insights"}
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        marginBottom: "20px"
      }}>
        <div style={{
          background: "rgba(34, 197, 94, 0.1)",
          border: "1px solid rgba(34, 197, 94, 0.3)",
          padding: "15px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <div style={{ color: "#022b03", fontWeight: "800", fontSize: "1.3rem" }}>
            ₹{totalIncome.toLocaleString()}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginTop: "4px" }}>
            Total Income
          </div>
        </div>

        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          padding: "15px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <div style={{ color: "#330e04", fontWeight: "800", fontSize: "1.3rem" }}>
            ₹{totalExpense.toLocaleString()}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginTop: "4px" }}>
            Total Expenses
          </div>
        </div>

        <div style={{
          background: savings >= 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
          border: savings >= 0 ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
          padding: "15px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <div style={{ color: savings >= 0 ? "#022b03" : "#ef4444", fontWeight: "800", fontSize: "1.3rem" }}>
            {savings >= 0 ? "+" : ""}₹{savings.toLocaleString()}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginTop: "4px" }}>
            Savings
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          padding: "30px 20px",
          textAlign: "center",
          background: "rgba(16, 163, 127, 0.1)",
          border: "1px solid rgba(16, 163, 127, 0.3)",
          borderRadius: "16px",
          color: "#10a37f"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🤖</div>
          <div style={{ fontSize: "1rem", fontWeight: "600" }}>
            ChatGPT is analyzing your finances...
          </div>
          <div style={{ fontSize: "0.85rem", marginTop: "5px", opacity: 0.7 }}>
            This may take a few seconds
          </div>
        </div>
      )}

      {/* Alert Display */}
      {alert && !loading && (
        <div style={{
          background: alert.bg,
          border: `2px solid ${alert.border}`,
          borderRadius: "16px",
          padding: "20px 24px",
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          animation: "slideIn 0.4s ease-out",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}>
          <div style={{ fontSize: "2.5rem", flexShrink: 0, lineHeight: 1 }}>
            {alert.icon}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ 
              margin: "0 0 8px 0", 
              color: alert.color, 
              fontSize: "1.2rem",
              fontWeight: "700"
            }}>
              {alert.title}
            </h4>
            
            <p style={{ 
              margin: "0 0 12px 0", 
              color: "rgba(255,255,255,0.95)", 
              fontSize: "1.05rem",
              lineHeight: "1.6",
              fontWeight: "500"
            }}>
              {alert.message}
            </p>

            {/* ChatGPT Badge */}
            {usingAI && alert.aiMessage && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(16, 163, 127, 0.2)",
                border: "1px solid rgba(16, 163, 127, 0.4)",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "0.75rem",
                color: "#10a37f",
                fontWeight: "600",
                marginBottom: "12px"
              }}>
                <span>🤖</span> ChatGPT-Powered Advice
              </div>
            )}

            <div style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.1)"
            }}>
              <div style={{ 
                fontSize: "0.9rem", 
                color: "rgba(255,255,255,0.8)",
                lineHeight: "1.6"
              }}>
                <strong>💡 Tip:</strong> {alert.tip}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!alert && !loading && (
        <div style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.5)",
          padding: "40px 20px",
          fontSize: "0.95rem"
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "15px" }}>🤖</div>
          <p style={{ margin: "0 0 10px 0", fontSize: "1.1rem", color: "rgba(255,255,255,0.7)" }}>
            Ready for ChatGPT-powered financial insights?
          </p>
          <p style={{ margin: 0 }}>
            ChatGPT will analyze your spending and give personalized advice
          </p>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SmartInsights;