import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  Mail,
  Phone,
  ChevronRight,
  Send
} from 'lucide-react';
import {
  api,
  type ContactInquiryItem,
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { ToastContainer, type ToastMessage } from '../components/Toast';

const STATUS_FILTERS = ['All', 'new', 'in review', 'contacted', 'quoted', 'archived'];

export const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState<string>('All');

  // Selected Inquiry Drawer/Modal
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryItem | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Confirm Delete
  const [deleteTarget, setDeleteTarget] = useState<ContactInquiryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await api.getInquiries();
      setInquiries(data);
    } catch (err: any) {
      addToast('error', 'Failed to load inquiries', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await api.updateInquiry(id, { status: newStatus });
      setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status: newStatus } : inq)));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => (prev ? { ...prev, status: newStatus } : null));
      }
      addToast('success', 'Status Updated', `Inquiry status changed to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      addToast('error', 'Failed to update status', err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deleteInquiry(deleteTarget.id);
      setInquiries(prev => prev.filter(i => i.id !== deleteTarget.id));
      if (selectedInquiry?.id === deleteTarget.id) {
        setSelectedInquiry(null);
      }
      addToast('success', 'Inquiry Deleted', `Inquiry from ${deleteTarget.first_name} was removed.`);
      setDeleteTarget(null);
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      const matchesStatus =
        activeStatus === 'All' ||
        inq.status?.toLowerCase() === activeStatus.toLowerCase();

      const matchesSearch =
        `${inq.first_name} ${inq.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        inq.email?.toLowerCase().includes(search.toLowerCase()) ||
        inq.service_interest?.toLowerCase().includes(search.toLowerCase()) ||
        inq.message?.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [inquiries, search, activeStatus]);

  const getStatusPillClass = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'new') return 'status-pill review';
    if (s === 'in review') return 'status-pill review';
    if (s === 'contacted' || s === 'quoted') return 'status-pill published';
    return 'status-pill draft';
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(t => t.filter(x => x.id !== id))} />

      {/* -------------------- EDITORIAL HEADER -------------------- */}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end border-b border-white/10 pb-7">
        <div>
          <p className="eyebrow mb-2 text-cyan-400">
            Studio operations / {inquiries.length < 10 ? `0${inquiries.length}` : inquiries.length} client inquiries
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.035em] text-white">
            Client Inquiries
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl">
            Turn thoughtful first conversations into considered built architectural commissions and scale models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/contactus"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button"
          >
            <span>Public Contact Form</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* -------------------- SEARCH & FILTER TOOLBAR -------------------- */}
      <section className="panel p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name, email, or service..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveStatus(f)}
                className={`filter-chip text-xs capitalize ${
                  activeStatus === f ? 'filter-chip-active' : ''
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- INQUIRIES LIST -------------------- */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
          <Loader2 size={24} className="animate-spin text-cyan-400" />
          <span className="font-mono uppercase tracking-wider">Loading client consultations...</span>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="panel p-16 text-center text-sm text-slate-400">
          No client consultation requests found matching your filter criteria.
        </div>
      ) : (
        <div className="panel overflow-hidden divide-y divide-white/10">
          {filteredInquiries.map((inq) => {
            const initials = `${inq.first_name?.[0] || ''}${inq.last_name?.[0] || ''}`.toUpperCase() || 'CL';
            const dateStr = inq.created_at
              ? new Date(inq.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recently';

            return (
              <div
                key={inq.id}
                onClick={() => setSelectedInquiry(inq)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-cyan-950/80 text-cyan-300 font-semibold text-xs flex items-center justify-center shrink-0 border border-cyan-500/30">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-display text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {inq.first_name} {inq.last_name}
                      </h3>
                      <span className={getStatusPillClass(inq.status)}>
                        {inq.status || 'New'}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                        {inq.service_interest || 'General'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-1 max-w-2xl">
                      {inq.message || 'No consultation details provided.'}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Mail size={12} className="text-cyan-400" />
                        <span>{inq.email}</span>
                      </span>
                      {inq.phone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone size={12} className="text-cyan-400" />
                          <span>{inq.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-mono text-slate-400">
                    {dateStr}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(inq);
                    }}
                    className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                    title="Delete inquiry"
                  >
                    <Trash2 size={15} />
                  </button>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-cyan-300 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* -------------------- INQUIRY DETAILS DRAWER -------------------- */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setSelectedInquiry(null)}
          />

          <div className="relative w-full max-w-2xl bg-[#132527] border border-white/15 rounded-2xl shadow-2xl flex flex-col z-10 text-white overflow-hidden max-h-[90vh] backdrop-blur-xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0f1c1d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-950/80 text-cyan-300 font-semibold text-sm flex items-center justify-center border border-cyan-500/30">
                  {`${selectedInquiry.first_name?.[0] || ''}${selectedInquiry.last_name?.[0] || ''}`.toUpperCase()}
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">
                    {selectedInquiry.first_name} {selectedInquiry.last_name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Received on {new Date(selectedInquiry.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="icon-button"
              >
                <X size={17} />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status Manager */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Current Consultation Status
                  </p>
                  <p className="text-xs text-slate-400">Track client pipeline state</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedInquiry.status || 'new'}
                    disabled={updatingStatus}
                    onChange={(e) => handleUpdateStatus(selectedInquiry.id, e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-semibold uppercase tracking-wider text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="new" className="bg-[#132527] text-white">New Inquiry</option>
                    <option value="in review" className="bg-[#132527] text-white">In Review</option>
                    <option value="contacted" className="bg-[#132527] text-white">Contacted</option>
                    <option value="quoted" className="bg-[#132527] text-white">Quoted / Fee Proposal</option>
                    <option value="archived" className="bg-[#132527] text-white">Archived</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <p className="text-[10px] font-mono uppercase text-cyan-400">Email Address</p>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-xs font-semibold text-white hover:text-cyan-300 mt-1 block truncate"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <p className="text-[10px] font-mono uppercase text-cyan-400">Phone Number</p>
                  <p className="text-xs font-semibold text-white mt-1">
                    {selectedInquiry.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Service Requested */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <p className="text-[10px] font-mono uppercase text-cyan-400">Architectural Service Interest</p>
                <p className="text-sm font-semibold text-white mt-1">
                  {selectedInquiry.service_interest || 'General Architectural Consultation'}
                </p>
              </div>

              {/* Client Message */}
              <div className="p-5 rounded-xl bg-black/40 border border-white/10">
                <p className="text-[10px] font-mono uppercase text-cyan-400 mb-2">Message & Project Scope</p>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-serif">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="p-5 border-t border-white/10 bg-[#0f1c1d] flex items-center justify-between">
              <button
                onClick={() => setDeleteTarget(selectedInquiry)}
                className="secondary-button text-xs text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="secondary-button text-xs"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=RE: ROHA Architectural Studio Consultation`}
                  className="primary-button text-xs shadow-md"
                >
                  <Send size={13} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Client Inquiry"
        message={`Are you sure you want to delete the consultation request from "${deleteTarget?.first_name} ${deleteTarget?.last_name}"?`}
        confirmLabel="Delete Inquiry"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
