import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';

const ProductSearch = ({ onSearch, categories = [], loading = false, initialFilters = {} }) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [selectedBrand, setSelectedBrand] = useState(initialFilters.brand || '');
  const [priceRange, setPriceRange] = useState([initialFilters.minPrice || 0, initialFilters.maxPrice || 5000]);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder || 'desc');
  const [showFilters, setShowFilters] = useState(false);

  // Common brands (you can fetch this from backend)
  const brands = [
    'Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Dell', 'HP', 'Canon',
    'LG', 'Microsoft', 'Google', 'Amazon', 'Lenovo', 'Asus', 'Levi\'s',
    'Ralph Lauren', 'Under Armour', 'Puma', 'New Balance', 'Reebok'
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'createdAt', label: 'Date Added' },
    { value: 'rating', label: 'Rating' }
  ];

  const handleSearch = () => {
    const filters = {
      query: searchQuery,
      category: selectedCategory,
      brand: selectedBrand,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy,
      sortOrder,
      limit: 20,
      skip: 0
    };
    onSearch(filters);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange([0, 5000]);
    setSortBy('createdAt');
    setSortOrder('desc');
    onSearch({
      limit: 20,
      skip: 0
    });
  };

  // Auto-search when query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2 || searchQuery.length === 0) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Search when filters change
  useEffect(() => {
    handleSearch();
  }, [selectedCategory, selectedBrand, priceRange, sortBy, sortOrder]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedBrand) count++;
    if (priceRange[0] > 0 || priceRange[1] < 5000) count++;
    return count;
  }, [selectedCategory, selectedBrand, priceRange]);

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* Main Search Bar */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() => setSearchQuery('')}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <ClearIcon fontSize="small" />
                  </Button>
                </InputAdornment>
              )
            }}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" gap={1} alignItems="center">
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              disabled={loading}
            >
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="text"
                size="small"
                onClick={handleClearFilters}
                disabled={loading}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      {showFilters && (
        <Box mt={3}>
          <Grid container spacing={3}>
            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id || category.name} value={category._id || category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Brand Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={selectedBrand}
                  label="Brand"
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="">All Brands</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort By */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  disabled={loading}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort Order */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Price Range */}
            <Grid item xs={12}>
              <Typography gutterBottom>Price Range: ${priceRange[0]} - ${priceRange[1]}</Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={5000}
                step={50}
                disabled={loading}
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>Active Filters:</Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {selectedCategory && (
                  <Chip
                    label={`Category: ${selectedCategory}`}
                    onDelete={() => setSelectedCategory('')}
                    size="small"
                  />
                )}
                {selectedBrand && (
                  <Chip
                    label={`Brand: ${selectedBrand}`}
                    onDelete={() => setSelectedBrand('')}
                    size="small"
                  />
                )}
                {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                  <Chip
                    label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
                    onDelete={() => setPriceRange([0, 5000])}
                    size="small"
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default ProductSearch;