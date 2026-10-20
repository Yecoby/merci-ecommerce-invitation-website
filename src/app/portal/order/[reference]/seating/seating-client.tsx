"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Grid,
  Plus,
  Users,
  Check,
  AlertCircle,
  Loader2,
  Trash2,
  UserCheck,
} from "lucide-react";

interface Props {
  reference: string;
  tables: any[];
  invitation: any;
}

export default function SeatingPlannerClient({ reference, tables: initialTables, invitation }: Props) {
  const [tables, setTables] = useState<any[]>(initialTables);
  const [confirmedGuests, setConfirmedGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableCap, setNewTableCap] = useState(8);
  const [showAddTable, setShowAddTable] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [selectedGuestName, setSelectedGuestName] = useState("");
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const fetchSeating = async () => {
    try {
      const res = await fetch(`/api/portal/orders/${reference}/seating`);
      const data = await res.json();
      if (data.tables) setTables(data.tables);
      if (data.confirmedGuests) setConfirmedGuests(data.confirmedGuests);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSeating();
  }, [reference]);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/portal/orders/${reference}/seating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTableName,
          capacity: Number(newTableCap),
          shape: "round",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create table");

      setNewTableName("");
      setShowAddTable(false);
      setMessage({ text: `Table "${data.table.name}" created!` });
      await fetchSeating();
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to create table", error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableId || !selectedGuestName.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/portal/orders/${reference}/seating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ASSIGN_GUEST",
          tableId: selectedTableId,
          guestName: selectedGuestName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assignment failed");

      setSelectedGuestName("");
      setMessage({ text: "Guest assigned successfully!" });
      await fetchSeating();
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to assign guest", error: true });
    } finally {
      setLoading(false);
    }
  };

  // Find unassigned guests
  const allAssignedNames = new Set(
    tables.flatMap((t) => t.assignments.map((a: any) => a.guestName.toLowerCase()))
  );
  const unassignedGuests = confirmedGuests.filter(
    (g) => !allAssignedNames.has(g.name.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col justify-between">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#8B8278]/20">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/portal/order/${reference}`}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8B8278] hover:text-[#292824] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Portal
            </Link>
            <span className="text-[#8B8278]/40">|</span>
            <span className="text-xs uppercase font-medium text-[#292824] hidden sm:inline font-mono">
              Seating Plan · {reference}
            </span>
          </div>

          <button
            onClick={() => setShowAddTable(!showAddTable)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Table
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-10 w-full space-y-8 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#8B8278]/20 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8B8278]">VIP & Banquet Logistics</span>
            <h1 className="text-3xl font-serif text-[#292824] mt-1">Interactive Seating Planner</h1>
            <p className="text-xs text-[#8B8278] mt-1">
              Arrange tables, designate seat capacities, and assign confirmed guests for {invitation?.title || "your celebration"}.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 text-xs ${
              message.error
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-[#AAB5A0]/20 text-[#2C3527] border border-[#AAB5A0]/40"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add Table Drawer / Form */}
        {showAddTable && (
          <form
            onSubmit={handleCreateTable}
            className="bg-white border border-[#8B8278]/25 p-6 shadow-sm space-y-4"
          >
            <h3 className="text-sm uppercase tracking-wider font-semibold text-[#292824]">
              Add Banquet Table
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1">
                  Table Name or Number
                </label>
                <input
                  type="text"
                  required
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="e.g. Table 1 - Orchids or VIP Presidential Table"
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#8B8278]/30 focus:border-[#292824] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1">
                  Max Capacity
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={newTableCap}
                  onChange={(e) => setNewTableCap(parseInt(e.target.value, 10) || 8)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#8B8278]/30 focus:border-[#292824] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTable(false)}
                className="px-4 py-2 border border-[#8B8278]/30 text-xs uppercase tracking-wider text-[#8B8278] hover:text-[#292824]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35]"
              >
                Save Table
              </button>
            </div>
          </form>
        )}

        {/* Layout: Tables Grid + Unassigned Guests Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tables Grid */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#292824]">
              Banquet Tables ({tables.length})
            </h2>

            {tables.length === 0 ? (
              <div className="bg-white border border-[#8B8278]/25 p-12 text-center text-xs text-[#8B8278]">
                No banquet tables created yet. Click "Add Table" to set up your floor plan.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tables.map((tbl) => {
                  const assignedCount = tbl.assignments?.length || 0;
                  const isFull = assignedCount >= tbl.capacity;

                  return (
                    <div
                      key={tbl.id}
                      className="bg-white border border-[#8B8278]/25 p-5 shadow-sm space-y-4 relative"
                    >
                      <div className="flex items-center justify-between border-b border-[#8B8278]/15 pb-2">
                        <div>
                          <h3 className="font-serif text-base text-[#292824]">{tbl.name}</h3>
                          <span className="text-[10px] text-[#8B8278] uppercase tracking-wider">
                            {assignedCount} / {tbl.capacity} Seats Filled
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                            isFull
                              ? "bg-red-50 text-red-700"
                              : "bg-[#AAB5A0]/20 text-[#2C3527]"
                          }`}
                        >
                          {isFull ? "Full" : `${tbl.capacity - assignedCount} Available`}
                        </span>
                      </div>

                      {/* Guest list for this table */}
                      <div className="space-y-1.5 min-h-[90px]">
                        {tbl.assignments && tbl.assignments.length > 0 ? (
                          tbl.assignments.map((as: any) => (
                            <div
                              key={as.id}
                              className="flex items-center justify-between px-2.5 py-1.5 bg-[#FAF8F3] text-xs text-[#292824] border border-[#8B8278]/15"
                            >
                              <span className="font-medium">{as.guestName}</span>
                              <UserCheck className="w-3.5 h-3.5 text-[#AAB5A0]" />
                            </div>
                          ))
                        ) : (
                          <div className="text-[11px] text-[#8B8278]/60 italic py-6 text-center">
                            Table empty
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Assign & Unassigned Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#8B8278]/25 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#292824]">
                Quick Seat Assignment
              </h3>
              <form onSubmit={handleAssignGuest} className="space-y-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8B8278] mb-1">
                    Select Table
                  </label>
                  <select
                    value={selectedTableId}
                    onChange={(e) => setSelectedTableId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                  >
                    <option value="">— Choose a table —</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.assignments?.length || 0}/{t.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8B8278] mb-1">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedGuestName}
                    onChange={(e) => setSelectedGuestName(e.target.value)}
                    placeholder="Enter confirmed guest name..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedTableId || !selectedGuestName.trim()}
                  className="w-full py-2 bg-[#292824] hover:bg-[#3D3B35] text-white text-xs uppercase tracking-widest font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Assign to Table
                </button>
              </form>
            </div>

            {/* Unassigned Guests List */}
            <div className="bg-white border border-[#8B8278]/25 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#8B8278]/15 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#292824]">
                  Unassigned Guests ({unassignedGuests.length})
                </span>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {unassignedGuests.length === 0 ? (
                  <p className="text-xs text-[#8B8278] py-4 text-center">
                    All confirmed attending guests have been assigned to tables!
                  </p>
                ) : (
                  unassignedGuests.map((g, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedGuestName(g.name)}
                      className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#FAF8F3]/80 border border-[#8B8278]/15 text-xs text-[#292824] flex items-center justify-between cursor-pointer transition-colors"
                      title="Click to populate assignment input"
                    >
                      <span>{g.name}</span>
                      <Plus className="w-3 h-3 text-[#8B8278]" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#8B8278]/15 bg-white/50 text-center text-xs text-[#8B8278]">
        © {new Date().getFullYear()} MERCI Digital Invitations · Dedicated Client Suite
      </footer>
    </div>
  );
}
