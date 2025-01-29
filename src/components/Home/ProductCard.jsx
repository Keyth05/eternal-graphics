import { useState, Suspense, lazy } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

// Lazy load ProductModal
const ProductModal = lazy(() => import("./ProductModal"));

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Product Card */}
      <Card
        sx={{ width: 320, boxShadow: 3, borderRadius: 2, padding: 2 }}
        className="cursor-pointer"
        onClick={handleOpen}
      >
        <CardMedia
          component="img"
          height="200"
          image={product.img || "https://via.placeholder.com/320x200"}
          alt={product.name}
          sx={{ borderRadius: "8px 8px 0 0", marginBottom: 2 }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {product.name}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="primary" fontWeight="bold">
              ${product.price}
            </Typography>
            <Button variant="contained" color="primary">
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Modal - Suspense wraps around lazy-loaded component */}
      <Suspense fallback={<div>Loading...</div>}>
        {open && <ProductModal open={open} onClose={handleClose} product={product} />}
      </Suspense>
    </>
  );
}
