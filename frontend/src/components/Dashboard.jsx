// frontend/src/components/Dashboard.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Urgency badge colors
const urgencyColors = {
  High:   { background: "#fff5f5", color: "#c53030", border: "#fc8181" },
  Medium: { background: "#fffbeb", color: "#b45309", border: "#fcd34d" },
  Low:    { background: "#f0fff4", color: "#276749", border: "#68d391" },
};

// Status options for the dropdown
const STATUS_OPTIONS = ["New", "In Progress", "Resolved"];

export default function Dashboard() {
  const { user, supabase, signOut } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("All");
  const [error, setError]         = useState("");
  const [updating, setUpdating]   = useState(null); // tracks which ticket is being updated

  // ── Fetch tickets from Supabase ──────────────────────
  async function fetchTickets() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false }); // newest first

    if (error) {
      setError("Failed to load tickets: " + error.message);
    } else {
      setTickets(data || []);
    }

    setLoading(false);
  }

  // Fetch tickets when page loads
  useEffect(() => {
    fetchTickets();
  }, []);

  // ── Update ticket status ─────────────────────────────
  async function updateStatus(ticketId, newStatus) {
    setUpdating(ticketId); // show loading on that row

    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("id", ticketId);

    if (error) {
      alert("Failed to update: " + error.message);
    } else {
      // Update local state so UI refreshes instantly
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, status: newStatus } : t
        )
      );
    }

    setUpdating(null);
  }

  // ── Handle logout ────────────────────────────────────
  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  // ── Filter tickets by status ─────────────────────────
  const filtered = filter === "All"
    ? tickets
    : tickets.filter((t) => t.status === filter);

  // ── Render ───────────────────────────────────────────
  return (
    <div style={styles.page}>

      {/* ── Top Nav ── */}
      <div style={styles.nav}>
        <h1 style={styles.navTitle}>⚖️ Legal Triage — Admin</h1>
        <div style={styles.navRight}>
          <span style={styles.userEmail}>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={styles.content}>

        {/* ── Stats Row ── */}
        <div style={styles.statsRow}>
          {["All", "New", "In Progress", "Resolved"].map((s) => (
            <div
              key={s}
              onClick={() => setFilter(s)}
              style={{
                ...styles.statCard,
                borderBottom: filter === s ? "3px solid #3b82f6" : "3px solid transparent",
              }}
            >
              <div style={styles.statNumber}>
                {s === "All"
                  ? tickets.length
                  : tickets.filter((t) => t.status === s).length}
              </div>
              <div style={styles.statLabel}>{s}</div>
            </div>
          ))}
        </div>

        {/* ── Error ── */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* ── Loading ── */}
        {loading ? (
          <div style={styles.emptyState}>Loading tickets...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>No tickets found.</div>
        ) : (

          /* ── Ticket Cards ── */
          <div style={styles.ticketList}>
            {filtered.map((ticket) => (
              <div key={ticket.id} style={styles.card}>

                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.clientName}>{ticket.name}</span>
                    <span style={styles.clientEmail}> — {ticket.email}</span>
                  </div>
                  <span style={styles.date}>
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Description */}
                <p style={styles.description}>{ticket.description}</p>

                {/* Tags Row */}
                <div style={styles.tagsRow}>

                  {/* Category badge */}
                  <span style={styles.categoryBadge}>
                    📁 {ticket.category || "Uncategorized"}
                  </span>

                  {/* Urgency badge */}
                  {ticket.urgency && (
                    <span style={{
                      ...styles.urgencyBadge,
                      ...(urgencyColors[ticket.urgency] || urgencyColors.Low),
                    }}>
                      🔥 {ticket.urgency} Urgency
                    </span>
                  )}

                  {/* Status dropdown */}
                  <select
                    value={ticket.status || "New"}
                    disabled={updating === ticket.id}
                    onChange={(e) => updateStatus(ticket.id, e.target.value)}
                    style={styles.statusSelect}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f7fafc",
    fontFamily: "sans-serif",
  },
  nav: {
    backgroundColor: "#1a202c",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navTitle: {
    color: "#fff",
    margin: 0,
    fontSize: "1.2rem",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userEmail: {
    color: "#a0aec0",
    fontSize: "0.9rem",
  },
  logoutBtn: {
    backgroundColor: "#e53e3e",
    color: "#fff",
    border: "none",
    padding: "0.4rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  content: {
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "0 1rem",
  },
  statsRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "1rem",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  statNumber: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1a202c",
  },
  statLabel: {
    fontSize: "0.85rem",
    color: "#718096",
    marginTop: "0.25rem",
  },
  errorBox: {
    backgroundColor: "#fff5f5",
    border: "1px solid #fc8181",
    color: "#c53030",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
  emptyState: {
    textAlign: "center",
    color: "#a0aec0",
    padding: "3rem",
    fontSize: "1rem",
  },
  ticketList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "1.25rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  clientName: {
    fontWeight: "700",
    color: "#1a202c",
    fontSize: "1rem",
  },
  clientEmail: {
    color: "#718096",
    fontSize: "0.9rem",
  },
  date: {
    color: "#a0aec0",
    fontSize: "0.85rem",
  },
  description: {
    color: "#4a5568",
    fontSize: "0.95rem",
    margin: "0.5rem 0 1rem",
    lineHeight: "1.5",
  },
  tagsRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  categoryBadge: {
    backgroundColor: "#ebf4ff",
    color: "#2b6cb0",
    padding: "0.3rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  urgencyBadge: {
    padding: "0.3rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    border: "1px solid",
  },
  statusSelect: {
    marginLeft: "auto",
    padding: "0.3rem 0.6rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "0.85rem",
    cursor: "pointer",
    backgroundColor: "#fff",
  },
};