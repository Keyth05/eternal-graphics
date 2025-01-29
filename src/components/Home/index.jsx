import { Typography, Container } from "@mui/material";
import Grid from '@mui/material/Grid2';
import ProductCard from "./ProductCard";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dbError, setDbError] = useState(false);
    
    const fetchProducts = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/product/list`, {
                query: `
                    query {
                        findAllproducts {
                            _id
                            name
                            price
                            category_id
                            img
                            colors {
                                name
                                img
                            }
                            sizes {
                                name
                                available
                            }
                        }
                    }
                `
            });
            if (response.data.data.findAllproducts.length === 0) {
                setDbError(false); // No hay productos pero no hay error en la base de datos
            } else {
                setProducts(response.data.data.findAllproducts);
                setDbError(false);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setDbError(true); // Error en la base de datos
        } finally {
            setIsLoading(false); // Finalizar la carga
        }
    };
    useEffect(() => {
        fetchProducts();
    },[])
    return (
        <Container>
            <Typography variant="h3" align="center" gutterBottom>
                Welcome to Eternal Graphics
            </Typography>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "32px", gap: "8px" }}>
                <img
                    src="https://img.icons8.com/?size=25&id=zra9GyPSFmQw&format=png&color=000000"
                    alt="Icon"
                    style={{ width: "25px", height: "25px" }}
                />
                <Typography variant="h5" style={{ fontWeight: 300 }}>
                    Products
                </Typography>
            </div>

            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : dbError ? (
                <Typography color="error">There was an issue fetching the products from the database.</Typography>
            ) : products.length === 0 ? (
                <Typography>No products available.</Typography>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {
                        products.map((product) => (
                            <Grid xs={12} sm={6} md={4} key={product._id}>
                                <ProductCard product={product} />
                            </Grid>
                        ))
                    }
                </Grid>
            )}

        </Container>
    );
}
