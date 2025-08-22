import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
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
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFetchData } from '../hooks/useFetchData';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: 'All Status',
    type: 'All Types',
    parent: 'All Categories'
  });
  const navigate = useNavigate();
  const [data, error] = useFetchData("/category");

  // Mock data for demonstration (replace with actual API call)
  const mockCategories = [
    {
      id: 1,
      name: 'Electronics',
      image: { url: 'https://via.placeholder.com/40' },
      parent: null,
      productsCount: 245,
      status: 'Active',
      type: 'Main Category'
    },
    {
      id: 2,
      name: 'Smartphones',
      image: { url: 'https://via.placeholder.com/40' },
      parent: 'Electronics',
      productsCount: 89,
      status: 'Active',
      type: 'Sub Category'
    },
    {
      id: 3,
      name: 'Laptops',
      image: { url: 'https://via.placeholder.com/40' },
      parent: 'Electronics',
      productsCount: 67,
      status: 'Active',
      type: 'Sub Category'
    },
    {
      id: 4,
      name: 'Fashion',
      image: { url: 'https://via.placeholder.com/40' },
      parent: null,
      productsCount: 156,
      status: 'Active',
      type: 'Main Category'
    },
    {
      id: 5,
      name: 'Men\'s Clothing',
      image: { url: 'https://via.placeholder.com/40' },
      parent: 'Fashion',
      productsCount: 78,
      status: 'Inactive',
      type: 'Sub Category'
    },
    {
      id: 6,
      name: 'Women\'s Clothing',
      image: { url: 'https://via.placeholder.com/40' },
      parent: 'Fashion',
      productsCount: 78,
      status: 'Active',
      type: 'Sub Category'
    }
  ];

  useEffect(() => {
    // Use mock data for now, replace with actual API call
    setCategories(mockCategories);
    setTotalPages(Math.ceil(mockCategories.length / 10));
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleEdit = (category) => {
    console.log('Edit category:', category);
    navigate(`/admin/edit-category/${category.id}`);
  };

  const handleDelete = (category) => {
    console.log('Delete category:', category);
    // Add delete logic here
  };

  const handleToggleStatus = (category) => {
    console.log('Toggle status for category:', category);
    // Add toggle status logic here
  };

  const handleAddCategory = () => {
    navigate('/admin/add-category');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { backgroundColor: '#e8f5e8', color: '#2e7d32' };
      case 'inactive':
        return { backgroundColor: '#ffebee', color: '#c62828' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#666' };
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a202c', mb: 1 }}>
            Categories
          </Typography>
          <Typography variant="body2" sx={{ color: '#718096' }}>
            Manage your product categories
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: 300 }}
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
            onClick={handleAddCategory}
            sx={{
              backgroundColor: '#667eea',
              '&:hover': { backgroundColor: '#5a67d8' },
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Status</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Type</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <MenuItem value="All Types">All Types</MenuItem>
                  <MenuItem value="Main Category">Main Category</MenuItem>
                  <MenuItem value="Sub Category">Sub Category</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Parent Category</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.parent}
                  onChange={(e) => handleFilterChange('parent', e.target.value)}
                >
                  <MenuItem value="All Categories">All Categories</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Fashion">Fashion</MenuItem>
                  <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f7fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Category Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Parent Category</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Products</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={category.image?.url}
                        alt={category.name}
                        sx={{ width: 40, height: 40, borderRadius: 1 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {category.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                      {category.parent || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                      {category.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {category.productsCount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.status}
                      size="small"
                      sx={{
                        ...getStatusColor(category.status),
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleStatus(category)}
                        sx={{ 
                          color: category.status === 'Active' ? '#f56565' : '#48bb78',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                        }}
                      >
                        {category.status === 'Active' ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(category)}
                        sx={{ 
                          color: '#667eea',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(category)}
                        sx={{ 
                          color: '#f56565',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          p: 3,
          borderTop: '1px solid #e2e8f0'
        }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                '&.Mui-selected': {
                  backgroundColor: '#667eea',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#5a67d8'
                  }
                }
              }
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}

export default CategoryList;
