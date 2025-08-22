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
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import SortIcon from '@mui/icons-material/Sort';

const ProductSearch = ({ onSearch, categories = [], loading = false, initialFilters = {} }) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [selectedBrand, setSelectedBrand] = useState(initialFilters.brand || '');
  const [priceRange, setPriceRange] = useState([initialFilters.minPrice || 0, initialFilters.maxPrice || 5000]);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder || 'desc');
  const [inStockOnly, setInStockOnly] = useState(initialFilters.inStock || false);
  const [showFilters, setShowFilters] = useState(false);

  // Common brands (you can fetch this from backend)
  const brands = [
    'Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Dell', 'HP', 'Canon',
    'LG', 'Microsoft', 'Google', 'Amazon', 'Lenovo', 'Asus', 'Levi\'s',
    'Ralph Lauren', 'Under Armour', 'Puma', 'New Balance', 'Reebok'
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: 'name', label: 'Name: Z to A' },
    { value: 'sales', label: 'Best Selling' }
  ];

  const handleSearch = () => {
    const filters = {
      query: searchQuery,
      category: selectedCategory,
      brand: selectedBrand,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy,
      sortOrder: sortBy === 'price' && sortOrder === 'desc' ? 'desc' : 
                 sortBy === 'price' && sortOrder === 'asc' ? 'asc' : 
                 sortBy === 'name' && sortOrder === 'desc' ? 'desc' : 
                 sortBy === 'name' && sortOrder === 'asc' ? 'asc' : 
                 sortOrder,
      inStock: inStockOnly,
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
    setInStockOnly(false);
    onSearch({
      limit: 20,
      skip: 0
    });
  };

  const handleSortChange = (value) => {
    if (value === 'price') {
      setSortBy('price');
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else if (value === 'name') {
      setSortBy('name');
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortOrder('desc');
    }
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
  }, [selectedCategory, selectedBrand, priceRange, sortBy, sortOrder, inStockOnly]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedBrand) count++;
    if (priceRange[0] > 0 || priceRange[1] < 5000) count++;
    if (inStockOnly) count++;
    if (sortBy !== 'createdAt' || sortOrder !== 'desc') count++;
    return count;
  }, [selectedCategory, selectedBrand, priceRange, inStockOnly, sortBy, sortOrder]);

  const getActiveFilters = () => {
    const filters = [];
    if (selectedCategory) {
      const categoryName = categories.find(cat => cat._id === selectedCategory || cat.name === selectedCategory)?.name || selectedCategory;
      filters.push({ key: 'category', label: `Category: ${categoryName}`, onDelete: () => setSelectedCategory('') });
    }
    if (selectedBrand) {
      filters.push({ key: 'brand', label: `Brand: ${selectedBrand}`, onDelete: () => setSelectedBrand('') });
    }
    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      filters.push({ key: 'price', label: `Price: $${priceRange[0]} - $${priceRange[1]}`, onDelete: () => setPriceRange([0, 5000]) });
    }
    if (inStockOnly) {
      filters.push({ key: 'inStock', label: 'In Stock Only', onDelete: () => setInStockOnly(false) });
    }
    if (sortBy !== 'createdAt' || sortOrder !== 'desc') {
      const sortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || `${sortBy} (${sortOrder})`;
      filters.push({ key: 'sort', label: `Sort: ${sortLabel}`, onDelete: () => { setSortBy('createdAt'); setSortOrder('desc'); } });
    }
    return filters;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* Main Search Bar */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search products by name, description, or brand..."
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

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>Active Filters:</Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {getActiveFilters().map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                onDelete={filter.onDelete}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <Box mt={3}>
          <Divider sx={{ mb: 3 }} />
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
                  value={`${sortBy}-${sortOrder}`}
                  label="Sort By"
                  onChange={(e) => handleSortChange(e.target.value.split('-')[0])}
                  disabled={loading}
                >
                  {sortOptions.map((option, index) => (
                    <MenuItem key={`${option.value}-${index}`} value={`${option.value}-${sortOrder}`}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Stock Availability */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="In Stock Only"
              />
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
        </Box>
      )}
    </Paper>
  );
};

export default ProductSearch;