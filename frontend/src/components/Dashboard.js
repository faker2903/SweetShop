import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SweetCard from './SweetCard';
import Cart from './Cart';
import { sweetsAPI, cartAPI } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchSweets();
  }, []);

  const filterSweets = useCallback(() => {
    let filtered = sweets;

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(sweet =>
        sweet.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(sweet => {
        const price = sweet.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    setFilteredSweets(filtered);
  }, [sweets, searchTerm, categoryFilter, priceRange]);

  useEffect(() => {
    filterSweets();
  }, [filterSweets]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await sweetsAPI.getAll();
      setSweets(response.data);
    } catch (err) {
      setError('Failed to fetch sweets');
      console.error('Fetch sweets error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweetId) => {
    try {
      await sweetsAPI.purchase(sweetId);
      // Refresh sweets list
      await fetchSweets();
    } catch (err) {
      setError('Failed to purchase sweet');
      console.error('Purchase error:', err);
    }
  };

  const handleEditSweet = (sweet) => {
    navigate('/admin', { state: { sweet } });
  };

  const handleDeleteSweet = async (sweetId) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await sweetsAPI.delete(sweetId);
        await fetchSweets();
      } catch (err) {
        setError('Failed to delete sweet');
        console.error('Delete error:', err);
      }
    }
  };

  const handleAddToCart = async (sweetId, quantity) => {
    try {
      await cartAPI.addToCart(sweetId, quantity);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to add to cart');
      console.error('Add to cart error:', err);
    }
  };

  const handleViewCart = () => {
    setShowCart(true);
  };

  const handleCartClose = () => {
    setShowCart(false);
    fetchSweets(); // Refresh sweets after checkout
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setPriceRange({ min: '', max: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center py-4 lg:py-6 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg lg:text-xl">🍬</span>
              </div>
              <div>
                <h1 className="text-h2 font-bold text-white">Sweet Shop</h1>
                <p className="text-small text-white/70 hidden sm:block">Premium treats for every occasion</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <div className="text-center sm:text-right lg:text-right">
                <p className="text-white font-medium text-sm lg:text-base">Welcome back, {user.username}!</p>
                <p className="text-small text-white/70">Ready to indulge?</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                {user.role !== 'admin' && (
                  <button
                    onClick={handleViewCart}
                    className="bg-white/20 backdrop-blur-md text-white font-semibold px-3 lg:px-6 py-2 lg:py-3 rounded-2xl border border-white/30 shadow-lg hover:bg-white/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent text-sm lg:text-base"
                  >
                    <span className="mr-1 lg:mr-2">🛒</span>
                    <span className="hidden sm:inline">View Cart</span>
                    <span className="sm:hidden">Cart</span>
                  </button>
                )}
                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-accent text-white px-3 lg:px-6 py-2 lg:py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent text-sm lg:text-base"
                  >
                    <span className="hidden sm:inline">Admin Panel</span>
                    <span className="sm:hidden">Admin</span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="bg-red-500 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent text-sm lg:text-base"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none rounded-3xl"></div>
          <div className="relative">
            <h2 className="text-h3 font-bold text-white mb-6">Find Your Perfect Sweet</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div>
                <label className="block text-small font-medium text-white/90 mb-2">Search by Name</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                  placeholder="Search sweets..."
                />
              </div>
              <div>
                <label className="block text-small font-medium text-white/90 mb-2">Category</label>
                <input
                  type="text"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                  placeholder="Filter by category..."
                />
              </div>
              <div>
                <label className="block text-small font-medium text-white/90 mb-2">Min Price</label>
                <input
                  type="number"
                  min="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-small font-medium text-white/90 mb-2">Max Price</label>
                <input
                  type="number"
                  min="0"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                  placeholder="100"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center sm:justify-start">
              <button
                onClick={clearFilters}
                className="bg-white/20 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-2xl border border-white/30 shadow-lg hover:bg-white/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-400/50 text-red-300 px-6 py-4 rounded-3xl mb-8 text-center">
            {error}
          </div>
        )}

        {/* Sweets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredSweets.map((sweet) => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              user={user}
              onPurchase={handlePurchase}
              onEdit={handleEditSweet}
              onDelete={handleDeleteSweet}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredSweets.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
              <span className="text-4xl">🍬</span>
            </div>
            <h3 className="text-h3 font-bold text-white mb-2">No sweets found</h3>
            <p className="text-body text-white/70">Try adjusting your search criteria or clear the filters.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">🍬</span>
                </div>
                <h3 className="text-h3 font-bold text-white">Sweet Shop</h3>
              </div>
              <p className="text-body text-white/70 leading-relaxed">
                Crafting premium sweets with love and the finest ingredients. Your perfect treat awaits.
              </p>
            </div>
            <div>
              <h4 className="text-h3 font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-body text-white/70 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-body text-white/70 hover:text-white transition-colors">Our Sweets</a></li>
                <li><a href="#" className="text-body text-white/70 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-body text-white/70 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-h3 font-semibold text-white mb-4">Connect With Us</h4>
              <p className="text-body text-white/70 mb-4">
                Follow us for the latest sweet creations and special offers.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/30 border border-white/30 transition-all duration-300 cursor-pointer">
                  <span>📘</span>
                </div>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/30 border border-white/30 transition-all duration-300 cursor-pointer">
                  <span>📷</span>
                </div>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/30 border border-white/30 transition-all duration-300 cursor-pointer">
                  <span>🐦</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-small text-white/60">
              © 2024 Sweet Shop. Made with ❤️ for sweet lovers everywhere.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      {showCart && (
        <Cart
          user={user}
          onClose={handleCartClose}
        />
      )}
    </div>
  );
};

export default Dashboard;
