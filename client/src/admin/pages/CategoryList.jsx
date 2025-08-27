import { 
  Box, 
  Table, 
  TableHead, 
  Typography, 
  TableRow, 
  TableCell, 
  TableBody, 
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material";
import { useTheme } from "@mui/material";
import Header from "../components/global/Header";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../hooks/useFetchData";
import RenderRow from "../components/category/RenderRow";
import { Visibility, Edit, Delete, VisibilityOff } from "@mui/icons-material";

function CategoryList() {
  const [data, error] = useFetchData("/category");
  const theme = useTheme();
  const navigate = useNavigate();
  const categories = data?.categories || [];
  
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
      500: "#3b82f6",
      600: "#2563eb",
    },
    greenAccent: {
      500: "#22c55e",
    },
    redAccent: {
      500: "#ef4444",
    },
  };
  
  const handleAddCategory = () => {
    navigate(`/admin/add-category/`);
  };

  // Mock data for demonstration - replace with real data when available
  const mockCategories = [
    {
      id: 1,
      name: "E Electronics",
      parentCategory: "-",
      type: "Main Category",
      products: 245,
      status: "Active",
      initial: "E"
    },
    {
      id: 2,
      name: "S Smartphones",
      parentCategory: "Electronics",
      type: "Sub Category",
      products: 89,
      status: "Active",
      initial: "S"
    },
    {
      id: 3,
      name: "L Laptops",
      parentCategory: "Electronics",
      type: "Sub Category",
      products: 67,
      status: "Active",
      initial: "L"
    },
    {
      id: 4,
      name: "F Fashion",
      parentCategory: "-",
      type: "Main Category",
      products: 156,
      status: "Active",
      initial: "F"
    },
    {
      id: 5,
      name: "M Men's Clothing",
      parentCategory: "Fashion",
      type: "Sub Category",
      products: 78,
      status: "Inactive",
      initial: "M"
    },
    {
      id: 6,
      name: "W Women's Clothing",
      parentCategory: "Fashion",
      type: "Sub Category",
      products: 78,
      status: "Active",
      initial: "W"
    }
  ];

  const getStatusColor = (status) => {
    return status === "Active" ? colors.greenAccent[500] : colors.redAccent[500];
  };

  const getStatusIcon = (status) => {
    return status === "Active" ? <Visibility /> : <VisibilityOff />;
  };

  return (
    <Box sx={{ p: 3, backgroundColor: colors.background.default, minHeight: "100vh" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" sx={{ color: colors.grey[100], fontWeight: 700, mb: 1 }}>
            Categories
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[400] }}>
            Manage your product categories
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
          onClick={handleAddCategory}
        >
          + Add Category
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ backgroundColor: colors.card.main, mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.grey[400] }}>Type</InputLabel>
                <Select
                  defaultValue="all"
                  label="Type"
                  sx={{
                    color: colors.grey[100],
                    "& .MuiSelect-icon": { color: colors.grey[400] },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[500] },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueAccent[500] },
                  }}
                >
                  <MenuItem value="all" sx={{ color: colors.grey[100] }}>All Types</MenuItem>
                  <MenuItem value="main" sx={{ color: colors.grey[100] }}>Main Category</MenuItem>
                  <MenuItem value="sub" sx={{ color: colors.grey[100] }}>Sub Category</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.grey[400] }}>Parent Category</InputLabel>
                <Select
                  defaultValue="all"
                  label="Parent Category"
                  sx={{
                    color: colors.grey[100],
                    "& .MuiSelect-icon": { color: colors.grey[400] },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[500] },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueAccent[500] },
                  }}
                >
                  <MenuItem value="all" sx={{ color: colors.grey[100] }}>All Categories</MenuItem>
                  <MenuItem value="electronics" sx={{ color: colors.grey[100] }}>Electronics</MenuItem>
                  <MenuItem value="fashion" sx={{ color: colors.grey[100] }}>Fashion</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card sx={{ backgroundColor: colors.card.main, borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.card.light }}>
                <TableCell sx={{ color: colors.grey[400], fontWeight: 600, py: 2 }}>
                  Category Name
                </TableCell>
                <TableCell sx={{ color: colors.grey[400], fontWeight: 600, py: 2 }}>
                  Parent Category
                </TableCell>
                <TableCell sx={{ color: colors.grey[400], fontWeight: 600, py: 2 }}>
                  Type
                </TableCell>
                <TableCell sx={{ color: colors.grey[400], fontWeight: 600, py: 2 }}>
                  Products
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
              {mockCategories.map((category) => (
                <TableRow 
                  key={category.id}
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
                          width: 40,
                          height: 40,
                          fontSize: "16px",
                          fontWeight: 600,
                        }}
                      >
                        {category.initial}
                      </Avatar>
                      <Typography sx={{ color: colors.grey[100], fontWeight: 500 }}>
                        {category.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: colors.grey[300], py: 2 }}>
                    {category.parentCategory}
                  </TableCell>
                  <TableCell sx={{ color: colors.grey[300], py: 2 }}>
                    {category.type}
                  </TableCell>
                  <TableCell sx={{ color: colors.grey[100], py: 2, fontWeight: 600 }}>
                    {category.products}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={category.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(category.status),
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
                          color: colors.grey[400],
                          "&:hover": { color: colors.blueAccent[500] },
                        }}
                      >
                        {getStatusIcon(category.status)}
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: colors.grey[400],
                          "&:hover": { color: colors.blueAccent[500] },
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: colors.grey[400],
                          "&:hover": { color: colors.redAccent[500] },
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
          Showing 1 to 6 of 6 entries
        </Typography>
      </Box>
    </Box>
  );
}

export default CategoryList;
