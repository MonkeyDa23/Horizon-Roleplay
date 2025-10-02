
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useCart } from '../hooks/useCart';
import { X, Trash2, ShoppingBag } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLocalization();
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-brand-dark-blue w-full max-w-lg h-full flex flex-col shadow-2xl shadow-black/50 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-brand-light-blue flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-cyan flex items-center gap-3">
            <ShoppingBag size={28}/>
            {t('your_cart')} ({totalItems})
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-xl text-gray-400">{t('empty_cart')}</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.imageUrl} alt={t(item.nameKey)} className="w-20 h-20 rounded-md object-cover" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white">{t(item.nameKey)}</h3>
                  <p className="text-brand-cyan font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                    className="w-16 bg-brand-light-blue text-white text-center rounded-md border border-gray-600 focus:ring-brand-cyan focus:border-brand-cyan"
                  />
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-brand-light-blue space-y-4">
            <div className="flex justify-between items-center text-xl">
              <span className="text-gray-300">{t('subtotal')}:</span>
              <span className="font-bold text-white">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-brand-cyan text-brand-dark font-bold py-4 rounded-lg shadow-glow-cyan hover:bg-white transition-all duration-300">
              {t('checkout')}
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CartModal;
