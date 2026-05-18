"use client";
import { useState, useEffect } from "react";

interface Appointment {
  id: number; date: string; startTime: string; endTime: string; status: string;
  clientName: string; clientPhone: string; serviceName: string; duration: number; price: number;
}
interface ClientRow {
  id: number; name: string; phone: string; totalBookings: number; lastVisit: string;
}
interface AdminData {
  todayBookings: number; weekBookings: number; weekRevenue: number; totalClients: number;
  appointments: Appointment[]; clients: ClientRow[];
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [tab, setTab] = useState<"appointments" | "clients">("appointments");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("global_admin") === "true") {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => { if (loggedIn) fetchData(); }, [loggedIn]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin");
      const json = await res.json();
      setData(json);
    } catch { console.error("Failed to fetch admin data"); }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "GLOBAL2024") {
      localStorage.setItem("global_admin", "true");
      setLoggedIn(true);
      setError("");
    } else {
      setError("Galat password. Dobara koshish karein.");
    }
  };

  const handleCancel = async (id: number) => {
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem("global_admin");
    setLoggedIn(false);
    setData(null);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#0D0B09] flex items-center justify-center px-4" style={{ cursor: "auto" }}>
        <form onSubmit={handleLogin} className="w-full max-w-sm border border-[#B8934A]/30 p-10 bg-[#1A140C]">
          <div className="text-center mb-10">
            <div className="font-display-lg text-[42px] text-[#E8E0D4] tracking-wider" style={{ fontFamily: "var(--font-bebas)" }}>
              GL<span className="text-[#B8934A]">◆</span>BAL
            </div>
            <p className="font-label-caps text-[9px] tracking-[0.3em] text-[#C8BFB0] mt-2" style={{ fontFamily: "var(--font-space)" }}>ADMIN PANEL</p>
          </div>
          <div className="mb-6">
            <label className="block text-[10px] tracking-[0.2em] text-[#B8934A] mb-2 uppercase" style={{ fontFamily: "var(--font-space)" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0D0B09] border border-[#B8934A]/30 p-3 text-[#E8E0D4] outline-none focus:border-[#B8934A] transition-colors"
              style={{ fontFamily: "var(--font-space)", fontSize: "14px" }} />
          </div>
          {error && <p className="text-[#C13B25] text-sm mb-4 italic" style={{ fontFamily: "var(--font-garamond)" }}>{error}</p>}
          <button type="submit" className="w-full bg-[#C13B25] text-[#F5F0E8] py-3 text-[10px] tracking-[0.2em] uppercase hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-space)" }}>Enter</button>
        </form>
      </div>
    );
  }

  const filtered = data?.appointments.filter((a) => !dateFilter || a.date === dateFilter) || [];

  return (
    <div className="min-h-screen bg-[#0D0B09] text-[#E8E0D4] p-6 md:p-10" style={{ cursor: "auto" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-[#B8934A]/15 pb-6">
        <div>
          <span className="text-[28px] tracking-wider" style={{ fontFamily: "var(--font-bebas)" }}>
            GL<span className="text-[#B8934A]">◆</span>BAL
          </span>
          <span className="text-[10px] tracking-[0.2em] text-[#C8BFB0] ml-4 uppercase" style={{ fontFamily: "var(--font-space)" }}>Admin Dashboard</span>
        </div>
        <button onClick={handleLogout} className="border border-[#C13B25]/50 text-[#C13B25] px-6 py-2 text-[10px] tracking-[0.2em] uppercase hover:bg-[#C13B25] hover:text-white transition-colors"
          style={{ fontFamily: "var(--font-space)" }}>Logout</button>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Aaj Ki Bookings", value: data.todayBookings },
            { label: "Is Hafte Ki Bookings", value: data.weekBookings },
            { label: "Is Hafte Ki Kamai", value: `Rs. ${data.weekRevenue}` },
            { label: "Kul Grahak", value: data.totalClients },
          ].map((s) => (
            <div key={s.label} className="border border-[#B8934A]/20 p-6 bg-[#1A140C]">
              <p className="text-[9px] tracking-[0.2em] text-[#B8934A] uppercase mb-2" style={{ fontFamily: "var(--font-space)" }}>{s.label}</p>
              <p className="text-[32px]" style={{ fontFamily: "var(--font-bebas)" }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-[#B8934A]/10 pb-4">
        {(["appointments", "clients"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-[10px] tracking-[0.2em] uppercase pb-1 transition-colors ${tab === t ? "text-[#B8934A] border-b border-[#B8934A]" : "text-[#C8BFB0] hover:text-[#B8934A]"}`}
            style={{ fontFamily: "var(--font-space)" }}>{t === "appointments" ? "Appointments" : "Clients"}</button>
        ))}
      </div>

      {tab === "appointments" && (
        <>
          <div className="mb-4">
            <label className="text-[9px] tracking-[0.2em] text-[#B8934A] mr-3 uppercase" style={{ fontFamily: "var(--font-space)" }}>Filter Date:</label>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
              className="bg-[#0D0B09] border border-[#B8934A]/30 px-3 py-1 text-[#E8E0D4] text-sm outline-none" />
            {dateFilter && <button onClick={() => setDateFilter("")} className="ml-3 text-[#C13B25] text-xs underline">Clear</button>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ fontFamily: "var(--font-space)" }}>
              <thead>
                <tr className="text-[9px] tracking-[0.2em] text-[#B8934A] uppercase border-b border-[#B8934A]/20">
                  {["Date", "Time", "Client", "Phone", "Service", "Dur.", "Price", "Status", ""].map((h) => (
                    <th key={h} className="py-3 px-2 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className={`border-b border-[#B8934A]/5 text-[12px] ${a.status === "CANCELLED" ? "opacity-50 line-through" : ""}`}
                    style={{ borderLeft: a.status === "CONFIRMED" ? "2px solid #2d6a30" : a.status === "CANCELLED" ? "2px solid #C13B25" : "none" }}>
                    <td className="py-3 px-2">{a.date}</td>
                    <td className="py-3 px-2">{a.startTime}–{a.endTime}</td>
                    <td className="py-3 px-2">{a.clientName}</td>
                    <td className="py-3 px-2">{a.clientPhone}</td>
                    <td className="py-3 px-2">{a.serviceName}</td>
                    <td className="py-3 px-2">{a.duration}m</td>
                    <td className="py-3 px-2">Rs. {a.price}</td>
                    <td className="py-3 px-2">{a.status}</td>
                    <td className="py-3 px-2">
                      {a.status === "CONFIRMED" && (
                        <button onClick={() => handleCancel(a.id)} className="text-[#C13B25] text-[10px] tracking-wider hover:underline">CANCEL</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-[#C8BFB0] py-8 text-sm italic" style={{ fontFamily: "var(--font-garamond)" }}>No appointments found.</p>}
          </div>
        </>
      )}

      {tab === "clients" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ fontFamily: "var(--font-space)" }}>
            <thead>
              <tr className="text-[9px] tracking-[0.2em] text-[#B8934A] uppercase border-b border-[#B8934A]/20">
                {["Name", "Phone", "Total Bookings", "Last Visit"].map((h) => (
                  <th key={h} className="py-3 px-2 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.clients.map((c) => (
                <tr key={c.id} className="border-b border-[#B8934A]/5 text-[12px]">
                  <td className="py-3 px-2">{c.name}</td>
                  <td className="py-3 px-2">{c.phone}</td>
                  <td className="py-3 px-2">{c.totalBookings}</td>
                  <td className="py-3 px-2">{c.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!data?.clients || data.clients.length === 0) && <p className="text-center text-[#C8BFB0] py-8 text-sm italic" style={{ fontFamily: "var(--font-garamond)" }}>No clients yet.</p>}
        </div>
      )}
    </div>
  );
}
