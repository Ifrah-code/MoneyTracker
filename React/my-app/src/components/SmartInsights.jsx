import { useState } from "react";

// Current 2026 Model Endpoint
const MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = "AIzaSyCS7F1i5tabhXuWfx30uuZ-dphZDmk_ILI";

const SmartInsights = ({ transactions }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Financial Calculations
  const totalIncome = transactions?.filter(t => t.type === "INCOME").reduce((acc, t) => acc + t.amount, 0) || 0;
  const totalExpense = transactions?.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + t.amount, 0) || 0;
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  const getInsights = async () => {
    if (!transactions || transactions.length === 0) {
      setError("Add some transactions first to get AI insights!");
      return;
    }

    setLoading(true);
    setError(null);

    const summaryStr = transactions.map(t => `${t.type}: ${t.description} - Rs.${t.amount}`).join("\n");
    const prompt = `Act as a finance advisor. Analyze: ${summaryStr}. 
    Summary: Income Rs.${totalIncome}, Exp Rs.${totalExpense}, Sav Rs.${savings}, Rate ${savingsRate}%.
    Return ONLY JSON: {"score": 75, "scoreLabel": "Good", "insights": [{"type": "tip", "title": "Title", "message": "Msg"}], "summary": "One sentence summary."}`;

    try {
      const response = await fetch(`${MODEL_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (!response.ok) throw new Error("API Busy. Please click again.");

      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const jsonStr = rawText.replace(/```json|```/g, "").trim();
      setInsights(JSON.parse(jsonStr));
    } catch (err) {
      setError("Failed to reach Gemini AI. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const typeConfig = {
    tip: { icon: "💡", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" },
    warning: { icon: "⚠️", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
    positive: { icon: "✅", color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)" },
    alert: { icon: "🚨", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
  };

  const scoreColor = (s) => s >= 75 ? "#22c55e" : s >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ marginTop: "30px", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "24px", padding: "28px" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ margin: 0, color: "#fff", fontSize: "1.4rem" }}>🤖 AI Insights</h3>
        </div>
        <button onClick={getInsights} disabled={loading} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>
          {loading ? "Analyzing..." : "✨ Get Insights"}
        </button>
      </div>

      {/* Stats Row with Savings Percentage */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { label: "Income", val: `₹${totalIncome.toLocaleString()}`, col: "#22c55e" },
          { label: "Expenses", val: `₹${totalExpense.toLocaleString()}`, col: "#ef4444" },
          { label: "Savings", val: `₹${savings.toLocaleString()}`, col: savings >= 0 ? "#22c55e" : "#ef4444" },
          { label: "Savings Rate", val: `${savingsRate}%`, col: savingsRate >= 20 ? "#22c55e" : "#f59e0b" }
        ].map(s => (
          <div key={s.label} style={{ flex: "1 1 120px", background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ color: s.col, fontWeight: "800", fontSize: "1rem" }}>{s.val}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {error && <div style={{ color: "#fca5a5", textAlign: "center", padding: "10px" }}>{error}</div>}

      {/* AI Analysis Result */}
      {insights && !loading && (
        <>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "20px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "15px", border: `1px solid ${scoreColor(insights.score)}55` }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", border: `3px solid ${scoreColor(insights.score)}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", color: scoreColor(insights.score) }}>{insights.score}</div>
            <div>
              <div style={{ fontWeight: "800", color: scoreColor(insights.score) }}>{insights.scoreLabel} Financial Health</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>{insights.summary}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {insights.insights.map((ins, i) => {
              const conf = typeConfig[ins.type] || typeConfig.tip;
              return (
                <div key={i} style={{ background: conf.bg, border: `1px solid ${conf.border}`, borderRadius: "14px", padding: "15px", display: "flex", gap: "12px" }}>
                  <span style={{ fontSize: "1.2rem" }}>{conf.icon}</span>
                  <div>
                    <div style={{ color: conf.color, fontWeight: "700", fontSize: "0.9rem" }}>{ins.title}</div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{ins.message}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SmartInsights;