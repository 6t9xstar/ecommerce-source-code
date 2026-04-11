/**
 * THREE CROWN WEAR - Main JavaScript Logic
 * Security Enhanced & Performance Optimized
 */

// --- SECURITY UTILITIES ---

/**
 * Basic Sanitization to prevent XSS in dynamic content
 */
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Admin Security: Simulated SHA-256 Hashing for sensitive checks
 * This is a client-side representation for the faux-admin system.
 */
async function hashSecure(string) {
  const utf8 = new Uint8Array(new TextEncoder().encode(string));
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- CORE SYSTEM ---

const ThreeCrown = {
  products: JSON.parse(localStorage.getItem('tcw_products') || '[]'),
  categories: JSON.parse(localStorage.getItem('tcw_categories') || '[]'),
  cart: JSON.parse(localStorage.getItem('tcw_cart') || '[]'),

  init() {
    this.createNoiseOverlay();
    this.initCart();
    this.initLucide();
    this.initGSAP();
    this.initSearch();
    this.initWishlist();
    this.updateCartCount();
  },

  createNoiseOverlay() {
    const noise = document.createElement('div');
    noise.className = 'noise-overlay';
    document.body.appendChild(noise);
  },

  initLucide() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  initCart() {
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');

    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.toggleCart(true));
    }

    if (closeCart) {
      closeCart.addEventListener('click', () => this.toggleCart(false));
    }

    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => this.toggleCart(false));
    }
  },

  initSearch() {
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const closeSearch = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');

    if (searchTrigger && searchModal) {
      searchTrigger.addEventListener('click', () => {
        searchModal.classList.remove('hidden');
        gsap.to(searchModal, { opacity: 1, duration: 0.5, onComplete: () => {
          if (searchInput) searchInput.focus();
        }});
      });
    }

    if (closeSearch && searchModal) {
      closeSearch.addEventListener('click', () => {
        gsap.to(searchModal, { opacity: 0, duration: 0.5, onComplete: () => {
          searchModal.classList.add('hidden');
        }});
      });
    }

    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch(searchInput.value);
        }
      });
    }
  },

  performSearch(query) {
    if (!query || query.trim() === '') return;
    const sanitized = encodeURIComponent(query.trim());
    window.location.href = `shop.html?search=${sanitized}`;
  },

  toggleCart(open) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (!drawer || !overlay) return;

    if (open) {
      drawer.style.transform = 'translateX(0)';
      overlay.style.display = 'block';
      this.renderCart();
    } else {
      drawer.style.transform = 'translateX(100%)';
      overlay.style.display = 'none';
    }
  },

  renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = '<p class="text-white/40 text-center py-12 text-sm tracking-widest uppercase">Your Kingdom is empty</p>';
      document.getElementById('cart-total').textContent = '$0.00';
      return;
    }

    container.innerHTML = this.cart.map((item, index) => {
      const product = this.products.find(p => p.id === item.productId);
      if (!product) return '';
      const itemTotal = product.price * item.quantity;
      return `
        <div class="flex gap-4 mb-6 animate-fade-in group">
          <div class="w-20 h-24 overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
             <img src="${product.images[0]}" class="w-full h-full object-cover transition-transform group-hover:scale-110" alt="${sanitizeHTML(product.name)}">
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-xs tracking-widest uppercase mb-1 truncate">${sanitizeHTML(product.name)}</h4>
            <p class="text-[10px] text-white/40 mb-2">${sanitizeHTML(item.size)} / ${sanitizeHTML(item.color)}</p>
            
            <!-- Quantity Controls -->
            <div class="flex items-center gap-3 mb-2">
              <button onclick="ThreeCrown.updateQuantity(${index}, -1)" class="w-6 h-6 border border-white/20 flex items-center justify-center hover:border-white transition-all">
                <i data-lucide="minus" class="w-3 h-3"></i>
              </button>
              <span class="text-xs tracking-widest w-6 text-center">${item.quantity}</span>
              <button onclick="ThreeCrown.updateQuantity(${index}, 1)" class="w-6 h-6 border border-white/20 flex items-center justify-center hover:border-white transition-all">
                <i data-lucide="plus" class="w-3 h-3"></i>
              </button>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm font-display">$${itemTotal.toFixed(2)}</span>
              <button onclick="ThreeCrown.removeFromCart(${index})" class="text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.calculateTotal();
    this.initLucide();
  },

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.renderCart();
    this.updateCartCount();
    ThreeCrown.showToast('Item removed from cart', 'success');
  },

  updateQuantity(index, change) {
    const item = this.cart[index];
    if (!item) return;
    
    const newQty = item.quantity + change;
    if (newQty < 1) {
      this.removeFromCart(index);
      return;
    }
    if (newQty > 10) {
      ThreeCrown.showToast('Maximum quantity reached', 'error');
      return;
    }
    
    item.quantity = newQty;
    this.saveCart();
    this.renderCart();
    this.updateCartCount();
  },

  saveCart() {
    localStorage.setItem('tcw_cart', JSON.stringify(this.cart));
  },

  updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (!countEl) return;
    
    if (this.cart.length > 0) {
      countEl.textContent = this.cart.length;
      countEl.style.display = 'flex';
    } else {
      countEl.style.display = 'none';
    }
  },

  calculateTotal() {
    const totalEl = document.getElementById('cart-total');
    if (!totalEl) return;
    
    const total = this.cart.reduce((sum, item) => {
      const product = this.products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    totalEl.textContent = `$${total.toFixed(2)}`;
  },

  // --- WISHLIST SYSTEM ---
  wishlist: JSON.parse(localStorage.getItem('tcw_wishlist') || '[]'),

  initWishlist() {
    this.updateWishlistCount();
    this.renderWishlistButtons();
  },

  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast('Removed from Wishlist', 'success');
    } else {
      this.wishlist.push(productId);
      this.showToast('Added to Wishlist', 'success');
    }
    this.saveWishlist();
    this.updateWishlistCount();
    this.renderWishlistButtons();
  },

  saveWishlist() {
    localStorage.setItem('tcw_wishlist', JSON.stringify(this.wishlist));
  },

  updateWishlistCount() {
    const countEl = document.getElementById('wishlist-count');
    if (!countEl) return;
    
    if (this.wishlist.length > 0) {
      countEl.textContent = this.wishlist.length;
      countEl.style.display = 'flex';
    } else {
      countEl.style.display = 'none';
    }
  },

  renderWishlistButtons() {
    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      const productId = btn.dataset.productId;
      const isInWishlist = this.wishlist.includes(productId);
      const icon = btn.querySelector('i') || btn;
      
      if (isInWishlist) {
        btn.classList.add('text-red-500');
        btn.classList.remove('text-white/40');
        if (icon) icon.setAttribute('fill', 'currentColor');
      } else {
        btn.classList.remove('text-red-500');
        btn.classList.add('text-white/40');
        if (icon) icon.setAttribute('fill', 'none');
      }
    });
  },

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  },

  initGSAP() {
    if (typeof gsap === 'undefined') return;
    
    // Smooth scroll link behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          gsap.to(window, {
            duration: 1.5,
            scrollTo: target,
            ease: 'power4.inOut'
          });
        }
      });
    });
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `glass-panel px-8 py-4 text-xs tracking-widest uppercase border-l-2 ${
      type === 'success' ? 'border-white' : 'border-red-500'
    }`;
    toast.textContent = message;
    container.appendChild(toast);

    gsap.from(toast, {
      x: 100,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });

    setTimeout(() => {
      gsap.to(toast, {
        x: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in',
        onComplete: () => toast.remove()
      });
    }, 4000);
  }
};

// Start
document.addEventListener('DOMContentLoaded', () => ThreeCrown.init());