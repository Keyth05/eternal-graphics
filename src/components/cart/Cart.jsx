import { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { Typography, Button, Divider, CardMedia } from "@mui/material";

export default function CartDrawer({ open, handleClose }) {
    const [cart, setCart] = useState([]);

    // Cargar el carrito desde localStorage cuando se abre el Drawer
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, [open]); // Solo se ejecuta cuando el Drawer se abre

    // Función para limpiar el carrito
    const clearCart = () => {
        setCart([]); // Limpiar el estado
        localStorage.removeItem("cart"); // Eliminar el carrito del localStorage
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: 500, // Ancho del carrito
                    bgcolor: "background.paper",
                },
            }}
        >
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold">Shopping Cart</Typography>

                {cart.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" mt={2}>
                        Your cart is currently empty!
                    </Typography>
                ) : (
                    <Box mt={2}>
                        {cart.map((item, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Typography variant="body1" fontWeight="bold">{item.name}</Typography>
                                <Typography variant="body2">Color: {item.color?.name || "N/A"}</Typography> {/* Asegurarse de que el color esté definido */}
                                <Typography variant="body2">Size: {item.size}</Typography>
                                <Typography variant="body1" color="primary">${item.price}</Typography>

                                {/* Mostrar imagen según el color */}
                                <CardMedia
                                    component="img"
                                    image={item.color?.img || item.img} // Usar colorImg si está disponible, o fallback a item.img
                                    alt={item.name}
                                    sx={{
                                        borderRadius: 2,
                                        marginBottom: 2,
                                        height: "200px",
                                        objectFit: "contain",
                                    }}
                                />
                                <Divider sx={{ mt: 1 }} />
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Total del carrito */}
                {cart.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="h6" fontWeight="bold">Total:</Typography>
                        <Typography variant="body1" color="primary">
                            ${cart.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
                        </Typography>
                    </Box>
                )}

                {/* Botones de cerrar y limpiar */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button onClick={handleClose} variant="contained" color="secondary">
                        Close
                    </Button>
                    {
                        cart.length > 0 && (
                            <Button onClick={clearCart} variant="outlined" color="error">
                                Clear Cart
                            </Button>
                        )
                    }

                </Box>
            </Box>
        </Drawer>
    );
}
