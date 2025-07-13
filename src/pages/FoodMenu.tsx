import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Minus, ShoppingCart, Leaf, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import heroImage from '@/assets/restaurant-hero.jpg';
import butterChickenImg from '@/assets/butter-chicken.jpg';
import dalMakhaniImg from '@/assets/dal-makhani.jpg';
import margheritaPizzaImg from '@/assets/margherita-pizza.jpg';
import mangoLassiImg from '@/assets/mango-lassi.jpg';
import gulabJamunImg from '@/assets/gulab-jamun.jpg';
import chickenBiryaniImg from '@/assets/chicken-biryani.jpg';
import paneerTikkaImg from '@/assets/paneer-tikka.jpg';
import limeSodaImg from '@/assets/lime-soda.jpg';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  group: 'food' | 'drink' | 'dessert';
  isVeg: boolean;
  image: string;
}

const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken pieces',
    price: 320,
    category: 'Main Course',
    group: 'food',
    isVeg: false,
    image: butterChickenImg
  },
  {
    id: '2',
    name: 'Dal Makhani',
    description: 'Rich and creamy black lentils slow-cooked to perfection',
    price: 240,
    category: 'Dal',
    group: 'food',
    isVeg: true,
    image: dalMakhaniImg
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
    price: 380,
    category: 'Pizza',
    group: 'food',
    isVeg: true,
    image: margheritaPizzaImg
  },
  {
    id: '4',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt-based drink with fresh mango pulp',
    price: 120,
    category: 'Beverages',
    group: 'drink',
    isVeg: true,
    image: mangoLassiImg
  },
  {
    id: '5',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings in sweet syrup, served warm',
    price: 140,
    category: 'Sweets',
    group: 'dessert',
    isVeg: true,
    image: gulabJamunImg
  },
  {
    id: '6',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with spiced chicken and saffron',
    price: 420,
    category: 'Rice',
    group: 'food',
    isVeg: false,
    image: chickenBiryaniImg
  },
  {
    id: '7',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese marinated in spices and yogurt',
    price: 280,
    category: 'Starter',
    group: 'food',
    isVeg: true,
    image: paneerTikkaImg
  },
  {
    id: '8',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime drink with a hint of mint and spices',
    price: 80,
    category: 'Beverages',
    group: 'drink',
    isVeg: true,
    image: limeSodaImg
  }
];

const categories = ['All', 'Main Course', 'Dal', 'Rice', 'Pizza', 'Starter', 'Beverages', 'Sweets'];
const foodGroups = ['all', 'food', 'drink', 'dessert'] as const;

export default function FoodMenu() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<typeof foodGroups[number]>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = Object.entries(cart).reduce((total, [itemId, count]) => {
    const item = mockFoodItems.find(item => item.id === itemId);
    return total + (item ? item.price * count : 0);
  }, 0);

  const filteredItems = useMemo(() => {
    return mockFoodItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = selectedGroup === 'all' || item.group === selectedGroup;
      const matchesCategory = selectedCategories.includes('All') || 
                             selectedCategories.includes(item.category);
      const matchesVeg = !isVegOnly || item.isVeg;
      
      return matchesSearch && matchesGroup && matchesCategory && matchesVeg;
    });
  }, [searchTerm, selectedGroup, selectedCategories, isVegOnly]);

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const toggleCategory = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      setSelectedCategories(prev => {
        const newCategories = prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev.filter(c => c !== 'All'), category];
        return newCategories.length === 0 ? ['All'] : newCategories;
      });
    }
  };

  const handleCartClick = () => {
    if (cartCount > 0) {
      navigate('/checkout', { state: { cart, items: mockFoodItems } });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Restaurant Interior" 
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 animate-fade-in">
              Delicious Bites
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 animate-slide-up">
              Welcome to a culinary journey of flavors
            </p>
          </div>
        </div>
        
        {/* Search Bar - Positioned at bottom center of hero image */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 w-full max-w-2xl px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-12 py-4 rounded-xl border border-border bg-background/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-lg font-body text-base"
            />
          </div>
        </div>
      </div>

      {/* Filters - moved search to hero section */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 p-4 mt-12">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Veg Toggle */}
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                isVegOnly 
                  ? 'bg-veg text-white border-veg' 
                  : 'bg-card border-border hover:border-veg'
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">Veg Only</span>
            </button>

            {/* Food Groups */}
            <div className="flex bg-card rounded-full p-1 border border-border">
              {foodGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedGroup === group
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {group === 'all' ? 'All' : group.charAt(0).toUpperCase() + group.slice(1)}
                </button>
              ))}
            </div>

            {/* Category Filter Button */}
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 filter-chip"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Categories</span>
            </button>
          </div>

          {/* Selected Categories Display */}
          {!selectedCategories.includes('All') && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(category => (
                <span
                  key={category}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="animate-scale-in">
              {/* Desktop Layout */}
              <div className="hidden sm:block card-food">
                {/* Food Item Image */}
                <div className="w-full h-40 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
                        <div className={item.isVeg ? 'indicator-veg' : 'indicator-non-veg'} />
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="px-2 py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-full">
                          {item.category}
                        </span>
                        <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full">
                          {item.group.charAt(0).toUpperCase() + item.group.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-xl font-bold text-primary">₹{item.price}</p>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex justify-end">
                    {cart[item.id] ? (
                      <div className="flex items-center gap-3 bg-primary/10 rounded-full px-3 py-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="counter-btn"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold min-w-[2rem] text-center">
                          {cart[item.id]}
                        </span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="counter-btn"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id)}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Layout - Horizontal like Zomato */}
              <div className="block sm:hidden card-food-mobile">
                {/* Left Content */}
                <div className="flex-1 space-y-2 pr-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
                    <div className={item.isVeg ? 'indicator-veg' : 'indicator-non-veg'} />
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-full">
                      {item.category}
                    </span>
                    <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full">
                      {item.group.charAt(0).toUpperCase() + item.group.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-xl font-bold text-primary">₹{item.price}</p>
                  
                  {/* Add to Cart Button */}
                  <div className="pt-2">
                    {cart[item.id] ? (
                      <div className="flex items-center gap-3 bg-primary/10 rounded-full px-3 py-2 w-fit">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="counter-btn"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold min-w-[2rem] text-center">
                          {cart[item.id]}
                        </span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="counter-btn"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id)}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Image - Fixed positioning */}
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 self-start">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <button
          onClick={handleCartClick}
          className="floating-cart animate-slide-up"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-medium">View Cart</div>
              <div className="text-xs opacity-90">₹{cartTotal}</div>
            </div>
          </div>
        </button>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-scale-in">
            <h3 className="text-xl font-semibold mb-4">Select Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategories.includes(category)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCategoryModal(false)}
              className="w-full mt-6 btn-secondary"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}