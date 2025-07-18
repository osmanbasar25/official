import React, { useState, useEffect, createContext, useContext } from 'react';

// Tailwind CSS is assumed to be available in the environment.
// No explicit import needed for Tailwind classes.

// Context for managing the shopping cart
const CartContext = createContext();

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-fidelity sound with comfortable earcups and long battery life.',
    price: 99.99,
    imageUrl: 'https://placehold.co/300x200/F0F4F8/333?text=Headphones',
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Smartwatch with Heart Rate Monitor',
    description: 'Track your fitness, receive notifications, and monitor your health.',
    price: 149.99,
    imageUrl: 'https://placehold.co/300x200/F0F4F8/333?text=Smartwatch',
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'Portable Power Bank 10000mAh',
    description: 'Keep your devices charged on the go with this compact power bank.',
    price: 29.99,
    imageUrl: 'https://placehold.co/300x200/F0F4F8/333?text=Power+Bank',
    category: 'Accessories',
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    description: 'Designed for comfort and support during long working hours.',
    price: 249.99,
    imageUrl: 'https://placehold.co/300x200/F0F4F8/333?text=Office+Chair',
    category: 'Home & Office',
  },
  {
    id: '5',
    name: '4K Ultra HD Smart TV 55-inch',
    description: 'Immersive viewing experience with vibrant colors and smart features.',
    price: 799.99,
    imageUrl: 'https://placehold.co/300x200/F0F4F8/333?text=Smart+TV',
    category: 'Electronics',
  },
  {
    id: '6',
    name: 'Stainless Steel Water Bottle',
    description: 'Durable and insulated to keep your drinks cold or hot for hours.',
    price: 19.99,
    imageUrl: 'https://placehold.co/300x200/F0F4F8/333?text=Water+Bottle',
    category: 'Kitchen',
  },
  {
    id: '7',
    name: 'Gaming Keyboard RGB Backlit',
    description: 'Mechanical keys with customizable RGB lighting for an enhanced gaming experience.',
    price: 79.99,
    imageUrl: 'https://placehold.co/300x200/F0F4F8/333?text=Gaming+Keyboard',
    category: 'Electronics',
  },
  {
    id: '8',
    name: 'Noise-Cancelling Earbuds',
    description: 'Compact and powerful earbuds with active noise cancellation.',
    price: 129.99,
    imageUrl: 'https://placehold.co/300x200/F0F4F8/333?text=Earbuds',
    category: 'Electronics',
  },
];

// Cart Provider component to manage cart state
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Function to add an item to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    showTempNotification(`${product.name} added to cart!`);
    setIsCartOpen(true); // Open cart when item is added
  };

  // Function to remove an item from the cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    showTempNotification('Item removed from cart.');
  };

  // Function to update item quantity in the cart
  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  // Function to clear the cart
  const clearCart = () => {
    setCartItems([]);
    showTempNotification('Cart cleared.');
  };

  // Function to show a temporary notification
  const showTempNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    const timer = setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
    }, 3000); // Notification disappears after 3 seconds
    return () => clearTimeout(timer);
  };

  // Calculate total price of items in the cart
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        showTempNotification,
      }}
    >
      {children}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up">
          {notificationMessage}
        </div>
      )}
    </CartContext.Provider>
  );
};

// Notification component (can be reused)
const Notification = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
      <span>{message}</span>
      <button onClick={onClose} className="text-white font-bold text-xl leading-none">&times;</button>
    </div>
  );
};

// Product Card component
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover object-center rounded-t-xl"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/300x200/F0F4F8/333?text=${encodeURIComponent(product.name)}`;
        }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 flex-grow">{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Product Listing component
const ProductList = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
      {products.length > 0 ? (
        products.map((product) => <ProductCard key={product.id} product={product} />)
      ) : (
        <div className="col-span-full text-center text-gray-600 text-lg py-10">
          No products found. Try a different search!
        </div>
      )}
    </div>
  );
};

// Search Bar component
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="p-6 bg-gray-50 shadow-inner rounded-b-xl">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-3 pl-10 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm text-gray-700"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left 12px center', backgroundSize: '20px' }}
      />
    </div>
  );
};

// Cart Sidebar component
const CartSidebar = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, setIsCartOpen, showTempNotification } = useContext(CartContext);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showTempNotification('Your cart is empty!');
      return;
    }
    // Simulate payment processing
    showTempNotification('Processing payment...');
    setTimeout(() => {
      showTempNotification('Payment successful! Your order has been placed.');
      clearCart();
      setIsCartOpen(false);
    }, 2000); // Simulate 2-second payment processing
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none"
            >
              &times;
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-2">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/64x64/F0F4F8/333?text=Item`;
                    }}
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm">${item.price.toFixed(2)} x {item.quantity}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l-md hover:bg-gray-300 transition"
                      >
                        -
                      </button>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r-md hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 ml-4 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-extrabold text-indigo-600">${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-full shadow-md transition duration-300 ease-in-out"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Main App component
const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { setIsCartOpen, cartItems } = useContext(CartContext);

  useEffect(() => {
    // Simulate fetching products from an API
    const fetchProducts = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockProducts);
        }, 500); // Simulate network delay
      });
    };

    fetchProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, []);

  const handleSearch = (searchTerm) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedSearchTerm) ||
        product.description.toLowerCase().includes(lowercasedSearchTerm) ||
        product.category.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredProducts(filtered);
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            <a href="#" className="hover:text-indigo-800 transition duration-200">ShopSphere</a>
          </h1>
          <nav>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8">
        <SearchBar onSearch={handleSearch} />
        <ProductList products={filteredProducts} />
      </main>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 text-center mt-auto">
        <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Wrap the App with CartProvider
const AppWrapper = () => (
  <CartProvider>
    <App />
  </CartProvider>
);

export default AppWrapper;
