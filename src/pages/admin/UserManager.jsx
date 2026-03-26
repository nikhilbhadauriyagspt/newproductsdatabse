import { useState, useEffect } from 'react';
import { Search, Trash2, Loader2, User, Mail, Phone, Calendar, Globe, ShieldAlert, ShieldCheck } from 'lucide-react';
import API_BASE_URL from '../../config';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setUsers(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.status === 'success') {
          fetchUsers(); // Refresh list
        } else {
          alert('Delete failed: ' + data.message);
        }
      } catch (err) {
        alert('Server error');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchUsers(); // Refresh list
      } else {
        alert('Update failed: ' + data.message);
      }
    } catch (err) {
      alert('Server error');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.phone && u.phone.includes(search))
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm font-medium text-slate-500">View origin, contact info and manage account access</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-slate-500 font-bold capitalize tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Contact & Origin</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto h-8 w-8 mb-2 opacity-20" />
                    Loading user directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${u.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{u.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">ID: #{u.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Mail size={14} className="text-slate-400" />
                        {u.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Phone size={14} className="text-slate-400" />
                        {u.phone || 'N/A'}
                      </div>
                      {u.origin_website && (
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-[11px] uppercase tracking-wider">
                          <Globe size={12} />
                          {u.origin_website.replace(/^https?:\/\//, '')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === 'blocked' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-green-100 text-green-600 border border-green-200'}`}>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-600">
                    {new Date(u.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`p-2 rounded-xl transition-all ${u.status === 'blocked' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                        title={u.status === 'blocked' ? 'Unblock User' : 'Block User'}
                      >
                        {u.status === 'blocked' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
