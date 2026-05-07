import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, ShoppingCart, MessageCircle, X, Plus, Minus, Trash2 } from 'lucide-react';

import { ChatBot } from './components/ChatBot';

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Data ---
const PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: "Terço de Pérolas Clássico", 
    price: 40.00, 
    description: "Elegância e fé em cada detalhe. Pérolas brancas com entremeio de Nossa Senhora.",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: 2, 
    name: "Terço em Cristal Azul", 
    price: 40.00, 
    description: "Brilho celestial que inspira a oração. Cristais facetados de alta qualidade.",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: 3, 
    name: "Terço de Madeira Rústico", 
    price: 40.00, 
    description: "Simplicidade e conexão. Contas em madeira nobre e crucifixo detalhado.",
    image: "https://images.unsplash.com/photo-1634141677335-ec12a970e303?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: 4, 
    name: "Pulseira Terço de Pérolas", 
    price: 40.00, 
    description: "Leve sua devoção sempre com você. Ajustável e extremamente delicada.",
    image: "https://images.unsplash.com/photo-1573408302185-9127fe589ad5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: 5, 
    name: "Terço de Cristal Boreal", 
    price: 40.00, 
    description: "Reflexos que lembram a luz divina. Ideal para momentos especiais.",
    image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: 6, 
    name: "Dezena de Pote/Carro", 
    price: 40.00, 
    description: "Proteção em seu caminho. Perfeito para pendurar no retrovisor ou presentear.",
    image: "https://images.unsplash.com/photo-1589196931548-43d994e6cb81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
  }
];

const WHATSAPP_NUMBER = "5518991359313";

// --- Helpers ---
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('luxury_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('luxury_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    let message = "Olá! Gostaria de finalizar meu pedido:\n\n";
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}\n`;
    });
    message += `\n*Total: ${formatPrice(cartTotal)}*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen relative font-sans text-brand-dark">
      {/* --- HEADER --- */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="https://www.instagram.com/perolasdefe.tercos/" target="_blank" rel="noreferrer" className="text-brand-dark hover:text-brand-gold transition-colors">
            <Instagram size={20} />
          </a>
          
          <div className="flex flex-col items-center justify-center">
            <span className="font-serif text-3xl tracking-[0.15em] uppercase font-semibold text-brand-dark leading-none">
              Pérolas
            </span>
            <span className="font-cursive text-3xl text-brand-gold leading-none mt-0">
              de Fé
            </span>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className=" relative text-brand-dark hover:text-brand-gold transition-colors"
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-dark text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/Banner.webp" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center opacity-70"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1533470192478-9897d90d5ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
              e.currentTarget.onerror = null;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-light/30 via-brand-light/20 to-brand-light"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-3xl px-6 mt-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.3em] font-medium text-brand-gold mb-6"
          >
            "O Amor Jamais Passará" - 1 Coríntios 13:8
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl mb-8 leading-tight font-light"
          >
            Sua fé, <br/>elevada com devoção.
          </motion.h2>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
            className="bg-brand-dark text-white px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-brand-gold transition-colors duration-300"
          >
            Descobrir a Coleção
          </motion.button>
        </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="font-serif text-3xl md:text-4xl font-light mb-4 text-brand-dark">Coleção Sagrada</h3>
          <div className="h-[1px] w-16 bg-brand-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button 
                  onClick={() => addToCart(product)}
                  className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm text-brand-dark py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-xs tracking-widest uppercase font-semibold hover:text-brand-gold"
                >
                  Adicionar
                </button>
              </div>
              <h4 className="font-serif text-lg font-medium mb-2">{product.name}</h4>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed font-light">{product.description}</p>
              <p className="font-medium mt-auto">{formatPrice(product.price)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-brand-dark text-white py-16 text-center border-t border-brand-dark/10">
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="font-serif text-3xl tracking-[0.15em] uppercase font-semibold text-white leading-none">
            Pérolas
          </span>
          <span className="font-cursive text-3xl text-brand-gold leading-none mt-0">
            de Fé
          </span>
        </div>
        <div className="flex justify-center gap-6 mb-8">
          <a href="https://www.instagram.com/perolasdefe.tercos/" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors"><Instagram size={20} /></a>
        </div>
        <p className="text-xs text-gray-400 font-light tracking-wider">&copy; {new Date().getFullYear()} Pérolas de Fé. Todos os direitos reservados.</p>
      </footer>

      {/* --- FLOATING ELEMENTS --- */}
      <div className="fixed bottom-6 right-6 z-30">
        <a 
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Estava navegando no site e me encantei com os terços. Gostaria de tirar algumas dúvidas e conhecer os modelos disponíveis. 🙏✨')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20b858] transition-colors relative"
        >
          <span className="absolute inset-0 w-full h-full rounded-full bg-[#25D366] opacity-40 animate-ping"></span>
          <MessageCircle size={28} className="relative z-10" />
        </a>
      </div>
      
      <button 
        onClick={() => setIsConsultantOpen(true)}
        className="fixed bottom-6 left-6 z-30 flex items-center gap-2 bg-white p-2 pr-4 rounded-full shadow-lg border-2 border-[#0A2B4E] cursor-pointer hover:shadow-xl transition-all max-w-[180px] md:max-w-none"
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-light flex-shrink-0 flex items-center justify-center overflow-hidden border border-brand-dark/10">
          <img src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Consultora" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] md:text-xs font-medium text-[#0A2B4E] leading-tight">Fale com a Consultora</span>
        </div>
      </button>

      <ChatBot isOpen={isConsultantOpen} onClose={() => setIsConsultantOpen(false)} />

      {/* --- CART OVERLAY & SIDEBAR --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 cursor-pointer"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-serif text-xl">Sua Sacola</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-brand-dark transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <ShoppingCart size={48} className="opacity-20" />
                    <p className="font-light">Sua sacola está vazia.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <h4 className="font-medium text-sm font-serif leading-tight">{item.name}</h4>
                          <p className="text-brand-gold text-sm mt-1 mb-auto">{formatPrice(item.price)}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-200 text-sm">
                              <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-gray-500 hover:text-brand-dark transition-colors"><Minus size={14} /></button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-gray-500 hover:text-brand-dark transition-colors"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-brand-light/50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 uppercase tracking-widest text-xs font-semibold">Subtotal</span>
                    <span className="font-serif text-2xl font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-brand-dark text-white py-4 uppercase tracking-widest text-xs font-semibold hover:bg-brand-gold transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Finalizar Pedido
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
