import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Search,
  Trash2,
  ExternalLink,
  X,
  Loader2
} from 'lucide-react';
import {
  api,
  type ContactInquiryItem,
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast, type ToastType } from '../components/Toast';

const STATUS_FILTERS = ['All', 'new', 'reviewed', 'contacted', 'archived'];

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
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await api.getInquiries();
      setInquiries(data);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to load client inquiries', type: 'error' });
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
      setToast({ message: `Inquiry status updated to ${newStatus.toUpperCase()}`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update status', type: 'error' });
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
      setToast({ message: `Inquiry from ${deleteTarget.first_name} deleted`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete inquiry', type: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = activeStatus === 'All' || inq.status?.toLowerCase() === activeStatus.toLowerCase();
    const matchesSearch =
      `${inq.first_name} ${inq.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.service_interest?.toLowerCase().includes(search.toLowerCase()) ||
      inq.message.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'new') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          <span>NEW BRIEF</span>
        </span>
      );
    }
    if (s === 'reviewed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
          <span>REVIEWED</span>
        </span>
      );
    }
    if (s === 'contacted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>CONTACTED</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        <span>ARCHIVED</span>
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Client Project Commissions</h1>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#172e31] text-cyan-300 border border-[#205b63]">
              {inquiries.length} CONSULTATIONS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            ARCHITECTURAL CONSULTATION INBOX // DIRECT DESIGN COMMISSIONS // LEAD METRICS
          </p>
        </div>

        <a
          href="/contactus"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-700/80 transition-all self-start sm:self-auto"
        >
          <span>Public Inquiry Form</span>
          <ExternalLink size={13} className="text-slate-400" />
        </a>
      </div>

      {/* Status Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {STATUS_FILTERS.map((st) => {
            const count = st === 'All' 
              ? inquiries.length 
              : inquiries.filter(i => i.status?.toLowerCase() === st.toLowerCase()).length;
            return (
              <button
                key={st}
                onClick={() => setActiveStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeStatus === st
                    ? 'bg-[#172e31] text-cyan-300 border border-[#205b63] shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <span>{st}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 text-slate-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients or briefs..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0e1719] border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:border-[#205b63] focus:outline-none"
          />
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-500 gap-3">
          <Loader2 size={32} className="animate-spin text-cyan-400" />
          <p className="text-xs font-mono uppercase tracking-widest">Compiling Commission Telemetry...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="py-20 rounded-3xl border border-dashed border-slate-800 text-center bg-[#0e1719]/40">
          <Mail size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-bold text-slate-300">No Inquiries Found</p>
          <p className="text-xs text-slate-500 font-mono mt-1">Inquiries submitted via the public contact form will appear here.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0c1315] border border-slate-800/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#080d0e] border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Discipline Requested</th>
                  <th className="px-6 py-4">Brief Excerpt</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Received</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    {/* Client Name & Contact */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white text-xs">
                          {inq.first_name} {inq.last_name}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">{inq.email}</p>
                        {inq.phone && (
                          <p className="text-[10px] font-mono text-slate-600 mt-0.5">{inq.phone}</p>
                        )}
                      </div>
                    </td>

                    {/* Discipline */}
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#172e31] text-cyan-300 border border-[#205b63]/60">
                        {inq.service_interest || 'General Architecture'}
                      </span>
                    </td>

                    {/* Brief Excerpt */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {inq.message}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(inq.status)}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                      {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'Recent'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#172e31] text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => setDeleteTarget(inq)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- INQUIRY DETAIL DRAWER -------------------- */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInquiry(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-[#0c1315] border-l border-[#172e31] h-full shadow-2xl p-6 sm:p-8 flex flex-col z-10 text-white overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#172e31] flex items-center justify-center text-cyan-300">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white uppercase tracking-tight">
                      Commission Dossier
                    </h2>
                    <p className="text-[11px] font-mono text-slate-400">REF: COMM-{String(selectedInquiry.id).padStart(4, '0')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Selector Bar */}
              <div className="mt-6 p-4 rounded-2xl bg-[#080d0e] border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">CURRENT STATUS</span>
                  <div className="mt-1">{getStatusBadge(selectedInquiry.status)}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {['new', 'reviewed', 'contacted', 'archived'].map((st) => (
                    <button
                      key={st}
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus(selectedInquiry.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                        selectedInquiry.status?.toLowerCase() === st
                          ? 'bg-[#172e31] text-cyan-300 border border-[#205b63]'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Dossier Details */}
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-[#080d0e] border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#172e31] flex items-center justify-center text-white font-bold text-sm uppercase">
                      {selectedInquiry.first_name?.[0] || 'C'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {selectedInquiry.first_name} {selectedInquiry.last_name}
                      </h3>
                      <p className="text-xs font-mono text-cyan-300">{selectedInquiry.service_interest}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">DIRECT EMAIL</span>
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-xs font-mono text-slate-200 hover:text-cyan-300 break-all transition-colors"
                      >
                        {selectedInquiry.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">TELEPHONE</span>
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="text-xs font-mono text-slate-200 hover:text-cyan-300 transition-colors"
                      >
                        {selectedInquiry.phone || 'Not Specified'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Brief Message */}
                <div className="p-5 rounded-2xl bg-[#080d0e] border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
                    ARCHITECTURAL DESIGN BRIEF & SCOPE
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setDeleteTarget(selectedInquiry)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  Delete Inquiry
                </button>

                <a
                  href={`mailto:${selectedInquiry.email}?subject=ROHA%20Architectural%20Consultation%20Brief`}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#172e31] to-[#205b63] hover:from-[#1b373b] hover:to-[#266e77] text-white text-xs font-bold uppercase tracking-wider border border-[#2d7882] shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Mail size={14} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Client Commission Inquiry?"
        message={`Are you sure you want to permanently delete the inquiry submitted by ${deleteTarget?.first_name} ${deleteTarget?.last_name}?`}
        confirmLabel="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
