import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import * as productService from '../services/productService';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import Pagination from '../components/Pagination';

// GPU 顯卡型號列表
const GPU_MODELS = [
  // NVIDIA RTX 50 系列
  { name: 'RTX 5090', category: 'GPU', price: 45000, sku: 'GPU-RTX5090' },
  { name: 'RTX 5080', category: 'GPU', price: 32000, sku: 'GPU-RTX5080' },
  { name: 'RTX 5070 Ti', category: 'GPU', price: 25000, sku: 'GPU-RTX5070TI' },
  { name: 'RTX 5070', category: 'GPU', price: 20000, sku: 'GPU-RTX5070' },
  
  // NVIDIA RTX 40 系列
  { name: 'RTX 4090', category: 'GPU', price: 52000, sku: 'GPU-RTX4090' },
  { name: 'RTX 4080 SUPER', category: 'GPU', price: 35000, sku: 'GPU-RTX4080S' },
  { name: 'RTX 4080', category: 'GPU', price: 33000, sku: 'GPU-RTX4080' },
  { name: 'RTX 4070 Ti SUPER', category: 'GPU', price: 26000, sku: 'GPU-RTX4070TIS' },
  { name: 'RTX 4070 Ti', category: 'GPU', price: 24000, sku: 'GPU-RTX4070TI' },
  { name: 'RTX 4070 SUPER', category: 'GPU', price: 21000, sku: 'GPU-RTX4070S' },
  { name: 'RTX 4070', category: 'GPU', price: 18000, sku: 'GPU-RTX4070' },
  { name: 'RTX 4060 Ti 16GB', category: 'GPU', price: 15000, sku: 'GPU-RTX4060TI16' },
  { name: 'RTX 4060 Ti 8GB', category: 'GPU', price: 13000, sku: 'GPU-RTX4060TI8' },
  { name: 'RTX 4060', category: 'GPU', price: 10000, sku: 'GPU-RTX4060' },
  
  // NVIDIA RTX 30 系列
  { name: 'RTX 3090 Ti', category: 'GPU', price: 38000, sku: 'GPU-RTX3090TI' },
  { name: 'RTX 3090', category: 'GPU', price: 35000, sku: 'GPU-RTX3090' },
  { name: 'RTX 3080 Ti', category: 'GPU', price: 28000, sku: 'GPU-RTX3080TI' },
  { name: 'RTX 3080 12GB', category: 'GPU', price: 25000, sku: 'GPU-RTX308012' },
  { name: 'RTX 3080 10GB', category: 'GPU', price: 23000, sku: 'GPU-RTX308010' },
  { name: 'RTX 3070 Ti', category: 'GPU', price: 18000, sku: 'GPU-RTX3070TI' },
  { name: 'RTX 3070', category: 'GPU', price: 15000, sku: 'GPU-RTX3070' },
  { name: 'RTX 3060 Ti', category: 'GPU', price: 12000, sku: 'GPU-RTX3060TI' },
  { name: 'RTX 3060 12GB', category: 'GPU', price: 9500, sku: 'GPU-RTX3060' },
  { name: 'RTX 3050 8GB', category: 'GPU', price: 7500, sku: 'GPU-RTX3050' },
  
  // NVIDIA RTX 20 系列
  { name: 'RTX 2080 Ti', category: 'GPU', price: 28000, sku: 'GPU-RTX2080TI' },
  { name: 'RTX 2080 SUPER', category: 'GPU', price: 22000, sku: 'GPU-RTX2080S' },
  { name: 'RTX 2080', category: 'GPU', price: 20000, sku: 'GPU-RTX2080' },
  { name: 'RTX 2070 SUPER', category: 'GPU', price: 16000, sku: 'GPU-RTX2070S' },
  { name: 'RTX 2070', category: 'GPU', price: 14000, sku: 'GPU-RTX2070' },
  { name: 'RTX 2060 SUPER', category: 'GPU', price: 12000, sku: 'GPU-RTX2060S' },
  { name: 'RTX 2060', category: 'GPU', price: 10000, sku: 'GPU-RTX2060' },
  
  // NVIDIA GTX 16 系列
  { name: 'GTX 1660 Ti', category: 'GPU', price: 8500, sku: 'GPU-GTX1660TI' },
  { name: 'GTX 1660 SUPER', category: 'GPU', price: 7500, sku: 'GPU-GTX1660S' },
  { name: 'GTX 1660', category: 'GPU', price: 6500, sku: 'GPU-GTX1660' },
  { name: 'GTX 1650 SUPER', category: 'GPU', price: 5500, sku: 'GPU-GTX1650S' },
  { name: 'GTX 1650', category: 'GPU', price: 4500, sku: 'GPU-GTX1650' },
  
  // NVIDIA GTX 10 系列
  { name: 'GTX 1080 Ti', category: 'GPU', price: 18000, sku: 'GPU-GTX1080TI' },
  { name: 'GTX 1080', category: 'GPU', price: 14000, sku: 'GPU-GTX1080' },
  { name: 'GTX 1070 Ti', category: 'GPU', price: 12000, sku: 'GPU-GTX1070TI' },
  { name: 'GTX 1070', category: 'GPU', price: 10000, sku: 'GPU-GTX1070' },
  { name: 'GTX 1060 6GB', category: 'GPU', price: 7000, sku: 'GPU-GTX10606' },
  { name: 'GTX 1060 3GB', category: 'GPU', price: 5500, sku: 'GPU-GTX10603' },
  { name: 'GTX 1050 Ti', category: 'GPU', price: 4500, sku: 'GPU-GTX1050TI' },
  { name: 'GTX 1050', category: 'GPU', price: 3500, sku: 'GPU-GTX1050' },
  
  // NVIDIA TITAN 系列
  { name: 'TITAN RTX', category: 'GPU', price: 75000, sku: 'GPU-TITANRTX' },
  { name: 'TITAN V', category: 'GPU', price: 90000, sku: 'GPU-TITANV' },
  { name: 'TITAN Xp', category: 'GPU', price: 38000, sku: 'GPU-TITANXP' },
  
  // AMD RX 7000 系列
  { name: 'RX 7900 XTX', category: 'GPU', price: 30000, sku: 'GPU-RX7900XTX' },
  { name: 'RX 7900 XT', category: 'GPU', price: 26000, sku: 'GPU-RX7900XT' },
  { name: 'RX 7900 GRE', category: 'GPU', price: 23000, sku: 'GPU-RX7900GRE' },
  { name: 'RX 7800 XT', category: 'GPU', price: 18000, sku: 'GPU-RX7800XT' },
  { name: 'RX 7700 XT', category: 'GPU', price: 15000, sku: 'GPU-RX7700XT' },
  { name: 'RX 7600 XT', category: 'GPU', price: 11000, sku: 'GPU-RX7600XT' },
  { name: 'RX 7600', category: 'GPU', price: 9000, sku: 'GPU-RX7600' },
  
  // AMD RX 6000 系列
  { name: 'RX 6950 XT', category: 'GPU', price: 28000, sku: 'GPU-RX6950XT' },
  { name: 'RX 6900 XT', category: 'GPU', price: 25000, sku: 'GPU-RX6900XT' },
  { name: 'RX 6800 XT', category: 'GPU', price: 20000, sku: 'GPU-RX6800XT' },
  { name: 'RX 6800', category: 'GPU', price: 17000, sku: 'GPU-RX6800' },
  { name: 'RX 6750 XT', category: 'GPU', price: 15000, sku: 'GPU-RX6750XT' },
  { name: 'RX 6700 XT', category: 'GPU', price: 13000, sku: 'GPU-RX6700XT' },
  { name: 'RX 6650 XT', category: 'GPU', price: 11000, sku: 'GPU-RX6650XT' },
  { name: 'RX 6600 XT', category: 'GPU', price: 9500, sku: 'GPU-RX6600XT' },
  { name: 'RX 6600', category: 'GPU', price: 8000, sku: 'GPU-RX6600' },
  { name: 'RX 6500 XT', category: 'GPU', price: 6000, sku: 'GPU-RX6500XT' },
  { name: 'RX 6400', category: 'GPU', price: 4500, sku: 'GPU-RX6400' },
  
  // AMD RX 5000 系列
  { name: 'RX 5700 XT', category: 'GPU', price: 12000, sku: 'GPU-RX5700XT' },
  { name: 'RX 5700', category: 'GPU', price: 10000, sku: 'GPU-RX5700' },
  { name: 'RX 5600 XT', category: 'GPU', price: 8500, sku: 'GPU-RX5600XT' },
  { name: 'RX 5500 XT 8GB', category: 'GPU', price: 6500, sku: 'GPU-RX5500XT8' },
  { name: 'RX 5500 XT 4GB', category: 'GPU', price: 5500, sku: 'GPU-RX5500XT4' },
  
  // Intel Arc 系列
  { name: 'Arc A770 16GB', category: 'GPU', price: 12000, sku: 'GPU-ARCA77016' },
  { name: 'Arc A770 8GB', category: 'GPU', price: 10000, sku: 'GPU-ARCA7708' },
  { name: 'Arc A750', category: 'GPU', price: 8500, sku: 'GPU-ARCA750' },
  { name: 'Arc A580', category: 'GPU', price: 6500, sku: 'GPU-ARCA580' },
  { name: 'Arc A380', category: 'GPU', price: 4500, sku: 'GPU-ARCA380' },
];

