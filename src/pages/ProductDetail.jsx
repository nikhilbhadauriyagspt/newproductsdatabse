import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { useCart } from '../context/CartContext';
import {
  Heart,
  ChevronRight,
  Truck,
  ShieldCheck,
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
  const [validImages, setValidImages] = useState([]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setActiveImage(0);
    setValidImages([]);

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
      if (!images) return [];

      let imgs = typeof images === 'string' ? JSON.parse(images) : images;
      if (!Array.isArray(imgs)) return [];

      const cleanedImages = [...new Set(
        imgs
          .filter((img) => img && typeof img === 'string' && img.trim() !== '')
          .map((img) => img.trim().replace(/\\/g, '/'))
          .filter((img) => {
            const lower = img.toLowerCase();
            return (
              lower.endsWith('.jpg') ||
              lower.endsWith('.jpeg') ||
              lower.endsWith('.png') ||
              lower.endsWith('.webp') ||
              lower.endsWith('.avif')
            );
          })
      )];

      return cleanedImages.map((img) => (img.startsWith('/') ? img : `/${img}`));
    } catch {
      return [];
    }
  };

  const getImagePath = (images) => {
    const valid = getImages(images);
    return valid.length > 0 ? valid[0] : '/logo/fabicon.png';
  };

  useEffect(() => {
    if (!product) return;

    const rawImages = getImages(product.images);

    if (rawImages.length === 0) {
      setValidImages([]);
      return;
    }

    let isCancelled = false;

    Promise.all(
      rawImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;

          img.onload = () => resolve(src);
          img.onerror = () => resolve(null);
        });
      })
    ).then((results) => {
      if (isCancelled) return;

      const loadedImages = results.filter(Boolean);

      setValidImages(loadedImages);

      if (loadedImages.length === 0) {
        setActiveImage(0);
      } else if (activeImage > loadedImages.length - 1) {
        setActiveImage(0);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [product]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white font-['Rubik']">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-3 border-gray-100 border-t-blue-600 rounded-full mb-4"
        />
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Loading Hardware...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-white font-['Rubik']">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
        <Link to="/shop" className="text-blue-600 font-medium hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = validImages;
  const safeActiveImage = images.length > 0 ? Math.min(activeImage, images.length - 1) : 0;
  const mainImage = images.length > 0 ? images[safeActiveImage] : '/logo/fabicon.png';
  const thumbnails = images.length > 1 ? images : [];

  return (
    <div className="min-h-screen bg-white font-['Rubik'] text-gray-900 pb-20">
      <SEO
        title={product.meta_title || product.name}
        description={product.meta_description || product.description?.substring(0, 160)}
        keywords={product.meta_keywords}
        canonical={product.canonical_tag}
      />

      <div className="w-full px-4 md:px-6 lg:px-10 py-3 bg-gray-50 border-b border-gray-100">
        <nav className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-blue-600">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-gray-900 font-bold truncate max-w-[150px]">{product.name}</span>
        </nav>
      </div>

      <div className="w-full px-4 md:px-6 lg:px-10 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
            {thumbnails.length > 0 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px] shrink-0 custom-scrollbar">
                {thumbnails.map((img, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setActiveImage(idx)}
                    onClick={() => setActiveImage(idx)}
                    className={`w-12 h-12 md:w-14 md:h-14 border p-1 rounded transition-all ${safeActiveImage === idx
                        ? 'border-orange-500 ring-1 ring-orange-500'
                        : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 relative bg-white border border-gray-100 rounded-lg p-4 md:p-8 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              <img
                src={mainImage}
                alt={product.name}
                className="max-w-full max-h-[450px] object-contain transition-transform duration-500"
                onError={(e) => { e.target.src = '/logo/fabicon.png'; }}
              />
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-all ${isInWishlist(product.id)
                    ? 'text-red-500'
                    : 'text-gray-300 hover:text-red-500'
                  }`}
              >
                <Heart size={20} className={isInWishlist(product.id) ? 'fill-red-500' : ''} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="pb-4 border-b border-gray-100">
              <Link to="/shop" className="text-xs font-bold text-blue-600 uppercase tracking-wide hover:underline">
                Brand: {product.brand_name || 'Generic'}
              </Link>
              <h1 className="text-xl md:text-2xl font-medium text-gray-900 mt-1 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-gray-400">SKU: {product.sku || 'N/A'}</span>
                <span className="text-gray-200">|</span>
                <span className="text-emerald-600 font-bold uppercase tracking-tighter">
                  Official Product
                </span>
              </div>
            </div>

            <div className="lg:hidden py-4 border-b border-gray-100">
              <p className="text-2xl font-medium text-red-600">${Number(product.price).toFixed(2)}</p>
              {product.sale_price && (
                <p className="text-sm text-gray-400 line-through">
                  ${Number(product.sale_price).toFixed(2)}
                </p>
              )}
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold">About this item</h3>
              <ul className="space-y-2">
                {product.key_features ? (
                  product.key_features
                    .split('\n')
                    .filter((l) => l.trim())
                    .map((feature, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700 leading-snug">
                        <span className="text-gray-300 shrink-0">•</span>
                        <span>{feature.replace(/^[•*-]\s*/, '')}</span>
                      </li>
                    ))
                ) : (
                  <li className="text-sm text-gray-500 italic">No features listed.</li>
                )}
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || 'No description available for this hardware.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6 space-y-6 shadow-sm">
              <div>
                <div className="flex items-start gap-1">
                  <span className="text-sm font-medium mt-1">$</span>
                  <span className="text-3xl font-medium leading-none">
                    {Number(product.price).toFixed(2).split('.')[0]}
                  </span>
                  <span className="text-sm font-medium mt-1">
                    {Number(product.price).toFixed(2).split('.')[1]}
                  </span>
                </div>
                {product.sale_price && Number(product.sale_price) > Number(product.price) && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500">
                      List: <span className="line-through">${Number(product.sale_price).toFixed(2)}</span>
                    </span>
                    <span className="text-xs font-bold text-red-600">
                      Save {Math.round(((Number(product.sale_price) - Number(product.price)) / Number(product.sale_price)) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className={`text-lg font-bold ${Number(product.quantity) > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {Number(product.quantity) > 0 ? 'In Stock' : 'Currently Unavailable'}
                </p>
                <p className="text-xs text-gray-500">Ships from Official Warehouse</p>
              </div>

              {Number(product.quantity) > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-xs font-bold text-gray-500 uppercase">Quantity:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="flex-1 h-8 px-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdded}
                      className={`w-full h-10 rounded-full font-medium text-sm transition-all shadow-sm ${isAdded
                          ? 'bg-emerald-500 text-white'
                          : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                        }`}
                    >
                      {isAdded ? 'Added to Cart' : 'Add to Cart'}
                    </button>

                    <button
                      onClick={() => {
                        addToCart(product, quantity);
                        window.location.href = '/checkout';
                      }}
                      className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium text-sm transition-all shadow-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-3 text-[12px]">
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck size={14} className="shrink-0" />
                  <span>Fast & Secure Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <ShieldCheck size={14} className="shrink-0" />
                  <span>{product.warranty || 'Official Warranty'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold mb-6">Customers also viewed</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  to={`/product/${p.slug}`}
                  key={p.id}
                  className="group"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <div className="aspect-square bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-center mb-3 group-hover:shadow-md transition-all">
                    <img
                      src={getImagePath(p.images)}
                      alt={p.name}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.src = '/logo/fabicon.png'; }}
                    />
                  </div>
                  <h4 className="text-sm font-medium text-blue-600 hover:text-orange-500 hover:underline line-clamp-2 leading-tight">
                    {p.name}
                  </h4>
                  <p className="mt-2 text-lg font-medium text-gray-900">${Number(p.price).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d1d1; }
      `}</style>
    </div>
  );
}