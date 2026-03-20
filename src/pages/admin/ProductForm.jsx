import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import API_BASE_URL from '../../config';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sale_price: '',
    quantity: '',
    sku: '',
    description: '',
    status: 'published',
    brand_id: '',
    category_id: '',
    images: '',
    is_featured: 0,
    is_new: 0,
    is_popular: 0,
    is_trending: 0
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    // Fetch Brands
    fetch(`${API_BASE_URL}/brands`)
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setBrands(data.data); });

    // Fetch Categories
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => { 
        if (data.status === 'success') {
          // Flatten tree if necessary, or just use roots for now
          // If you want all categories in a flat list for selection:
          const flat = [];
          const flatten = (items) => {
            items.forEach(item => {
              flat.push(item);
              if (item.children && item.children.length > 0) flatten(item.children);
            });
          };
          flatten(data.data);
          setCategories(flat);
        }
      });

    // If Edit, Fetch Product Data
    if (isEdit) {
      fetch(`${API_BASE_URL}/products/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const product = data.data;
            // Map category_id if exists in the fetched product categories
            const catId = product.categories && product.categories.length > 0 ? product.categories[0].id : '';
            setFormData({
                ...product,
                category_id: product.category_id || catId || ''
            });
          }
          setFetching(false);
        });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isEdit ? `${API_BASE_URL}/products/${id}` : `${API_BASE_URL}/products`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.status === 'success') {
        alert(isEdit ? 'Product updated!' : 'Product added!');
        navigate('/admin/products');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 ">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 capitalize tracking-widest mb-2">Product Title</label>
              <input
                type="text" required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 capitalize tracking-widest mb-2">Category</label>
                    <select
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all appearance-none"
                        value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.parent_id != 0 ? '-- ' : ''}{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 capitalize tracking-widest mb-2">Image Filenames (comma separated)</label>
                    <input
                        type="text"
                        placeholder="products/image1.png, products/image2.png"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                        value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <input 
                        type="checkbox" 
                        id="is_featured"
                        className="w-5 h-5 rounded-lg border-blue-300 text-blue-600 focus:ring-blue-500"
                        checked={formData.is_featured == 1}
                        onChange={e => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                    />
                    <label htmlFor="is_featured" className="text-sm font-bold text-blue-900 cursor-pointer">Featured Product</label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                    <input 
                        type="checkbox" 
                        id="is_new"
                        className="w-5 h-5 rounded-lg border-green-300 text-green-600 focus:ring-green-500"
                        checked={formData.is_new == 1}
                        onChange={e => setFormData({ ...formData, is_new: e.target.checked ? 1 : 0 })}
                    />
                    <label htmlFor="is_new" className="text-sm font-bold text-green-900 cursor-pointer">New Arrival</label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <input 
                        type="checkbox" 
                        id="is_popular"
                        className="w-5 h-5 rounded-lg border-orange-300 text-orange-600 focus:ring-orange-600"
                        checked={formData.is_popular == 1}
                        onChange={e => setFormData({ ...formData, is_popular: e.target.checked ? 1 : 0 })}
                    />
                    <label htmlFor="is_popular" className="text-sm font-bold text-orange-900 cursor-pointer">Popular Product</label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <input 
                        type="checkbox" 
                        id="is_trending"
                        className="w-5 h-5 rounded-lg border-purple-300 text-purple-600 focus:ring-purple-500"
                        checked={formData.is_trending == 1}
                        onChange={e => setFormData({ ...formData, is_trending: e.target.checked ? 1 : 0 })}
                    />
                    <label htmlFor="is_trending" className="text-sm font-bold text-purple-900 cursor-pointer">Trending Now</label>
                </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 capitalize tracking-widest mb-2">Description</label>
              <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 focus-within:border-blue-500 transition-all">
                <ReactQuill 
                    theme="snow"
                    value={formData.description}
                    onChange={val => setFormData({ ...formData, description: val })}
                    className="h-64"
                />
              </div>
              <div className="h-12"></div> {/* Spacer for quill toolbar overlap if any */}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 capitalize tracking-widest mb-2">Regular Price ($)</label>
              <input
                type="number" required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 capitalize tracking-widest mb-2">Inventory (Stock)</label>
              <input
                type="number" required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 capitalize tracking-widest mb-2">Brand</label>
              <select
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all appearance-none"
                value={formData.brand_id} onChange={e => setFormData({ ...formData, brand_id: e.target.value })}
              >
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 capitalize tracking-widest mb-2">Status</label>
              <select
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all appearance-none"
                value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs tracking-widest shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={18} />}
            {isEdit ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
          </button>
        </div>
      </form>
    </div>
  );
}
