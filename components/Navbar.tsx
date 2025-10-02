
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Logo from './icons/Logo';
import CartModal from './CartModal';
import { Globe, ChevronDown, LogIn, LogOut, Loader, ShoppingCart, UserCog, FileText } from 'lucide-react';

const Navbar: React.FC = () => {
  const { language, setLanguage, t, dir } = useLocalization();
  const { user, login, logout, loading } = useAuth();
  const { totalItems } = useCart();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  const navLinks = [
    { to: '/', text: t('home') },
    { to: '/store', text: t('store') },
    { to: '/rules', text: t('rules') },
    { to: '/applies', text: t('applies') },
    { to: '/about', text: t('about_us') },
  ];

  const activeLinkStyle = {
    color: '#00f2ea',
    textShadow: '0 0 8px rgba(0, 242, 234, 0.7)',
  };

  return (
    <>
      <nav className="bg-brand-dark-blue/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo className="h-10 w-10" />
            <h1 className="text-xl font-bold text-white tracking-wider hidden md:block">HORIZON</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-gray-300 hover:text-brand-cyan transition-colors duration-300 font-medium"
                style={({ isActive }) => isActive ? activeLinkStyle : {}}
              >
                {link.text}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-gray-300 hover:text-brand-cyan transition-colors"
              aria-label={t('your_cart')}
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -end-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-cyan text-xs font-bold text-brand-dark">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                onBlur={() => setTimeout(() => setLangDropdownOpen(false), 200)}
                className="flex items-center gap-2 text-gray-300 hover:text-brand-cyan transition-colors"
              >
                <Globe size={20} />
                <span className="uppercase">{language}</span>
                <ChevronDown size={16} className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {langDropdownOpen && (
                <div className="absolute top-full mt-2 end-0 bg-brand-light-blue rounded-md shadow-lg py-1 w-24">
                  <button onClick={() => setLanguage('en')} className="block w-full text-start px-4 py-2 text-sm text-white hover:bg-brand-cyan/20">English</button>
                  <button onClick={() => setLanguage('ar')} className="block w-full text-start px-4 py-2 text-sm text-white hover:bg-brand-cyan/20">العربية</button>
                </div>
              )}
            </div>
            <div className="w-px h-6 bg-gray-600"></div>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                  className="flex items-center gap-2"
                >
                  <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full border-2 border-brand-cyan" />
                  <span className="text-white font-medium hidden sm:inline">{user.username}</span>
                   <ChevronDown size={16} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {userDropdownOpen && (
                   <div className="absolute top-full mt-2 end-0 bg-brand-light-blue rounded-md shadow-lg py-1 w-48">
                     <Link to="/my-applications" className="flex items-center gap-2 w-full text-start px-4 py-2 text-sm text-white hover:bg-brand-cyan/20">
                       <FileText size={16} />
                       {t('my_applications')}
                     </Link>
                     {user.isAdmin && (
                       <Link to="/admin" className="flex items-center gap-2 w-full text-start px-4 py-2 text-sm text-white hover:bg-brand-cyan/20">
                         <UserCog size={16} />
                         {t('admin_panel')}
                       </Link>
                     )}
                     <button onClick={logout} className="flex items-center gap-2 w-full text-start px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">
                       <LogOut size={16} />
                       {t('logout')}
                     </button>
                   </div>
                )}
              </div>
            ) : (
              <button
                onClick={login}
                disabled={loading}
                className="bg-brand-cyan text-brand-dark font-bold py-2 px-4 rounded-md hover:bg-white hover:shadow-glow-cyan transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {loading ? (
                    <Loader size={20} className="animate-spin" />
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>{t('login_discord')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>
      <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
