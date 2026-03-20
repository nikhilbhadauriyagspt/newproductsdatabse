import { useState, useEffect } from 'react';
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { useCart } from '../context/CartContext';
import {
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Heart,
  Loader2,
  ChevronRight,
  Plus,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  ChevronsRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

export default function Shop() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { category: pathCategory, brand: pathBrand } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid');

  const category = searchParams.get('category') || pathCategory || '';
  const brand = searchParams.get('brand') || pathBrand || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((d) => {
        if (d.status === 'success') {
          const printers = d.data.find((c) => c.slug === 'printers' || c.id === 46);
          setCategories(printers ? printers.children : []);
        }
      });

    fetch(`${API_BASE_URL}/brands`)
      .then((res) => res.json())
      .then((d) => setBrands(d.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set('limit', '1000');

    fetch(`${API_BASE_URL}/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          const filteredProducts = data.data.filter(
            (p) =>
              !p.name.toLowerCase().includes('laptop') &&
              !p.name.toLowerCase().includes('macbook')
          );
          setProducts(filteredProducts);
          setTotal(filteredProducts.length);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
    setActiveDropdown(null);
  };

  const getImagePath = (images) => {
    try {
      const imgs = typeof images === 'string' ? JSON.parse(images) : images;
      if (Array.isArray(imgs) && imgs.length > 0) {
        return `/${imgs[0].replace(/\\/g, '/')}`;
      }
      return '/logo/fabicon.png';
    } catch {
      return '/logo/fabicon.png';
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-['Rubik'] text-[#222]">
      <SEO title="Shop | Dash Printer shop" />

      {/* PAGE HEADER */}
      <div className="bg-[#f5f5f5] border-b border-[#dddddd]">
        <div className="w-full px-4 md:px-6 xl:px-10 py-8 md:py-10">
          <div className="flex flex-col gap-5">
            <nav className="flex items-center gap-2 text-[12px] font-semibold text-[#7a7a7a]">
              <Link to="/" className="hover:text-[#ff3b30] transition-colors">
                Home
              </Link>
              <ChevronRight size={14} className="text-[#bdbdbd]" />
              <span className="text-[#ff3b30]">Shop</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#dddddd] pb-4">
              <div className="flex items-center gap-3">
                <ChevronsRight
                  size={26}
                  className="text-[#ff3b30] shrink-0"
                  strokeWidth={3}
                />
                <h1 className="text-[26px] md:text-[30px] font-extrabold uppercase tracking-tight text-[#1f2937]">
                  Shop Catalog
                </h1>
              </div>

              <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#666]">
                <SlidersHorizontal size={16} className="text-[#ff3b30]" />
                <span>{total} Products Found</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-[100] bg-white border-b border-[#e5e5e5]">
        <div className="w-full px-4 md:px-6 xl:px-10 py-4">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'cat' ? null : 'cat')}
                  className={`h-[42px] px-5 border text-[13px] font-semibold capitalize flex items-center gap-3 transition-all rounded-sm ${category
                    ? 'border-[#ff3b30] bg-[#fff5f5] text-[#ff3b30]'
                    : 'border-[#dcdcdc] bg-white text-[#444] hover:border-[#cfcfcf]'
                    }`}
                >
                  {category ? category.replace('-', ' ') : 'Categories'}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${activeDropdown === 'cat' ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'cat' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 mt-3 w-[280px] bg-white border border-[#e5e5e5] p-2 z-[110] rounded-sm shadow-xl"
                    >
                      <button
                        onClick={() => updateFilter('category', '')}
                        className="w-full text-left px-4 py-3 text-[12px] font-semibold hover:bg-[#fafafa] text-[#777] border-b border-[#f1f1f1] mb-1"
                      >
                        Clear Selection
                      </button>
                      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {categories.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => updateFilter('category', c.slug)}
                            className={`w-full text-left px-4 py-3 text-[13px] font-medium hover:bg-[#fafafa] hover:text-[#ff3b30] transition-colors rounded-sm ${category === c.slug
                              ? 'bg-[#fff5f5] text-[#ff3b30]'
                              : 'text-[#555]'
                              }`}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Brand Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'brand' ? null : 'brand')}
                  className={`h-[42px] px-5 border text-[13px] font-semibold capitalize flex items-center gap-3 transition-all rounded-sm ${brand
                    ? 'border-[#ff3b30] bg-[#fff5f5] text-[#ff3b30]'
                    : 'border-[#dcdcdc] bg-white text-[#444] hover:border-[#cfcfcf]'
                    }`}
                >
                  {brand || 'Manufacturers'}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${activeDropdown === 'brand' ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'brand' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 mt-3 w-[240px] bg-white border border-[#e5e5e5] p-2 z-[110] rounded-sm shadow-xl"
                    >
                      <button
                        onClick={() => updateFilter('brand', '')}
                        className="w-full text-left px-4 py-3 text-[12px] font-semibold hover:bg-[#fafafa] text-[#777] border-b border-[#f1f1f1] mb-1"
                      >
                        All Products
                      </button>
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {brands.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => updateFilter('brand', b.name)}
                            className={`w-full text-left px-4 py-3 text-[13px] font-medium hover:bg-[#fafafa] hover:text-[#ff3b30] transition-colors rounded-sm ${brand === b.name
                              ? 'bg-[#fff5f5] text-[#ff3b30]'
                              : 'text-[#555]'
                              }`}
                          >
                            {b.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-[320px] lg:w-[360px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
                  size={16}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-[42px] pl-11 pr-4 bg-white border border-[#dcdcdc] rounded-sm text-[13px] font-medium outline-none focus:border-[#ff3b30] transition-all placeholder:text-[#999]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-[40px] h-[40px] rounded-sm border flex items-center justify-center transition-all ${viewMode === 'grid'
                    ? 'bg-[#111] text-white border-[#111]'
                    : 'bg-white text-[#777] border-[#dcdcdc] hover:border-[#ff3b30] hover:text-[#ff3b30]'
                    }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-[40px] h-[40px] rounded-sm border flex items-center justify-center transition-all ${viewMode === 'list'
                    ? 'bg-[#111] text-white border-[#111]'
                    : 'bg-white text-[#777] border-[#dcdcdc] hover:border-[#ff3b30] hover:text-[#ff3b30]'
                    }`}
                >
                  <List size={18} />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="appearance-none h-[42px] bg-white border border-[#dcdcdc] rounded-sm pl-4 pr-10 text-[13px] font-medium outline-none cursor-pointer hover:border-[#cfcfcf] focus:border-[#ff3b30]"
                >
                  <option value="newest">Sort: Latest</option>
                  <option value="price_low">Price: Low-High</option>
                  <option value="price_high">Price: High-Low</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#999]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="w-full px-4 md:px-6 xl:px-10 py-8 md:py-10">
        {loading ? (
          <div className="py-28 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#ff3b30] mb-4" />
            <p className="text-[13px] font-semibold text-[#999]">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center border border-[#e5e5e5] bg-white rounded-sm">
            <Search size={42} className="mx-auto text-[#d0d0d0] mb-6" />
            <h3 className="text-[26px] font-bold text-[#222] mb-3">No products found</h3>
            <p className="text-[#777] mb-8">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => navigate('/shop')}
              className="h-[44px] px-8 bg-[#111] text-white text-[13px] font-semibold uppercase rounded-sm hover:bg-[#ff3b30] transition-all"
            >
              Reset Catalog
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-5 md:gap-6 ${viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
              : 'grid-cols-1'
              }`}
          >
            {products.map((p) => (
              <div
                key={p.id}
                className={`group ${viewMode === 'list'
                  ? 'flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center p-6 bg-white border border-[#e5e5e5] rounded-sm'
                  : ''
                  }`}
              >
                <div className={`${viewMode === 'grid' ? 'w-full flex flex-col h-full' : 'w-full lg:w-[260px] shrink-0'}`}>
                  <div className="relative mb-4 rounded-sm bg-[#f1f1f1] border border-[#dddddd] overflow-hidden flex items-center justify-center aspect-square p-5 transition-all group-hover:bg-white">
                    <Link to={`/product/${p.slug}`} className="w-full h-full flex items-center justify-center">
                      <img
                        src={getImagePath(p.images)}
                        alt={p.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/logo/fabicon.png';
                        }}
                      />
                    </Link>

                    <button
                      onClick={() => toggleWishlist(p)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center transition-all ${isInWishlist(p.id)
                        ? 'text-[#ff3b30]'
                        : 'text-[#888] opacity-0 group-hover:opacity-100 hover:text-[#ff3b30]'
                        }`}
                    >
                      <Heart size={16} className={isInWishlist(p.id) ? 'fill-[#ff3b30]' : ''} />
                    </button>
                  </div>

                  {viewMode === 'grid' && (
                    <div className="flex flex-col flex-1">
                      <span className="text-[11px] uppercase tracking-wide text-[#8c8c8c] font-medium mb-1">
                        {p.brand_name || 'Premium'}
                      </span>

                      <Link to={`/product/${p.slug}`}>
                        <h3 className="text-[15px] md:text-[16px] text-[#2b2b2b] font-medium leading-snug min-h-[44px] hover:text-[#ff3b30] transition-colors">
                          {p.name}
                        </h3>
                      </Link>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-[16px] font-bold text-[#ff3b30]">
                          ${Number(p.price).toFixed(2)}
                        </span>

                        <button
                          onClick={() => addToCart(p)}
                          className="w-[38px] h-[38px] rounded-sm bg-[#111] text-white flex items-center justify-center hover:bg-[#ff3b30] transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {viewMode === 'list' && (
                  <div className="flex flex-col flex-1 min-w-0 py-1">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <span className="text-[11px] font-semibold text-[#ff3b30] uppercase tracking-[2px]">
                        {p.brand_name || 'Premium Hardware'}
                      </span>
                      <span className="text-[12px] font-medium text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        In Stock
                      </span>
                    </div>

                    <Link to={`/product/${p.slug}`}>
                      <h3 className="text-[24px] md:text-[28px] font-bold text-[#222] group-hover:text-[#ff3b30] transition-colors mb-4 leading-tight">
                        {p.name}
                      </h3>
                    </Link>

                    <p className="text-[#666] text-[15px] md:text-[16px] mb-7 line-clamp-2 leading-relaxed">
                      Experience professional-grade printing with this genuine hardware solution. Optimized for speed, clarity, and everyday performance.
                    </p>

                    <div className="mt-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 pt-6 border-t border-[#ededed]">
                      <div>
                        <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[2px] mb-1">
                          Price
                        </p>
                        <p className="text-[30px] font-bold text-[#ff3b30] tracking-tight">
                          ${Number(p.price).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => addToCart(p)}
                          className="h-[44px] px-7 bg-[#111] text-white text-[13px] font-semibold uppercase rounded-sm hover:bg-[#ff3b30] transition-all"
                        >
                          Add To Cart
                        </button>

                        <Link
                          to={`/product/${p.slug}`}
                          className="h-[44px] px-6 border border-[#dcdcdc] text-[#333] text-[13px] font-semibold uppercase rounded-sm hover:border-[#ff3b30] hover:text-[#ff3b30] transition-all inline-flex items-center gap-2"
                        >
                          Details
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="py-12 border-t border-[#e5e5e5]">
        <div className="w-full px-4 md:px-6 xl:px-10 flex justify-center">
          <p className="text-[12px] font-semibold text-[#999] uppercase tracking-[0.25em]">
            End of Catalog
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dddddd;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}