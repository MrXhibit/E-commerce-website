describe('🛍️ Buy Nest - Complete User Flow E2E Tests', () => {
  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Visit the homepage
    cy.visit('/');
  });

  describe('🔐 User Authentication Flow', () => {
    it('✅ Should complete user registration flow', () => {
      // Navigate to signup page
      cy.visit('/signup');
      
      // Fill registration form
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('testuser@example.com');
      cy.get('[data-testid="password-input"]').type('testpassword123');
      cy.get('[data-testid="phone-input"]').type('1234567890');
      cy.get('[data-testid="address-input"]').type('123 Test Street, Test City');
      
      // Submit form
      cy.get('[data-testid="signup-button"]').click();
      
      // Should redirect to homepage after successful registration
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('✅ Should complete user login flow', () => {
      // Navigate to login page
      cy.visit('/login');
      
      // Fill login form
      cy.get('[data-testid="email-input"]').type(Cypress.env('testUser').email);
      cy.get('[data-testid="password-input"]').type(Cypress.env('testUser').password);
      
      // Submit form
      cy.get('[data-testid="login-button"]').click();
      
      // Should redirect to homepage after successful login
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('✅ Should handle Google OAuth flow', () => {
      // Navigate to login page
      cy.visit('/login');
      
      // Click Google OAuth button
      cy.get('[data-testid="google-oauth-button"]').click();
      
      // Should redirect to Google OAuth
      cy.url().should('include', 'accounts.google.com');
    });

    it('❌ Should show validation errors for invalid input', () => {
      // Navigate to signup page
      cy.visit('/signup');
      
      // Try to submit empty form
      cy.get('[data-testid="signup-button"]').click();
      
      // Should show validation errors
      cy.get('[data-testid="name-error"]').should('be.visible');
      cy.get('[data-testid="email-error"]').should('be.visible');
      cy.get('[data-testid="password-error"]').should('be.visible');
    });
  });

  describe('🛍️ Product Browsing & Search', () => {
    it('✅ Should display products on homepage', () => {
      cy.visit('/');
      
      // Should show product grid
      cy.get('[data-testid="product-grid"]').should('be.visible');
      cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
    });

    it('✅ Should search products successfully', () => {
      cy.visit('/');
      
      // Search for a product
      cy.get('[data-testid="search-input"]').type('laptop');
      cy.get('[data-testid="search-button"]').click();
      
      // Should show search results
      cy.get('[data-testid="search-results"]').should('be.visible');
      cy.get('[data-testid="product-card"]').should('contain.text', 'laptop');
    });

    it('✅ Should filter products by category', () => {
      cy.visit('/');
      
      // Click on a category
      cy.get('[data-testid="category-menu"]').click();
      cy.get('[data-testid="electronics-category"]').click();
      
      // Should show filtered products
      cy.get('[data-testid="category-title"]').should('contain', 'Electronics');
      cy.get('[data-testid="product-card"]').should('be.visible');
    });

    it('✅ Should sort products by price', () => {
      cy.visit('/');
      
      // Open sort dropdown
      cy.get('[data-testid="sort-dropdown"]').click();
      cy.get('[data-testid="price-low-high"]').click();
      
      // Should sort products by price (low to high)
      cy.get('[data-testid="product-price"]').then(($prices) => {
        const prices = $prices.map((i, el) => parseFloat(el.textContent.replace('$', ''))).get();
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).to.deep.equal(sortedPrices);
      });
    });

    it('✅ Should filter products by price range', () => {
      cy.visit('/');
      
      // Set price range filter
      cy.get('[data-testid="min-price-input"]').type('100');
      cy.get('[data-testid="max-price-input"]').type('500');
      cy.get('[data-testid="apply-price-filter"]').click();
      
      // Should show products within price range
      cy.get('[data-testid="product-price"]').each(($price) => {
        const price = parseFloat($price.text().replace('$', ''));
        expect(price).to.be.at.least(100);
        expect(price).to.be.at.most(500);
      });
    });
  });

  describe('📱 Product Detail Page', () => {
    it('✅ Should display product details correctly', () => {
      // Visit a product page
      cy.visit('/products/1'); // Assuming product ID 1 exists
      
      // Should show product information
      cy.get('[data-testid="product-name"]').should('be.visible');
      cy.get('[data-testid="product-price"]').should('be.visible');
      cy.get('[data-testid="product-description"]').should('be.visible');
      cy.get('[data-testid="product-images"]').should('be.visible');
      cy.get('[data-testid="add-to-cart-button"]').should('be.visible');
    });

    it('✅ Should add product to cart from PDP', () => {
      // Visit a product page
      cy.visit('/products/1');
      
      // Add to cart
      cy.get('[data-testid="add-to-cart-button"]').click();
      
      // Should show success message
      cy.get('[data-testid="cart-success-message"]').should('be.visible');
      
      // Cart count should increase
      cy.get('[data-testid="cart-count"]').should('contain', '1');
    });

    it('✅ Should display product reviews', () => {
      // Visit a product page
      cy.visit('/products/1');
      
      // Should show reviews section
      cy.get('[data-testid="reviews-section"]').should('be.visible');
      cy.get('[data-testid="review-item"]').should('have.length.greaterThan', 0);
    });

    it('✅ Should add product review', () => {
      // Login first
      cy.login(Cypress.env('testUser').email, Cypress.env('testUser').password);
      
      // Visit a product page
      cy.visit('/products/1');
      
      // Add review
      cy.get('[data-testid="review-rating"]').click();
      cy.get('[data-testid="review-comment"]').type('Great product!');
      cy.get('[data-testid="submit-review-button"]').click();
      
      // Should show success message
      cy.get('[data-testid="review-success-message"]').should('be.visible');
    });
  });

  describe('🛒 Shopping Cart Operations', () => {
    beforeEach(() => {
      // Login and add product to cart
      cy.login(Cypress.env('testUser').email, Cypress.env('testUser').password);
      cy.visit('/products/1');
      cy.get('[data-testid="add-to-cart-button"]').click();
    });

    it('✅ Should view cart contents', () => {
      cy.visit('/cart');
      
      // Should show cart items
      cy.get('[data-testid="cart-items"]').should('be.visible');
      cy.get('[data-testid="cart-item"]').should('have.length.greaterThan', 0);
      cy.get('[data-testid="cart-total"]').should('be.visible');
    });

    it('✅ Should update product quantity in cart', () => {
      cy.visit('/cart');
      
      // Increase quantity
      cy.get('[data-testid="quantity-increase"]').click();
      
      // Quantity should be 2
      cy.get('[data-testid="quantity-display"]').should('contain', '2');
      
      // Total should be updated
      cy.get('[data-testid="cart-total"]').should('not.contain', '0.00');
    });

    it('✅ Should remove product from cart', () => {
      cy.visit('/cart');
      
      // Remove item
      cy.get('[data-testid="remove-item-button"]').click();
      
      // Should show empty cart message
      cy.get('[data-testid="empty-cart-message"]').should('be.visible');
    });

    it('✅ Should apply coupon code', () => {
      cy.visit('/cart');
      
      // Apply coupon
      cy.get('[data-testid="coupon-input"]').type('SAVE20');
      cy.get('[data-testid="apply-coupon-button"]').click();
      
      // Should show discount applied
      cy.get('[data-testid="discount-applied"]').should('be.visible');
      cy.get('[data-testid="final-total"]').should('be.visible');
    });

    it('✅ Should clear cart', () => {
      cy.visit('/cart');
      
      // Clear cart
      cy.get('[data-testid="clear-cart-button"]').click();
      
      // Confirm clear
      cy.get('[data-testid="confirm-clear-button"]').click();
      
      // Should show empty cart message
      cy.get('[data-testid="empty-cart-message"]').should('be.visible');
    });
  });

  describe('💳 Checkout Process', () => {
    beforeEach(() => {
      // Login and add product to cart
      cy.login(Cypress.env('testUser').email, Cypress.env('testUser').password);
      cy.visit('/products/1');
      cy.get('[data-testid="add-to-cart-button"]').click();
      cy.visit('/cart');
    });

    it('✅ Should complete checkout with COD', () => {
      // Proceed to checkout
      cy.get('[data-testid="proceed-checkout-button"]').click();
      
      // Fill shipping address
      cy.get('[data-testid="shipping-street"]').type('123 Test Street');
      cy.get('[data-testid="shipping-city"]').type('Test City');
      cy.get('[data-testid="shipping-state"]').type('Test State');
      cy.get('[data-testid="shipping-zip"]').type('12345');
      cy.get('[data-testid="shipping-country"]').type('Test Country');
      
      // Select COD payment
      cy.get('[data-testid="cod-payment"]').click();
      
      // Place order
      cy.get('[data-testid="place-order-button"]').click();
      
      // Should redirect to success page
      cy.url().should('include', '/success');
      cy.get('[data-testid="order-success-message"]').should('be.visible');
    });

    it('✅ Should complete checkout with Stripe', () => {
      // Proceed to checkout
      cy.get('[data-testid="proceed-checkout-button"]').click();
      
      // Fill shipping address
      cy.get('[data-testid="shipping-street"]').type('123 Test Street');
      cy.get('[data-testid="shipping-city"]').type('Test City');
      cy.get('[data-testid="shipping-state"]').type('Test State');
      cy.get('[data-testid="shipping-zip"]').type('12345');
      cy.get('[data-testid="shipping-country"]').type('Test Country');
      
      // Select Stripe payment
      cy.get('[data-testid="stripe-payment"]').click();
      
      // Should redirect to Stripe
      cy.get('[data-testid="stripe-checkout"]').should('be.visible');
    });

    it('❌ Should handle checkout validation errors', () => {
      // Proceed to checkout
      cy.get('[data-testid="proceed-checkout-button"]').click();
      
      // Try to place order without filling address
      cy.get('[data-testid="place-order-button"]').click();
      
      // Should show validation errors
      cy.get('[data-testid="shipping-street-error"]').should('be.visible');
      cy.get('[data-testid="shipping-city-error"]').should('be.visible');
    });
  });

  describe('📦 Order Management', () => {
    beforeEach(() => {
      // Login
      cy.login(Cypress.env('testUser').email, Cypress.env('testUser').password);
    });

    it('✅ Should view order history', () => {
      cy.visit('/profile');
      
      // Navigate to orders
      cy.get('[data-testid="orders-tab"]').click();
      
      // Should show order history
      cy.get('[data-testid="order-history"]').should('be.visible');
    });

    it('✅ Should view order details', () => {
      cy.visit('/profile');
      cy.get('[data-testid="orders-tab"]').click();
      
      // Click on an order
      cy.get('[data-testid="order-item"]').first().click();
      
      // Should show order details
      cy.get('[data-testid="order-details"]').should('be.visible');
      cy.get('[data-testid="order-status"]').should('be.visible');
      cy.get('[data-testid="order-items"]').should('be.visible');
    });

    it('✅ Should track order status', () => {
      cy.visit('/profile');
      cy.get('[data-testid="orders-tab"]').click();
      
      // Should show order status
      cy.get('[data-testid="order-status"]').should('be.visible');
      cy.get('[data-testid="tracking-number"]').should('be.visible');
    });
  });

  describe('👤 User Profile Management', () => {
    beforeEach(() => {
      // Login
      cy.login(Cypress.env('testUser').email, Cypress.env('testUser').password);
    });

    it('✅ Should update profile information', () => {
      cy.visit('/profile');
      
      // Edit profile
      cy.get('[data-testid="edit-profile-button"]').click();
      
      // Update name
      cy.get('[data-testid="profile-name-input"]').clear().type('Updated Name');
      
      // Save changes
      cy.get('[data-testid="save-profile-button"]').click();
      
      // Should show success message
      cy.get('[data-testid="profile-update-success"]').should('be.visible');
    });

    it('✅ Should upload profile image', () => {
      cy.visit('/profile');
      
      // Upload image
      cy.get('[data-testid="profile-image-input"]').attachFile('test-image.jpg');
      
      // Should show uploaded image
      cy.get('[data-testid="profile-image"]').should('be.visible');
    });

    it('✅ Should change password', () => {
      cy.visit('/profile');
      
      // Navigate to security tab
      cy.get('[data-testid="security-tab"]').click();
      
      // Change password
      cy.get('[data-testid="current-password"]').type('testpassword123');
      cy.get('[data-testid="new-password"]').type('newpassword123');
      cy.get('[data-testid="confirm-password"]').type('newpassword123');
      
      // Submit
      cy.get('[data-testid="change-password-button"]').click();
      
      // Should show success message
      cy.get('[data-testid="password-change-success"]').should('be.visible');
    });
  });

  describe('🔍 Wishlist Management', () => {
    beforeEach(() => {
      // Login
      cy.login(Cypress.env('testUser').email, Cypress.env('testUser').password);
    });

    it('✅ Should add product to wishlist', () => {
      cy.visit('/products/1');
      
      // Add to wishlist
      cy.get('[data-testid="add-to-wishlist-button"]').click();
      
      // Should show success message
      cy.get('[data-testid="wishlist-success-message"]').should('be.visible');
    });

    it('✅ Should view wishlist', () => {
      cy.visit('/wishlist');
      
      // Should show wishlist items
      cy.get('[data-testid="wishlist-items"]').should('be.visible');
    });

    it('✅ Should remove product from wishlist', () => {
      cy.visit('/wishlist');
      
      // Remove item
      cy.get('[data-testid="remove-wishlist-item"]').first().click();
      
      // Should remove item
      cy.get('[data-testid="wishlist-item"]').should('have.length', 0);
    });
  });

  describe('📱 Responsive Design', () => {
    it('✅ Should work on mobile devices', () => {
      // Set mobile viewport
      cy.viewport('iphone-x');
      
      cy.visit('/');
      
      // Should show mobile menu
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
      
      // Open mobile menu
      cy.get('[data-testid="mobile-menu-button"]').click();
      
      // Should show mobile navigation
      cy.get('[data-testid="mobile-navigation"]').should('be.visible');
    });

    it('✅ Should work on tablet devices', () => {
      // Set tablet viewport
      cy.viewport('ipad-2');
      
      cy.visit('/');
      
      // Should show tablet layout
      cy.get('[data-testid="product-grid"]').should('be.visible');
    });
  });
});