export default function Products() {
  const { showLoading, hideLoading, showError, showSuccess } = useApp();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 表單狀態
  const [formData, setFormData] = useState({
    name: '',
    category: 'GPU',
    price: '',
    quantity: '',
    sku: '',
    description: ''
  });
  
  const [editingId, setEditingId] = useState(null);
  const [selectedGPU, setSelectedGPU] = useState('');
  
  // 搜尋和篩選
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // 分頁
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, categoryFilter, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('載入商品失敗: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // 搜尋
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 分類篩選
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // 排序
    filtered.sort((a, b) => {
      let compareA = a[sortBy];
      let compareB = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        compareA = new Date(compareA);
        compareB = new Date(compareB);
      } else if (typeof compareA === 'string') {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleGPUSelect = (e) => {
    const gpuName = e.target.value;
    setSelectedGPU(gpuName);
    
    if (gpuName) {
      const gpu = GPU_MODELS.find(g => g.name === gpuName);
      if (gpu) {
        setFormData({
          ...formData,
          name: gpu.name,
          category: gpu.category,
          price: gpu.price,
          sku: gpu.sku
        });
      }
    } else {
      setFormData({
        name: '',
        category: 'GPU',
        price: '',
        quantity: '',
        sku: '',
        description: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('請輸入商品名稱');
      return false;
    }
    if (!formData.quantity || formData.quantity < 0) {
      setError('請輸入有效的數量');
      return false;
    }
    if (!formData.price || formData.price < 0) {
      setError('請輸入有效的價格');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      showLoading();
      
      const productData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price)
      };

      if (editingId) {
        await productService.updateProduct(editingId, productData);
        showSuccess('商品更新成功');
      } else {
        await productService.createProduct(productData);
        showSuccess('商品新增成功');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      showError('操作失敗: ' + err.message);
    } finally {
      hideLoading();
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      sku: product.sku,
      description: product.description || ''
    });
    setSelectedGPU(''); // 編輯時不使用 GPU 下拉選單
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此商品嗎？')) return;

    try {
      showLoading();
      await productService.deleteProduct(id);
      showSuccess('商品刪除成功');
      fetchProducts();
    } catch (err) {
      showError('刪除失敗: ' + err.message);
    } finally {
      hideLoading();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'GPU',
      price: '',
      quantity: '',
      sku: '',
      description: ''
    });
    setEditingId(null);
    setSelectedGPU('');
    setError('');
  };

  const getCategories = () => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
  };

  // 分頁計算
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">商品管理</h1>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

      {/* 新增/編輯表單 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? '編輯商品' : '新增商品'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!editingId && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  選擇 GPU 型號（可選）
                </label>
                <select
                  value={selectedGPU}
                  onChange={handleGPUSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- 請選擇或手動輸入 --</option>
                  <optgroup label="NVIDIA RTX 50 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('RTX 5')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="NVIDIA RTX 40 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('RTX 4')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="NVIDIA RTX 30 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('RTX 3')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="NVIDIA RTX 20 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('RTX 2')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="NVIDIA GTX 16 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('GTX 16')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="NVIDIA GTX 10 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('GTX 10')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="NVIDIA TITAN 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('TITAN')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="AMD RX 7000 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('RX 7')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="AMD RX 6000 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('RX 6')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="AMD RX 5000 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('RX 5')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Intel Arc 系列">
                    {GPU_MODELS.filter(g => g.name.startsWith('Arc')).map(gpu => (
                      <option key={gpu.sku} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品名稱 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                類別
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                價格 *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                數量 *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingId ? '更新商品' : '新增商品'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                取消編輯
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 搜尋和篩選 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              搜尋
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="商品名稱或 SKU"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分類篩選
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部分類</option>
              {getCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              排序方式
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">建立時間</option>
              <option value="name">名稱</option>
              <option value="price">價格</option>
              <option value="quantity">數量</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              排序順序
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品名稱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  類別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  價格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  數量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    沒有商品資料
                  </td>
                </tr>
              ) : (
                currentItems.map((product) => (
                  <tr key={product._id} className={product.quantity < 10 ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-gray-500">{product.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      NT$ {product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${product.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.quantity}
                        {product.quantity < 10 && ' (庫存不足)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分頁控制 */}
        {filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredProducts.length}
          />
        )}
      </div>
    </div>
  );
}
