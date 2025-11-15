import React, { useState } from 'react';

const getDefaultImage = (category) => {
  const categoryImages = {
    'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=center',
    'ice cream': 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop&crop=center',
    'laddu': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center',
    'chocolate': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center',
    'cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center',
    'brownie': 'https://images.unsplash.com/photo-1607478900766-efe13248b125?w=400&h=300&fit=crop&crop=center',
    'cupcake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=center',
    'donut': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center'
  };

  return categoryImages[category.toLowerCase()] || 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center';
};

const SweetCard = ({ sweet, user, onPurchase, onEdit, onDelete, onAddToCart }) => {
  const [cartQuantity, setCartQuantity] = useState(1);

  const handlePurchase = () => {
    if (sweet.quantity > 0) {
      onPurchase(sweet._id);
    }
  };

  const handleAddToCart = () => {
    if (sweet.quantity > 0 && cartQuantity > 0) {
      onAddToCart(sweet._id, cartQuantity);
    }
  };

  return (
    <div className="group relative">
      {/* Glass morphism card with enhanced effects */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl hover:bg-white/15">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>

        <div className="relative p-6">
          <div className="relative mb-6 overflow-hidden rounded-2xl group-hover:shadow-2xl transition-shadow duration-500">
            <img
              src={sweet.imageUrl || getDefaultImage(sweet.category)}
              alt={sweet.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.target.src = getDefaultImage(sweet.category);
              }}
            />
            {sweet.quantity === 0 && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg bg-black/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">Out of Stock</span>
              </div>
            )}
            {/* Enhanced category badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-4 py-2 rounded-2xl text-small font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg">
                {sweet.category}
              </span>
            </div>
            {/* Price overlay on image */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <p className="text-2xl font-bold text-white">${sweet.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-h3 font-bold text-white group-hover:text-white transition-colors duration-300 mb-2 leading-tight line-clamp-2 min-h-[3.5rem]">{sweet.name}</h3>
            {!sweet.imageUrl && (
              <p className="text-2xl font-bold text-white mb-2">${sweet.price.toFixed(2)}</p>
            )}
            <p className="text-small text-white/80">
              <span className={`font-semibold ${sweet.quantity === 0 ? 'text-red-300' : 'text-green-300'}`}>
                {sweet.quantity} left in stock
              </span>
            </p>
          </div>

          {sweet.description && (
            <p className="text-body text-white/70 mb-6 line-clamp-2 leading-relaxed">{sweet.description}</p>
          )}

          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={handlePurchase}
                disabled={sweet.quantity === 0}
                className={`flex-1 bg-gradient-to-r from-primary to-accent text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-sm ${sweet.quantity === 0 ? 'bg-neutral-500 hover:bg-neutral-500' : ''}`}
              >
                {sweet.quantity === 0 ? 'Out of Stock' : 'Buy Now'}
              </button>
              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => onEdit(sweet)}
                    className="px-3 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl font-medium hover:bg-white/30 border border-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(sweet._id)}
                    className="px-3 py-2 bg-red-500/80 backdrop-blur-md text-white rounded-xl font-medium hover:bg-red-500 border border-red-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent text-sm"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <label htmlFor={`quantity-${sweet._id}`} className="text-small font-medium text-white/90">Qty:</label>
                <input
                  id={`quantity-${sweet._id}`}
                  type="number"
                  min="1"
                  max={sweet.quantity}
                  value={cartQuantity}
                  onChange={(e) => setCartQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white text-center font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 placeholder-white/60 text-sm"
                  placeholder="1"
                />
              </div>
              <button
                onClick={handleAddToCart}
                disabled={sweet.quantity === 0}
                className={`flex-1 bg-white/20 backdrop-blur-md text-white font-semibold py-2 px-4 rounded-xl border border-white/30 shadow-lg hover:bg-white/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-sm ${sweet.quantity === 0 ? 'bg-neutral-500/50 hover:bg-neutral-500/50' : ''}`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
