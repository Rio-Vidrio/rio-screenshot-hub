"use client";

import { ReceiptExpense } from "@/lib/types";
import ActionDivider from "@/components/ActionDivider";
import ReminderButton from "@/components/ReminderButton";

function Field({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <div className="field-cell" style={{ background: "#F5F2EE", padding: "10px", borderRadius: "6px", animationDelay: `${index * 40}ms` }}>
      <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "10px", color: "#A39E99", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "12px", color: "#1A1714" }}>
        {value || "—"}
      </div>
    </div>
  );
}

function CopyBtn({ text, label, primary }: { text: string; label: string; primary?: boolean }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="action-btn"
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "44px", padding: "0 16px", borderRadius: "6px", fontSize: "13px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, cursor: "pointer", transition: "background 150ms", border: primary ? "none" : "1px solid #D4CEC8", background: primary ? "#1A1714" : "#FFFFFF", color: primary ? "#FFFFFF" : "#1A1714" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = primary ? "#2C2825" : "#F5F2EE")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = primary ? "#1A1714" : "#FFFFFF")}
    >
      <span>{label}</span><span>→</span>
    </button>
  );
}

export default function ReceiptExpenseCard({ data }: { data: ReceiptExpense }) {
  const expenseLine = `${data.date} · ${data.merchant} · ${data.amount} · ${data.category}${data.taxDeductible ? " · Tax deductible" : ""}`;

  const fields = [
    { label: "Merchant", value: data.merchant },
    { label: "Amount", value: data.amount },
    { label: "Date", value: data.date },
    { label: "Category", value: data.category },
    { label: "Tax Deductible", value: data.taxDeductible ? "Yes" : "No" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: data.taxDeductible ? "12px" : "20px" }}>
        {fields.map((f, i) => <Field key={f.label} label={f.label} value={f.value} index={i} />)}
      </div>

      {data.taxDeductible && (
        <div style={{ marginBottom: "20px" }}>
          <span style={{ background: "#EDF5F0", border: "1px solid #C8DDD1", color: "#4A7C59", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "11px", padding: "3px 10px", borderRadius: "4px" }}>
            Tax deductible
          </span>
        </div>
      )}

      {data.notes && (
        <div style={{ background: "#F5F2EE", borderRadius: "6px", padding: "14px", marginBottom: "20px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "13px", color: "#6B6560", lineHeight: "1.7" }}>
          {data.notes}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <CopyBtn text={expenseLine} label="Copy for expense report" primary />
        <ActionDivider label="or set a reminder" />
        <ReminderButton
          title={`Log expense — ${data.merchant}`}
          description={`${data.amount} · ${data.category} · ${data.date}\n${data.notes}`}
        />
      </div>
    </div>
  );
}
