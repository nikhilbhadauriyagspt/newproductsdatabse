import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Eye,
  X,
  Search,
  Loader2,
  Trash2,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config';

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [search, setSearch] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`);
      const data = await response.json();
      if (data.status === 'success') setContacts(data.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchContacts();
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900  capitalize">Inquiry Manager</h1>
          <p className="text-sm font-bold text-slate-500 capitalize tracking-widest mt-1">Manage customer messages and support tickets</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="SEARCH MESSAGES..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-6 h-14 w-full md:w-96 bg-white border border-gray-200 rounded-2xl focus:border-blue-600 outline-none text-xs font-bold capitalize transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 capitalize tracking-widest">Sender</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 capitalize tracking-widest">Subject</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 capitalize tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 capitalize tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 capitalize tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <p className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">Loading Messages...</p>
                  </td>
                </tr>
              ) : filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 capitalize">{contact.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 lowercase mt-1">{contact.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-600 capitalize  line-clamp-1">{contact.subject}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold capitalize tracking-widest border ${contact.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      contact.status === 'read' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-slate-400 capitalize">{new Date(contact.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => {
                        setSelectedContact(contact);
                        if (contact.status === 'new') updateStatus(contact.id, 'read');
                      }}
                      className="h-10 w-10 rounded-xl bg-gray-100 text-slate-600 flex items-center justify-center hover:bg-black hover:text-white transition-all ml-auto"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedContact && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[3rem] z-[1001] shadow-2xl p-10 font-urbanist"
            >
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <MessageCircle size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 capitalize ">Inquiry Detail.</h2>
                    <p className="text-[10px] font-bold text-blue-600 capitalize tracking-widest mt-1">Status: {selectedContact.status}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedContact(null)} className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest">From</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{selectedContact.name}</p>
                  <p className="text-xs font-bold text-slate-500 lowercase">{selectedContact.email}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest">Subject</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{selectedContact.subject}</p>
                  <p className="text-xs font-bold text-slate-500 capitalize">{new Date(selectedContact.created_at).toLocaleString()}</p>
                </div>
              </div>

              {selectedContact.origin && (
                <div className="mb-10 flex items-center gap-3 px-6 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                   <Globe size={18} className="text-blue-600" />
                   <div>
                     <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest">Inquiry Source</p>
                     <p className="text-xs font-bold text-blue-600">{selectedContact.origin}</p>
                   </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-[2rem] p-8 mb-10 border border-gray-100">
                <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest mb-4">Message</p>
                <p className="text-slate-700 font-medium leading-relaxed">{selectedContact.message}</p>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  onClick={() => updateStatus(selectedContact.id, 'replied')}
                  className="flex-1 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold capitalize tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-600/20"
                >
                  <CheckCircle size={16} /> Mark as Replied
                </button>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex-1 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold capitalize tracking-widest hover:bg-blue-600 transition-all shadow-xl"
                >
                  <Mail size={16} /> Reply via Email
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
