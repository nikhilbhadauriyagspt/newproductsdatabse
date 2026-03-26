import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Info, Search, ShieldCheck } from 'lucide-react';
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
    content: '',
    status: 'published',
    brand_id: '',
    category_id: '',
    images: '',
    is_featured: 0,
    is_new: 0,
    is_popular: 0,
    is_trending: 0,
    // New Fields
    model: '',
    model_number: '',
    key_features: '',
    print_speed: '',
    print_resolution: '',
    connectivity: '',
    warranty: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_tag: ''
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    fetch(`${API_BASE_URL}/brands`)
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setBrands(data.data); });

    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => { 
        if (data.status === 'success') {
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

    if (isEdit) {
      fetch(`${API_BASE_URL}/products/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const product = data.data;
            const catId = product.categories && product.categories.length > 0 ? product.categories[0].id : '';
            // Convert images array back to comma string if it's an array
            let imagesStr = product.images;
            try {
                const parsed = JSON.parse(product.images);
                if (Array.isArray(parsed)) imagesStr = parsed.join(', ');
            } catch(e) {}

            setFormData({
                ...formData,
                ...product,
                images: imagesStr,
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
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit Product' : 'Create New Printer Profile'}
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-wide">Enter technical specifications and SEO data</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Info size={18} />
              <h2 className="text-sm font-black uppercase tracking-widest">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Product Display Name</label>
                    <input
                        type="text" required
                        placeholder="e.g. HP LaserJet Pro M404dn"
                        className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Model Name</label>
                    <input
                        type="text"
                        placeholder="LaserJet Pro"
                        className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                        value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Model Number</label>
                    <input
                        type="text"
                        placeholder="M404dn"
                        className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                        value={formData.model_number} onChange={e => setFormData({ ...formData, model_number: e.target.value })}
                    />
                </div>
            </div>
          </div>

          {/* Section 2: Technical Specifications */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <ShieldCheck size={18} />
              <h2 className="text-sm font-black uppercase tracking-widest">Hardware Specifications</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Print Speed</label>
                    <input
                        type="text"
                        placeholder="e.g. 40 ppm"
                        className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                        value={formData.print_speed} onChange={e => setFormData({ ...formData, print_speed: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Resolution</label>
                    <input
                        type="text"
                        placeholder="e.g. 1200 x 1200 dpi"
                        className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                        value={formData.print_resolution} onChange={e => setFormData({ ...formData, print_resolution: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Connectivity</label>
                    <input
                        type="text"
                        placeholder="USB, Ethernet, Wi-Fi"
                        className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                        value={formData.connectivity} onChange={e => setFormData({ ...formData, connectivity: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Warranty Info</label>
                    <input
                        type="text"
                        placeholder="e.g. 1 Year Limited"
                        className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                        value={formData.warranty} onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                    />
                </div>
            </div>
          </div>

          {/* Section 3: Description & Rich Content */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Short Description (Plain Text)</label>
              <textarea
                rows="3"
                placeholder="Brief summary of the product..."
                className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Key Features (Bullet Points)</label>
              <textarea
                rows="4"
                placeholder="• Fast printing&#10;• Wireless support&#10;• Low power consumption"
                className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                value={formData.key_features} onChange={e => setFormData({ ...formData, key_features: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Rich Content (HTML)</label>
              <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 focus-within:border-blue-500 transition-all">
                <ReactQuill 
                    theme="snow"
                    value={formData.content}
                    onChange={val => setFormData({ ...formData, content: val })}
                    className="h-96"
                />
              </div>
              <div className="h-12"></div>
            </div>
          </div>

          {/* Section 4: Search Engine Optimization (SEO) */}
          <div className="bg-slate-900 p-8 rounded-[2rem] space-y-6 text-white">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Search size={18} />
              <h2 className="text-sm font-black uppercase tracking-widest">SEO Configuration</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Meta Title</label>
                    <input
                        type="text"
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition-all text-white"
                        value={formData.meta_title} onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Meta Description</label>
                    <textarea
                        rows="3"
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition-all text-white"
                        value={formData.meta_description} onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Canonical Tag</label>
                        <input
                            type="text"
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition-all text-white"
                            value={formData.canonical_tag} onChange={e => setFormData({ ...formData, canonical_tag: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Meta Keywords</label>
                        <input
                            type="text"
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 font-medium transition-all text-white"
                            value={formData.meta_keywords} onChange={e => setFormData({ ...formData, meta_keywords: e.target.value })}
                        />
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6 sticky top-8">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pricing ($)</label>
              <input
                type="number" required
                className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Sale Price ($)</label>
              <input
                type="number"
                className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                value={formData.sale_price} onChange={e => setFormData({ ...formData, sale_price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Stock Quantity</label>
              <input
                type="number" required
                className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">SKU / Model ID</label>
              <input
                type="text"
                className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                <select
                    required
                    className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all appearance-none"
                    value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.parent_id != 0 ? '-- ' : ''}{c.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Brand</label>
                <select
                    required
                    className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all appearance-none"
                    value={formData.brand_id} onChange={e => setFormData({ ...formData, brand_id: e.target.value })}
                >
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                <select
                    required
                    className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all appearance-none"
                    value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Image List (Filenames)</label>
              <input
                type="text"
                placeholder="img1.png, img2.jpg"
                className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all"
                value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })}
              />
            </div>

            <div className="space-y-3 pt-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Product Tags</label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-gray-200">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={formData.is_featured == 1} onChange={e => setFormData({...formData, is_featured: e.target.checked ? 1 : 0})} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-gray-200">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={formData.is_new == 1} onChange={e => setFormData({...formData, is_new: e.target.checked ? 1 : 0})} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">New</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-gray-200">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={formData.is_popular == 1} onChange={e => setFormData({...formData, is_popular: e.target.checked ? 1 : 0})} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Popular</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-gray-200">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={formData.is_trending == 1} onChange={e => setFormData({...formData, is_trending: e.target.checked ? 1 : 0})} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Trending</span>
                    </label>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs tracking-[2px] shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={20} />}
                    {isEdit ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
