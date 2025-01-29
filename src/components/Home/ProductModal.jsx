import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CardMedia,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
} from "@mui/material";

export default function ProductModal({ open, onClose, product }) {
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value);
    };

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
    };

    // Si no se ha seleccionado ningún color, usar la imagen por defecto del producto
    const imageUrl = selectedColor ? selectedColor.img : product.img;

    // Función para agregar al carrito
    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || []; // Obtener el carrito desde localStorage, si existe
    
        const productToAdd = {
            ...product,
            color: selectedColor || "No color", // Enviar todo el objeto de color
            size: selectedSize || "No size", // Enviar todo el objeto de tamaño
        };
    
        // Enviar el índice del color y el tamaño seleccionados
        const selectedAttributes = {
            color: selectedColor || "No color",
            size: selectedSize || "No size"
        };
        console.log("Selected Attributes:", selectedAttributes);
    
        cart.push(productToAdd); // Agregar el producto al carrito
        localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito actualizado en localStorage
    
        // Puedes añadir un mensaje de confirmación o realizar alguna otra acción aquí.
        console.log("Product added to cart:", productToAdd);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle
                sx={{
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                }}
            >
                {product.name}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    {/* Columna de la imagen */}
                    <Grid item xs={12} md={6} container justifyContent="center">
                        <CardMedia
                            component="img"
                            image={imageUrl || "https://via.placeholder.com/320x200"}
                            alt={product.name}
                            sx={{
                                borderRadius: 2,
                                marginBottom: 2,
                                height: "300px",
                                objectFit: "contain",
                            }}
                        />
                    </Grid>

                    {/* Columna de la información */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" color="primary" fontWeight="bold" align="center">
                            Price: ${product.price}
                        </Typography>

                        {/* Select Color */}
                        <FormControl fullWidth sx={{ marginTop: 2 }}>
                            <InputLabel>Color</InputLabel>
                            <Select
                                value={selectedColor || ""}
                                onChange={handleColorChange}
                                label="Color"
                            >
                                {product.colors.map((color, index) => (
                                    <MenuItem key={index} value={color}>
                                        {color.name || "No name"} {/* Asegura que siempre sea un string */}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Select Size */}
                        <FormControl fullWidth sx={{ marginTop: 2 }}>
                            <InputLabel>Size</InputLabel>
                            <Select
                                value={selectedSize || ""}
                                onChange={handleSizeChange}
                                label="Size"
                            >
                                {product.sizes.map((size, index) => (
                                    size.available && (
                                        <MenuItem key={index} value={size.name}>
                                            {size.name}
                                        </MenuItem>
                                    )
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" sx={{ marginLeft: "auto" }}>
                    Close
                </Button>
                <Button variant="contained" color="primary" sx={{ marginLeft: 1 }} onClick={handleAddToCart}>
                    Add to Cart
                </Button>
            </DialogActions>
        </Dialog>
    );
}
