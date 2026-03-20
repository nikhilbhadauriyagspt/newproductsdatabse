import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Loader2, FileSpreadsheet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/products?limit=100`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setProducts(data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.status === 'success') {
          fetchProducts(); // Refresh list
        } else {
          alert('Delete failed: ' + data.message);
        }
      } catch (err) {
        alert('Server error');
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 ">Products</h1>
          <p className="text-sm font-medium text-slate-500">Manage your store inventory ({products.length} items)</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/products/bulk" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
            <FileSpreadsheet size={18} /> Bulk Upload
          </Link>
          <Link to="/admin/products/add" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20">
            <Plus size={18} /> Add New Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
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
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  <Loader2 className="animate-spin mx-auto h-8 w-8 mb-2 opacity-20" />
                  Loading inventory...
                </td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No products found.</td></tr>
              ) : filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">{p.brand_name || 'Generic'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-600">${p.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold capitalize tracking-widest ${p.quantity > 5 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {p.quantity} Units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold capitalize tracking-widest ${p.status === 'published' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/edit/${p.id}`} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
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
