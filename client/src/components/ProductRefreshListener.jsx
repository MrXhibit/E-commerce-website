/**
 * Component that listens for product addition events from admin panel
 * and triggers refresh of user-side product data
 */

import { useEffect } from 'react';
import { useProductRefresh } from '../hooks/useProductRefresh';

const ProductRefreshListener = ({ onProductAdded }) => {
  const { refreshAllProducts } = useProductRefresh();

  useEffect(() => {
    const handleProductAdded = async (event) => {
      const { product, category, categoryId } = event.detail;
      
      console.log('Product added event received:', { product, category, categoryId });
      
      try {
        // Refresh all products to ensure the new product appears
        const refreshedProducts = await refreshAllProducts(100, 0);
        console.log('Products refreshed after new product addition:', refreshedProducts.length);
        
        // Call the callback if provided
        if (onProductAdded) {
          onProductAdded({
            product,
            category,
            categoryId,
            refreshedProducts
          });
        }
        
        // Optional: Show a notification to users
        if (window.showNotification) {
          window.showNotification({
            type: 'info',
            message: `New product "${product.name}" has been added to ${category}!`,
            duration: 5000
          });
        }
        
      } catch (error) {
        console.error('Error refreshing products after addition:', error);
      }
    };

    // Listen for product addition events
    window.addEventListener('productAdded', handleProductAdded);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('productAdded', handleProductAdded);
    };
  }, [refreshAllProducts, onProductAdded]);

  // This component doesn't render anything
  return null;
};

export default ProductRefreshListener;
