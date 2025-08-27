import React, { useState, useEffect } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { useTheme } from "@mui/material";
import Header from "../components/global/Header";

import {
  Box,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Grid,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Search, Edit, Delete } from "@mui/icons-material";

export default function ProductList() {
  const navigate = useNavigate();
  let [productUrl, setProductUrl] = useState("/product");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const theme = useTheme();
  
  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
    },
    background: {
      default: "#0f172a",
    },
    card: {
      main: "#2D3748",
      light: "#374151",
    },
    blueAccent: {
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
    },
    greenAccent: {
      500: "#22c55e",
    },
    redAccent: {
      400: "#f87171",
      500: "#ef4444",
    },
  };
  
  const [allCategories, setAllCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [categoryData, categoryError] = useFetchData("/category");
  const [productData, productError] = useFetchData(productUrl);
  const categories = categoryData?.categories || [];
  const products = productData?.products || [];

  useEffect(() => {
    if (categories.length > 0) {
      const flat = flattenCategoriesByLevel(categories);
      setAllCategories(flat);
      const level0 = flat.filter((cat) => cat.level === 0);
      setLevels([level0]);
    }
  }, [categories]);

  const flattenCategoriesByLevel = (categories, level = 0, path = []) => {
    return categories.flatMap((cat) => {
      const currentPath = [...path, { id: cat.id, name: cat.name }];
      const flattened = [{ ...cat, level, path: currentPath }];
      if (cat.children && cat.children.length > 0) {
        return [...flattened, ...flattenCategoriesByLevel(cat.children, level + 1, currentPath)];
      }
      return flattened;
    });
  };

  const handleAddProduct = () => {
    navigate(`/admin/add-product`);
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleToggleListStatus = (product) => {
    console.log(product.isListed);
  };

  const handleCategoryChange = (levelIndex, selectedId) => {
    const chosedCategory = levels[levelIndex].find((cat) => cat.id === selectedId);
    if (!chosedCategory) {
      setLevels([allCategories.filter((cat) => cat.level === 0)]);
      setSelectedCategory([]);
      setProductUrl("/product");
      return;
    }
    const newLevels = [...levels.slice(0, levelIndex + 1)];
    const nextLevelOptions = allCategories.filter(
      (cat) => cat.level === levelIndex + 1 && cat.path[levelIndex]?.id === selectedId,
    );
    if (nextLevelOptions.length > 0) {
      newLevels.push(nextLevelOptions);
    }
    setLevels(newLevels);
    const newSelected = [...selectedCategory.slice(0, levelIndex), chosedCategory];
    setSelectedCategory(newSelected);
    setProductUrl(`/product?category=${chosedCategory.id}`);
  };

  // Mock data for demonstration - replace with real data when available
  const mockProducts = [
    {
      id: 1,
      name: "Gabriela Cashmere Blazer",
      category: "Fashion",
      price: 113.99,
      stock: 1113,
      views: 14912,
      status: "Active",
      image: "G"
    },
    {
      id: 2,
      name: "Lemon Blend Jacket - Blue",
      category: "Fashion",
      price: 113.99,
      stock: 721,
      views: 15212,
      status: "Active",
      image: "L"
    },
    {
      id: 3,
      name: "Sandro - Jacket - Black",
      category: "Fashion",
      price: 113.99,
      stock: 407,
      views: 8301,
      status: "Active",
      image: "S"
    },
    {
      id: 4,
      name: "Adidas By Stella McCartney",
      category: "Sports",
      price: 113.99,
      stock: 892,
      views: 12456,
      status: "Active",
      image: "A"
    },
    {
      id: 5,
      name: "Melton Hooded Wool Jacket",
      category: "Fashion",
      price: 113.99,
      stock: 634,
      views: 9876,
      status: "Active",
      image: "M"
    },
    {
      id: 6,
      name: "Nida Down Ski Jacket - Red",
      category: "Sports",
      price: 113.99,
      stock: 445,
      views: 7654,
      status: "Active",
      image: "N"
    },
    {
      id: 7,
      name: "Dolce & Gabbana",
      category: "Fashion",
      price: 113.99,
      stock: 556,
      views: 11234,
      status: "Active",
      image: "D"
    }
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: colors.background.default, minHeight: "100vh" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" sx={{ color: colors.grey[100], fontWeight: 700, mb: 1 }}>
            Products
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[400] }}>
            Manage your product inventory
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.blueAccent[500],
            color: colors.grey[100],
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: colors.blueAccent[600],
            }
          }}
          onClick={handleAddProduct}
        >
          + Add Product
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ backgroundColor: colors.card.main, mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {/* Search Bar */}
          <Box mb={3}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: colors.grey[400] }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: colors.grey[100],
                  "& fieldset": { borderColor: colors.grey[600] },
                  "&:hover fieldset": { borderColor: colors.grey[500] },
                  "&.Mui-focused fieldset": { borderColor: colors.blueAccent[500] },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: colors.grey[400],
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Category Filters */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.grey[400] }}>Category</InputLabel>
                <Select
                  defaultValue="all"
                  label="Category"
                  sx={{
                    color: colors.grey[100],
                    "& .MuiSelect-icon": { color: colors.grey[400] },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[500] },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueAccent[500] },
                  }}
                >
                  <MenuItem value="all" sx={{ color: colors.grey[100] }}>All Products</MenuItem>
                  <MenuItem value="fashion" sx={{ color: colors.grey[100] }}>Fashion</MenuItem>
                  <MenuItem value="electronics" sx={{ color: colors.grey[100] }}>Electronics</MenuItem>
                  <MenuItem value="sports" sx={{ color: colors.grey[100] }}>Sports</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.grey[400] }}>Status</InputLabel>
                <Select
                  defaultValue="all"
                  label="Status"
                  sx={{
                    color: colors.grey[100],
                    "& .MuiSelect-icon": { color: colors.grey[400] },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[500] },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueAccent[500] },
                  }}
                >
                  <MenuItem value="all" sx={{ color: colors.grey[100] }}>All Status</MenuItem>
                  <MenuItem value="active" sx={{ color: colors.grey[100] }}>Active</MenuItem>
                  <MenuItem value="inactive" sx={{ color: colors.grey[100] }}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.grey[400] }}>Price</InputLabel>
                <Select
                  defaultValue="50-300"
                  label="Price"
                  sx={{
                    color: colors.grey[100],
                    "& .MuiSelect-icon": { color: colors.grey[400] },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[500] },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueAccent[500] },
                  }}
                >
                  <MenuItem value="50-300" sx={{ color: colors.grey[100] }}>$50 - $300</MenuItem>
                  <MenuItem value="300-500" sx={{ color: colors.grey[100] }}>$300 - $500</MenuItem>
                  <MenuItem value="500+" sx={{ color: colors.grey[100] }}>$500+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.grey[400] }}>Store</InputLabel>
                <Select
                  defaultValue="all"
                  label="Store"
                  sx={{
                    color: colors.grey[100],
                    "& .MuiSelect-icon": { color: colors.grey[400] },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[500] },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueAccent[500] },
                  }}
                >
                  <MenuItem value="all" sx={{ color: colors.grey[100] }}>All Store</MenuItem>
                  <MenuItem value="main" sx={{ color: colors.grey[100] }}>Main Store</MenuItem>
                  <MenuItem value="outlet" sx={{ color: colors.grey[100] }}>Outlet</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card sx={{ backgroundColor: colors.card.main, borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.card.light }}>
                <TableCell sx={{ color: colors.grey[400], fontWeight: 600, py: 2 }}>
                  Product Name
                </TableCell>
                <TableCell sx={{ color: colors.grey[400], fontWeight: 600, py: 2 }}>
                  Purchase Unit Price
                </TableCell>
                <TableCell sx={{ color: colors.grey[400], fontWeight: 600, py: 2 }}>
                  Products
                </TableCell>
                <TableCell sx={{ color: colors.grey[400], fontWeight: 600, py: 2 }}>
                  Views
                </TableCell>
                <TableCell sx={{ color: colors.grey[400], fontWeight: 600, py: 2 }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: colors.grey[400], fontWeight: 600, py: 2 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow
                  key={product.id}
                  sx={{
                    "&:hover": { backgroundColor: colors.card.light },
                    borderBottom: `1px solid ${colors.grey[700]}`,
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          backgroundColor: colors.grey[600],
                          color: colors.grey[100],
                          width: 48,
                          height: 48,
                          fontSize: "18px",
                          fontWeight: 600,
                        }}
                      >
                        {product.image}
                      </Avatar>
                      <Typography sx={{ color: colors.grey[100], fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: colors.grey[100], py: 2, fontWeight: 600 }}>
                    ${product.price}
                  </TableCell>
                  <TableCell sx={{ color: colors.grey[100], py: 2, fontWeight: 600 }}>
                    {product.stock.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: colors.grey[100], py: 2, fontWeight: 600 }}>
                    {product.views.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={product.status}
                      size="small"
                      sx={{
                        backgroundColor: colors.greenAccent[500],
                        color: colors.grey[100],
                        fontWeight: 600,
                        borderRadius: "16px",
                        px: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        sx={{
                          color: colors.blueAccent[400],
                          "&:hover": { backgroundColor: `${colors.blueAccent[500]}20` },
                        }}
                        onClick={() => handleEditProduct(product.id)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: colors.redAccent[400],
                          "&:hover": { backgroundColor: `${colors.redAccent[500]}20` },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Showing 1 to 7 of 7 entries
        </Typography>
      </Box>
    </Box>
  );
}
