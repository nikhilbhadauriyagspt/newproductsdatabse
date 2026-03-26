import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  CreditCard,
  User,
  MapPin,
  Phone,
  Mail,
  X,
  ChevronRight,
  Loader2,
  Globe,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config';

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/all`);
      const data = await response.json();
      if (data.status === 'success') setOrders(data.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchOrders();
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredOrders = orders.filter(o =>
    o.id.toString().includes(search) ||
    o.first_name.toLowerCase().includes(search.toLowerCase()) ||
    o.guest_email.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    processing: 'bg-blue-50 text-blue-600 border-blue-100',
    shipped: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    out_for_delivery: 'bg-purple-50 text-purple-600 border-purple-100',
    delivered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900  capitalize">Order Management</h1>
          <p className="text-sm font-bold text-slate-500 capitalize tracking-widest mt-1">Manage and track customer purchases</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="SEARCH BY ORDER ID, NAME, EMAIL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-6 h-14 w-full md:w-96 bg-white border border-gray-200 rounded-2xl focus:border-blue-600 outline-none text-xs font-bold capitalize transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 capitalize tracking-widest">Order Info</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 capitalize tracking-widest">Customer</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 capitalize tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 capitalize tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 capitalize tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <p className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">Loading Orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">#PFX-{order.id}</span>
                      <span className="text-[10px] font-bold text-slate-400 capitalize mt-1">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 capitalize">{order.first_name} {order.last_name}</span>
                      <span className="text-[10px] font-bold text-slate-400 capitalize mt-1">{order.guest_email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-blue-600">${order.total_amount}</span>
                      <span className="text-[10px] font-bold text-slate-400 capitalize mt-1">{order.payment_method}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold capitalize tracking-widest border ${statusColors[order.status]}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="h-10 w-10 rounded-xl bg-gray-100 text-slate-600 flex items-center justify-center hover:bg-black hover:text-white transition-all"
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

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-[1001] shadow-2xl flex flex-col font-urbanist"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900  capitalize">Order Details.</h2>
                  <p className="text-[10px] font-bold text-blue-600 capitalize tracking-widest mt-1">#PFX-{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Status Update */}
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                  <h3 className="text-[10px] font-bold capitalize tracking-[0.4em] text-blue-400 mb-6">Update Status</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.keys(statusColors).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selectedOrder.id, s)}
                        className={`px-4 py-3 rounded-xl text-[9px] font-bold capitalize tracking-widest border transition-all ${selectedOrder.status === s
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        {s.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer & Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 capitalize tracking-[0.2em]">
                      <User size={12} /> Customer Information
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 h-full">
                      <p className="text-sm font-bold text-slate-900 capitalize">{selectedOrder.first_name} {selectedOrder.last_name}</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-2 lowercase"><Mail size={12} /> {selectedOrder.guest_email}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1 capitalize"><Phone size={12} /> {selectedOrder.phone}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 capitalize tracking-[0.2em]">
                      <MapPin size={12} /> Shipping Address
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 h-full">
                      <p className="text-xs font-bold text-slate-700 leading-relaxed capitalize">
                        {selectedOrder.address}<br />
                        {selectedOrder.city}, {selectedOrder.zip_code}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Extra Info */}
                {(selectedOrder.notes || selectedOrder.origin) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 capitalize tracking-[0.2em]">
                        <FileText size={12} /> Order Notes
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 h-full">
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">
                          {selectedOrder.notes || "No notes provided."}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 capitalize tracking-[0.2em]">
                        <Globe size={12} /> Source (Origin)
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 h-full">
                        <p className="text-xs font-bold text-blue-600 truncate">
                          {selectedOrder.origin || "Unknown Origin"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 capitalize tracking-[0.2em]">
                    <Package size={12} /> Items Ordered
                  </div>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-bold">
                            {item.quantity}x
                          </div>
                          <p className="text-xs font-bold text-slate-900 capitalize truncate max-w-[250px]">{item.product_name}</p>
                        </div>
                        <p className="text-xs font-bold text-blue-600">${item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 capitalize tracking-[0.2em]">
                        <CreditCard size={12} /> Payment Details
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <div className="flex justify-between mb-2">
                          <span className="text-[10px] font-bold text-slate-400 capitalize">Method</span>
                          <span className="text-[10px] font-bold text-slate-900 capitalize">{selectedOrder.payment_method}</span>
                        </div>
                        {selectedOrder.payment_details && (
                          <div className="space-y-2 mt-4 pt-4 border-t border-slate-200">
                            {(() => {
                              try {
                                const details = typeof selectedOrder.payment_details === 'string'
                                  ? JSON.parse(selectedOrder.payment_details)
                                  : selectedOrder.payment_details;

                                if (!details) return <p className="text-[9px] text-slate-400 capitalize italic">No transaction data</p>;

                                return (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-[9px] font-bold text-slate-400 capitalize">Transaction ID</span>
                                      <span className="text-[9px] font-mono font-bold text-blue-600">{details.id || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-[9px] font-bold text-slate-400 capitalize">Payer Email</span>
                                      <span className="text-[9px] font-bold text-slate-900">{details.payer?.email_address || details.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-[9px] font-bold text-slate-400 capitalize">Status</span>
                                      <span className="text-[9px] font-bold text-emerald-600 capitalize">{details.status || 'COMPLETED'}</span>
                                    </div>
                                  </>
                                );
                              } catch (e) {
                                return <p className="text-[9px] text-slate-400 capitalize italic">Invalid data format</p>;
                              }
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-end text-right">
                      <span className="text-sm font-bold text-slate-400 capitalize">Total Amount</span>
                      <span className="text-4xl font-bold text-slate-900">${selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
