import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist } from "../../store/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [actionLoading, setActionLoading] = useState({});

  const handleAddToCart = async (productId, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: "Please login to add items to cart", severity: "warning" });
      return;
    }
    setActionLoading((prev) => ({ ...prev, [`cart-${productId}`]: true }));
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      setSnackbar({ open: true, message: "Added to cart successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to add to cart", severity: "error" });
    } finally {
      setActionLoading((prev) => ({ ...prev, [`cart-${productId}`]: false }));
    }
  };

  const handleAddToWishlist = async (productId, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: "Please login to add items to wishlist", severity: "warning" });
      return;
    }
    setActionLoading((prev) => ({ ...prev, [`wishlist-${productId}`]: true }));
    try {
      await dispatch(addToWishlist(productId)).unwrap();
      setSnackbar({ open: true, message: "Added to wishlist successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to add to wishlist", severity: "error" });
    } finally {
      setActionLoading((prev) => ({ ...prev, [`wishlist-${productId}`]: false }));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  return (
    <Box sx={{ px: 2 }}>
      <Card
        sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: 2 }}
        onClick={() => navigate(`/product/${product._id || product.id}`)}
      >
        <CardMedia
          component="img"
          height="180"
          image={product.images?.[0]?.url || "https://source.unsplash.com/featured/?product"}
          alt={product.name}
        />
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${product.price}
          </Typography>
        </CardContent>
        <CardActions sx={{ mt: "auto" }}>
          <Button
            size="small"
            variant="contained"
            endIcon={<ShoppingCartIcon />}
            onClick={(e) => handleAddToCart(product._id || product.id, e)}
            disabled={actionLoading[`cart-${product._id || product.id}`]}
          >
            {actionLoading[`cart-${product._id || product.id}`] ? "Adding..." : "Add to Cart"}
          </Button>
          <IconButton
            color="primary"
            onClick={(e) => handleAddToWishlist(product._id || product.id, e)}
            disabled={actionLoading[`wishlist-${product._id || product.id}`]}
          >
            {isInWishlist(product._id || product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );
}

export default ProductCard;
