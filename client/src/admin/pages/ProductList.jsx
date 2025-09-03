import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { axiosInstance } from '../utills/axios.instance';
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: 'All Products',
    status: 'All Status',
    price: '$50 - $300',
    store: 'All Store'
  });
  const navigate = useNavigate();

  // Mock data for demonstration (replace with actual API call)
  const mockProducts = [
    {
      id: 1,
      name: 'Gabriela Cashmere Blazer',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=60&h=60&fit=crop',
      purchasePrice: '$113.99',
      products: 1113,
      views: 14912,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Lemon Blend Jacket - Blue',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=60&h=60&fit=crop',
      purchasePrice: '$113.99',
      products: 721,
      views: 15212,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Sandro - Jacket - Black',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=60&h=60&fit=crop',
      purchasePrice: '$113.99',
      products: 407,
      views: 8301,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Adidas By Stella McCartney',
      image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=60&h=60&fit=crop',
      purchasePrice: '$113.99',
      products: 1203,
      views: 1502,
      status: 'Active'
    },
    {
      id: 5,
      name: 'Melton Hooded Wool Jacket',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=60&h=60&fit=crop',
      purchasePrice: '$113.99',
      products: 306,
      views: 867,
      status: 'Active'
    },
    {
      id: 6,
      name: 'Nida Down Ski Jacket - Red',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=60&h=60&fit=crop',
      purchasePrice: '$113.99',
      products: 201,
      views: 456,
      status: 'Active'
    },
    {
      id: 7,
      name: 'Dolce & Gabbana',
      image: 'https://images.unsplash.com/photo-1506629905607-d405872a4d86?w=60&h=60&fit=crop',
      purchasePrice: '$113.99',
      products: 168,
      views: 204,
      status: 'Active'
    }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // For now, use mock data. Replace with actual API call
      setProducts(mockProducts);
      setTotalPages(Math.ceil(mockProducts.length / 10));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleEdit = (product) => {
    console.log('Edit product:', product);
    // Navigate to edit page or open edit modal
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        // await axiosInstance.delete(`/product/${product.id}`);
        console.log('Delete product:', product);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a202c', mb: 1 }}>
          Products
        </Typography>
        <Typography variant="body2" sx={{ color: '#718096' }}>
          Manage your product inventory
        </Typography>
      </Box>

      {/* Search and Add Product */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#a0aec0' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/add-product')}
          sx={{
            backgroundColor: '#667eea',
            '&:hover': { backgroundColor: '#5a67d8' },
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Grid spacing={2} alignItems="center">
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Category</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="All Products">All Products</MenuItem>
                  <MenuItem value="Jackets (132)">Jackets (132)</MenuItem>
                  <MenuItem value="Shirts">Shirts</MenuItem>
                  <MenuItem value="Pants">Pants</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Status</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Price</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.price}
                  onChange={(e) => handleFilterChange('price', e.target.value)}
                >
                  <MenuItem value="$50 - $300">$50 - $300</MenuItem>
                  <MenuItem value="$0 - $50">$0 - $50</MenuItem>
                  <MenuItem value="$300 - $500">$300 - $500</MenuItem>
                  <MenuItem value="$500+">$500+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Store</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.store}
                  onChange={(e) => handleFilterChange('store', e.target.value)}
                >
                  <MenuItem value="All Store">All Store</MenuItem>
                  <MenuItem value="Main Store">Main Store</MenuItem>
                  <MenuItem value="Online Store">Online Store</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f7fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Purchase Unit Price</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Products</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Views</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={product.image}
                        alt={product.name}
                        sx={{ width: 40, height: 40, borderRadius: 1 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {product.purchasePrice}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {product.products.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {product.views.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.status}
                      color={getStatusColor(product.status)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(product)}
                        sx={{ color: '#667eea' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(product)}
                        sx={{ color: '#f56565' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  backgroundColor: '#667eea',
                  color: 'white'
                }
              }
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}

export default ProductList;
