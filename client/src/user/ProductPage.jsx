import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  CircularProgress, 
  Alert, 
  Pagination,
  Paper
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch } from '../store/hooks';
import { fetchCart } from '../store/slices/cartSlice';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import productSearchService from '../services/productSearch.service';
import Header from './Header';
import Footer from './Footer';
import ProductSearch from './components/ProductSearch';
import ProductCard from './components/ProductCard';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const productsPerPage = 20;
  
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load initial data
  useEffect(() => {
    loadInitialData();
    if (user) {
      loadWishlist();
    }
  }, [user]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam || searchParam) {
      const filters = {
        limit: productsPerPage,
        skip: 0
      };
      
      if (categoryParam) {
        filters.category = categoryParam;
      }
      
      if (searchParam) {
        filters.query = searchParam;
      }
      
      handleSearch(filters);
    }
  }, [searchParams]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        productSearchService.getProducts(productsPerPage, 0),
        productSearchService.getCategories().catch(() => ({ data: [] }))
      ]);
      
      setProducts(productsResponse.products || []);
      setCategories(categoriesResponse.products || []);
      setTotalProducts(productsResponse.total || productsResponse.data?.length || 0);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.data?.map(item => item.productId) || []);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const handleSearch = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productSearchService.searchProducts({
        ...filters,
        skip: (currentPage - 1) * productsPerPage
      });
      
      setSearchResults(response.data);
      setProducts(response.products || []);
      setTotalProducts(response.data?.total || 0);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayProducts = searchResults ? searchResults.products : products;

  return (
    <Box>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search Component */}
        <ProductSearch
          onSearch={handleSearch}
          categories={categories}
          loading={loading}
          initialFilters={{
            category: searchParams.get('category') || '',
            query: searchParams.get('search') || ''
          }}
        />

        {/* Results Summary */}
        {searchResults && (
          <Box mb={2}>
            <Typography variant="h6">
              {totalProducts} {totalProducts === 1 ? 'result' : 'results'} found
            </Typography>
          </Box>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Products Grid */}
        {!loading && displayProducts.length > 0 && (
          <Grid container spacing={3}>
            {displayProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard 
                  product={product} 
                  isInWishlist={wishlistItems.includes(product._id)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* No Results */}
        {!loading && !error && displayProducts.length === 0 && (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or browse our categories
            </Typography>
          </Paper>
        )}

        {/* Pagination */}
        {totalProducts > productsPerPage && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(totalProducts / productsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default ProductPage;
