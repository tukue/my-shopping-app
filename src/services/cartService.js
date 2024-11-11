// Cart service implementation
// Cart service to manage shopping cart operations
class CartService {
  constructor() {
    this.cart = [];
  }

  // Add item to cart
  addToCart(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
    }
  }

  // Remove item from cart
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
  }

  // Update quantity of item in cart
  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  // Get cart contents
  getCart() {
    return this.cart;
  }

  // Calculate total price
  getTotal() {
    return this.cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Clear cart
  clearCart() {
    this.cart = [];
  }
}