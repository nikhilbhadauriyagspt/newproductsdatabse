import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  FolderTree,
  MessageCircle,
  Mail,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import API_BASE_URL from '../config';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const { showToast } = useCart();

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const prevUnreadCount = useRef(0);

  const fetchNotifications = async (isInitial = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      const data = await response.json();
      if (data.status === 'success') {
        setNotifications(data.data);
        setUnreadCount(data.unread_count);

        // Show toast if new notification arrived
        if (!isInitial && data.unread_count > prevUnreadCount.current) {
          const latest = data.data[0];
          showToast(`NEW: ${latest.message}`, 'info');
        }
        prevUnreadCount.current = data.unread_count;
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('admin_user'));
    if (!user || user.role !== 'admin') {
      navigate('/admin-login');
    } else {
      setAdmin(user);
      fetchNotifications(true);
      
      // Poll every 30 seconds
      const interval = setInterval(() => fetchNotifications(), 30000);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: 'PUT' });
      fetchNotifications();
    } catch (err) { }
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/notifications/mark-all-read`, { method: 'PUT' });
      fetchNotifications();
    } catch (err) { }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    navigate('/admin-login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Orders', path: '/admin/orders', icon: Package },
    { name: 'Inquiries', path: '/admin/contacts', icon: MessageCircle },
    { name: 'Subscribers', path: '/admin/newsletter', icon: Mail },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-urbanist">

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <span className="text-xl font-bold ">Dash Printer shop<span className="text-blue-500">.</span> ADMIN</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === item.path
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-xl text-sm font-bold transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm relative z-40">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900">
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-6 ml-auto">
            {/* NOTIFICATIONS DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl transition-all ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-gray-100'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest"
                        >
                          <CheckCircle size={12} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <div className="h-12 w-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell size={20} />
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`p-4 hover:bg-gray-50/80 transition-colors flex gap-4 ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                              onClick={() => !n.is_read && markAsRead(n.id)}
                            >
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                n.type === 'order' ? 'bg-emerald-50 text-emerald-600' :
                                n.type === 'user' ? 'bg-blue-50 text-blue-600' :
                                n.type === 'product' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-600'
                              }`}>
                                {n.type === 'order' ? <Package size={18} /> :
                                 n.type === 'user' ? <Users size={18} /> :
                                 n.type === 'product' ? <Package size={18} /> : <Bell size={18} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs leading-relaxed ${!n.is_read ? 'font-bold text-slate-900' : 'text-slate-600 font-medium'}`}>
                                  {n.message}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                    <Clock size={10} />
                                    <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  {n.link && (
                                    <Link 
                                      to={n.link} 
                                      onClick={() => {
                                        setShowNotifications(false);
                                        markAsRead(n.id);
                                      }}
                                      className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                                    >
                                      VIEW <ExternalLink size={10} />
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing latest 20 notifications</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900">{admin?.name}</p>
                <p className="text-xs font-medium text-slate-500">Administrator</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold shadow-sm">
                {admin?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
