import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Download, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import Papa from 'papaparse';
import API_BASE_URL from '../../config';

export default function BulkProductUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // Fetch Categories for reference
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const flat = [];
          const flatten = (items) => {
            items.forEach(item => {
              flat.push({ id: item.id, name: item.name });
              if (item.children && item.children.length > 0) flatten(item.children);
            });
          };
          flatten(data.data);
          setCategories(flat);
        }
      });

    // Fetch Brands for reference
    fetch(`${API_BASE_URL}/brands`)
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setBrands(data.data); });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setPreviewData(results.data.slice(0, 5)); // Show first 5 rows
        }
      });
    }
  };

  const downloadSampleCSV = () => {
    const headers = "name,price,sale_price,quantity,sku,description,category_id,brand_id,images,is_featured,is_new,is_popular,is_trending\n";
    const sample = "Example Printer,299.99,,10,SKU001,Great printer for office,39,5,\"products/p1.png, products/p2.png\",0,1,0,0";
    const blob = new Blob([headers + sample], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_sample.csv';
    a.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const response = await fetch(`${API_BASE_URL}/products/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: results.data })
          });
          const data = await response.json();
          setResult(data);
        } catch (err) {
          setResult({ status: 'error', message: 'Failed to connect to server' });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Bulk Product Upload</h1>
        </div>
        <button 
          onClick={downloadSampleCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all"
        >
          <Download size={16} /> DOWNLOAD SAMPLE CSV
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <FileSpreadsheet size={32} />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">Upload your CSV file</p>
            <p className="text-sm text-slate-500">Only .csv files are supported</p>
          </div>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="hidden" 
            id="csv-upload" 
          />
          <label 
            htmlFor="csv-upload"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs cursor-pointer transition-all"
          >
            SELECT FILE
          </label>
          {file && <p className="text-sm font-bold text-blue-600">Selected: {file.name}</p>}
        </div>

        {previewData.length > 0 && !result && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 tracking-widest uppercase">Data Preview (First 5 Rows)</h3>
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-slate-500 font-bold">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Category ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      <td className="p-4 font-bold">{row.name}</td>
                      <td className="p-4 text-blue-600 font-bold">${row.price}</td>
                      <td className="p-4">{row.category_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button 
              onClick={handleUpload}
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-900/10"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload size={18} />}
              START BULK IMPORT
            </button>
          </div>
        )}

        {result && (
          <div className={`p-6 rounded-3xl flex items-start gap-4 ${result.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {result.status === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <div>
              <p className="font-bold">{result.message}</p>
              {result.errors && result.errors.length > 0 && (
                <ul className="mt-2 text-xs space-y-1">
                  {result.errors.map((err, i) => <li key={i}>• {err}</li>)}
                </ul>
              )}
              {result.status === 'success' && (
                <button 
                  onClick={() => navigate('/admin/products')}
                  className="mt-4 px-4 py-2 bg-green-700 text-white rounded-xl font-bold text-xs"
                >
                  VIEW PRODUCTS
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ID Reference Guide */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center gap-2">
            <Info className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Quick ID Reference Guide</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Categories Reference */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Category IDs</h3>
                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-sm">
                        <thead className="text-slate-500 border-b border-gray-50">
                            <tr>
                                <th className="pb-2 text-left">Category Name</th>
                                <th className="pb-2 text-right">ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td className="py-2 text-slate-700 font-medium">{cat.name}</td>
                                    <td className="py-2 text-right font-bold text-blue-600">{cat.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Brands Reference */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Brand IDs</h3>
                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-sm">
                        <thead className="text-slate-500 border-b border-gray-50">
                            <tr>
                                <th className="pb-2 text-left">Brand Name</th>
                                <th className="pb-2 text-right">ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {brands.map(brand => (
                                <tr key={brand.id}>
                                    <td className="py-2 text-slate-700 font-medium">{brand.name}</td>
                                    <td className="py-2 text-right font-bold text-blue-600">{brand.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
