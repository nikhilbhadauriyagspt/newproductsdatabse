import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { useCart } from '../context/CartContext';
import {
  Heart,
  ChevronRight,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  ChevronsRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

export default function ProductDetail() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');
  const [showFullDesc, setShowMore] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    fetch(`${API_BASE_URL}/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setProduct(data.data);

          const categories = data.data.categories || [];
          const categorySlug = categories.length > 0 ? categories[0].slug : '';
          const brand = data.data.brand_name;

          let fetchUrl = `${API_BASE_URL}/products?limit=6`;
          if (categorySlug) fetchUrl += `&category=${categorySlug}`;
          else if (brand) fetchUrl += `&brand=${brand}`;

          fetch(fetchUrl)
            .then((res) => res.json())
            .then((relData) => {
              if (relData.status === 'success') {
                setRelatedProducts(relData.data.filter((p) => p.id !== data.data.id));
              }
            });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const getImages = (images) => {
    try {
      const imgs = typeof images === 'string' ? JSON.parse(images) : images;
      return Array.isArray(imgs)
        ? imgs.map((img) => `/${img.replace(/\\/g, '/')}`)
        : [];
    } catch {
      return [];
    }
  };

  const getImagePath = (images) => {
    try {
      const imgs = typeof images === 'string' ? JSON.parse(images) : images;
      if (Array.isArray(imgs) && imgs.length > 0) {
        return `/${imgs[0].replace(/\\/g, '/')}`;
      }
    } catch { }
    return '/logo/fabicon.png';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] font-['Rubik']">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 border-4 border-[#ececec] border-t-[#ff3b30] rounded-full mb-5"
        />
        <p className="text-[13px] font-semibold text-[#999]">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#f5f5f5] font-['Rubik']">
        <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center mb-6 rounded-full">
          <Info size={28} className="text-[#c8c8c8]" />
        </div>
        <h2 className="text-[28px] font-bold text-[#222] mb-2">Product not found</h2>
        <p className="text-[#666] mb-8 max-w-md">
          The requested product could not be located in our catalog.
        </p>
        <Link
          to="/shop"
          className="h-[44px] px-8 bg-[#111] text-white inline-flex items-center justify-center text-[13px] font-semibold uppercase rounded-sm hover:bg-[#ff3b30] transition-all"
        >
          Return To Catalog
        </Link>
      </div>
    );
  }

  const images = getImages(product.images);
  const mainImage = images.length > 0 ? images[activeImage] : '/logo/fabicon.png';

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-['Rubik'] text-[#222] pb-14 md:pb-20">
      <SEO
        title={product.meta_title || product.name}
        description={product.meta_description || product.description?.substring(0, 160)}
        keywords={product.meta_keywords}
        canonical={product.canonical_tag}
      />

      {/* PAGE HEADER */}
      <div className="bg-[#f5f5f5] border-b border-[#dddddd]">
        <div className="w-full px-4 md:px-6 xl:px-10 py-8 md:py-10">
          <div className="flex flex-col gap-5">
            <nav className="flex items-center gap-2 text-[12px] font-semibold text-[#7a7a7a]">
              <Link to="/" className="hover:text-[#ff3b30] transition-colors">
                Home
              </Link>
              <ChevronRight size={14} className="text-[#bdbdbd]" />
              <Link to="/shop" className="hover:text-[#ff3b30] transition-colors">
                Shop
              </Link>
              <ChevronRight size={14} className="text-[#bdbdbd]" />
              <span className="text-[#ff3b30] truncate max-w-[220px]">{product.name}</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#dddddd] pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <ChevronsRight
                  size={26}
                  className="text-[#ff3b30] shrink-0"
                  strokeWidth={3}
                />
                <h1 className="text-[24px] md:text-[28px] font-extrabold uppercase tracking-tight text-[#1f2937] truncate">
                  Product Details
                </h1>
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#666] hover:text-[#ff3b30] transition-colors"
              >
                <ArrowLeft size={16} />
                Back To Shop
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 xl:px-10 py-8 md:py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-10">
          {/* LEFT GALLERY */}
          <div className="xl:col-span-6">
            <div className="bg-white border border-[#e5e5e5] p-5 md:p-6">
              <div className="relative aspect-square bg-[#f1f1f1] border border-[#dddddd] overflow-hidden flex items-center justify-center p-6 md:p-10">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/logo/fabicon.png';
                  }}
                />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.is_new == 1 && (
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-sm">
                      New Arrival
                    </span>
                  )}
                  {product.is_featured == 1 && (
                    <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-sm">
                      Featured
                    </span>
                  )}
                  {product.is_popular == 1 && (
                    <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-sm">
                      Popular
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center transition-all ${isInWishlist(product.id)
                      ? 'text-[#ff3b30]'
                      : 'text-[#888] hover:text-[#ff3b30]'
                    }`}
                >
                  <Heart
                    size={18}
                    className={isInWishlist(product.id) ? 'fill-[#ff3b30]' : ''}
                  />
                </button>

                <div className="absolute left-4 bottom-4 inline-flex items-center gap-2 bg-white border border-[#e5e5e5] px-3 py-1.5 rounded-full text-[12px] font-medium text-[#444]">
                  <span className={`w-2 h-2 rounded-full ${Number(product.quantity) > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {Number(product.quantity) > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pt-4 custom-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-[82px] h-[82px] border p-2 bg-white flex items-center justify-center shrink-0 transition-all ${activeImage === idx
                          ? 'border-[#ff3b30]'
                          : 'border-[#dddddd] hover:border-[#cfcfcf]'
                        }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="max-w-full max-h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="xl:col-span-6">
            <div className="bg-white border border-[#e5e5e5] p-6 md:p-8 h-full">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-[12px]">
                  <span className="font-semibold uppercase tracking-[0.18em] text-[#ff3b30]">
                    {product.brand_name || 'Premium'}
                  </span>
                  <span className="w-px h-4 bg-[#d8d8d8]" />
                  <span className="font-medium uppercase tracking-[0.12em] text-[#888]">
                    Genuine Hardware
                  </span>
                  {product.sku && (
                    <>
                      <span className="w-px h-4 bg-[#d8d8d8]" />
                      <span className="font-medium uppercase tracking-[0.12em] text-[#888]">
                        SKU: {product.sku}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-[28px] md:text-[38px] font-bold leading-tight text-[#222]">
                  {product.name}
                </h2>

                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#999] mb-1">
                      Our Price
                    </p>
                    <p className="text-[32px] md:text-[40px] font-bold text-[#ff3b30] leading-none">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>

                  {product.sale_price && Number(product.sale_price) > Number(product.price) && (
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#999] mb-1">
                        List Price
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-[20px] text-[#9b9b9b] line-through">
                          ${Number(product.sale_price).toFixed(2)}
                        </p>
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-bold rounded-sm border border-red-100">
                          SAVE {Math.round(((Number(product.sale_price) - Number(product.price)) / Number(product.sale_price)) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-[#ededed]">
                  {product.description && (
                    <p className="text-[15px] font-medium text-[#444] leading-relaxed mb-4">
                      {product.description}
                    </p>
                  )}
                  
                  <div 
                    className={`text-[15px] md:text-[16px] text-[#666] leading-relaxed overflow-hidden transition-all duration-500 relative ${!showFullDesc ? 'max-h-[300px]' : 'max-h-[10000px]'}`}
                  >
                    <div 
                      className="prose prose-slate max-w-none product-description"
                      dangerouslySetInnerHTML={{ __html: product.content || 'High-performance printing solution designed for professional and everyday use.' }}
                    />
                    
                    {!showFullDesc && (product.content?.length > 500) && (
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                  </div>
                  
                  {(product.content?.length > 500) && (
                    <button 
                      onClick={() => setShowMore(!showFullDesc)}
                      className="mt-4 text-[13px] font-bold text-[#ff3b30] flex items-center gap-1 hover:underline uppercase tracking-widest"
                    >
                      {showFullDesc ? (
                        <>Show Less <ArrowRight size={14} className="rotate-[-90deg]" /></>
                      ) : (
                        <>Show More <ArrowRight size={14} className="rotate-90" /></>
                      )}
                    </button>
                  )}
                </div>

                {/* KEY FEATURES */}
                {product.key_features && (
                  <div className="pt-6 border-t border-[#ededed]">
                    <h3 className="text-[14px] font-bold uppercase tracking-widest text-[#222] mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#ff3b30] rounded-full" />
                      Key Features
                    </h3>
                    <ul className="text-[14px] text-[#666] space-y-3">
                      {product.key_features.split('\n').filter(line => line.trim()).map((feature, i) => (
                        <li key={i} className="flex gap-3">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature.replace(/^[•*-]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* QUANTITY + CART */}
                <div className="pt-2 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="h-[48px] px-4 bg-white border border-[#dcdcdc] flex items-center justify-between gap-6 min-w-[150px]">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-[#777] hover:text-[#ff3b30] transition-colors"
                      >
                        <Minus size={18} strokeWidth={2.5} />
                      </button>

                      <span className="text-[18px] font-semibold text-[#222] min-w-[20px] text-center">
                        {quantity}
                      </span>

                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-[#777] hover:text-[#ff3b30] transition-colors"
                      >
                        <Plus size={18} strokeWidth={2.5} />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={isAdded || Number(product.quantity) <= 0}
                      className={`flex-1 h-[48px] inline-flex items-center justify-center gap-2 text-[13px] font-semibold uppercase transition-all ${isAdded
                          ? 'bg-emerald-500 text-white'
                          : Number(product.quantity) <= 0 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-[#111] text-white hover:bg-[#ff3b30]'
                        }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 size={18} />
                          Added To Cart
                        </>
                      ) : Number(product.quantity) <= 0 ? (
                        'Out of Stock'
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          Add To Cart
                        </>
                      )}
                    </button>
                  </div>

                  {/* SERVICE BOXES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-[#e5e5e5] p-4 flex items-center gap-4 bg-[#fafafa]">
                      <div className="w-10 h-10 flex items-center justify-center bg-[#fff5f5] text-[#ff3b30]">
                        <Truck size={18} />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#222]">Fast Delivery</p>
                        <p className="text-[12px] text-[#888] uppercase tracking-[0.12em]">
                          Within 3-5 Days
                        </p>
                      </div>
                    </div>

                    <div className="border border-[#e5e5e5] p-4 flex items-center gap-4 bg-[#fafafa]">
                      <div className="w-10 h-10 flex items-center justify-center bg-[#fff5f5] text-[#ff3b30]">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#222]">Full Warranty</p>
                        <p className="text-[12px] text-[#888] uppercase tracking-[0.12em]">
                          {product.warranty || '1 Year Brand Warranty'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TABS */}
                <div className="pt-6 border-t border-[#ededed]">
                  <div className="flex items-center gap-6 border-b border-[#ededed] mb-6">
                    {[
                      { id: 'specs', label: 'Hardware Specs' },
                      { id: 'support', label: 'Help & Support' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative pb-4 text-[13px] font-semibold uppercase transition-colors ${activeTab === tab.id
                            ? 'text-[#ff3b30]'
                            : 'text-[#777] hover:text-[#222]'
                          }`}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="tab-underline"
                            className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#ff3b30]"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="min-h-[160px]">
                    {activeTab === 'specs' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                        {[
                          { label: 'Brand', value: product.brand_name || 'N/A' },
                          { label: 'Model', value: product.model || 'N/A' },
                          { label: 'Model Number', value: product.model_number || 'N/A' },
                          { label: 'Print Speed', value: product.print_speed || 'N/A' },
                          { label: 'Print Resolution', value: product.print_resolution || 'N/A' },
                          { label: 'Connectivity', value: product.connectivity || 'N/A' },
                          { label: 'Warranty', value: product.warranty || 'N/A' },
                          { label: 'Condition', value: 'Brand New' },
                        ].map((spec, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-4 py-4 border-b border-[#f0f0f0]"
                          >
                            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#888]">
                              {spec.label}
                            </span>
                            <span className="text-[13px] font-semibold text-[#222] text-right">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'support' && (
                      <div className="bg-[#111] text-white p-6 md:p-8">
                        <h4 className="text-[24px] font-bold mb-3">
                          Need technical assistance?
                        </h4>
                        <p className="text-[#cfcfcf] text-[15px] leading-relaxed mb-6 max-w-[680px]">
                          Our specialists are available to help with setup,
                          configuration, and general hardware guidance.
                        </p>
                        <Link
                          to="/contact"
                          className="inline-flex items-center gap-2 h-[44px] px-6 bg-[#ff3b30] text-white text-[13px] font-semibold uppercase hover:bg-white hover:text-[#111] transition-all"
                        >
                          Contact Support
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 md:mt-12 bg-white border border-[#e5e5e5]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#ededed] px-6 md:px-8 py-5">
              <div className="flex items-center gap-3">
                <ChevronsRight
                  size={24}
                  className="text-[#ff3b30] shrink-0"
                  strokeWidth={3}
                />
                <h3 className="text-[22px] md:text-[24px] font-extrabold uppercase tracking-tight text-[#222]">
                  Related Products
                </h3>
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#666] hover:text-[#ff3b30] transition-colors"
              >
                View Full Catalog
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 p-5 md:p-6">
              {relatedProducts.map((p) => (
                <Link
                  to={`/product/${p.slug}`}
                  key={p.id}
                  className="group"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <div className="relative mb-4 rounded-sm bg-[#f1f1f1] border border-[#dddddd] overflow-hidden flex items-center justify-center aspect-square p-5 transition-all group-hover:bg-white">
                    <img
                      src={getImagePath(p.images)}
                      alt={p.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/logo/fabicon.png';
                      }}
                    />
                  </div>

                  <span className="text-[11px] uppercase tracking-wide text-[#8c8c8c] font-medium mb-1 block">
                    {p.brand_name || 'Premium'}
                  </span>

                  <h4 className="text-[15px] text-[#2b2b2b] font-medium leading-snug min-h-[42px] group-hover:text-[#ff3b30] transition-colors">
                    {p.name}
                  </h4>

                  <p className="mt-2 text-[16px] font-bold text-[#ff3b30]">
                    ${Number(p.price).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
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