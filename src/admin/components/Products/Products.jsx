import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
    Typography,
    IconButton,
    FormGroup,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit } from '@mui/icons-material';

const ProductsAdmin = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newColor, setNewColor] = useState({ name: '', img: '' });
    const [sizes, setSizes] = useState({
        s: false,
        m: false,
        l: false,
        xl: false,
    });
    const [isLoading, setIsLoading] = useState(true); // Nuevo estado de carga
    const [dbError, setDbError] = useState(false); // Nuevo estado para manejo de errores

    useEffect(() => {
        fetchProducts();
    }, []);

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

    const handleOpenDialog = (product = null) => {
        setSelectedProduct(product || { name: '', price: '', img: '', category_id: '', colors: [], sizes: [] });
        setSizes({
            s: product?.sizes?.find(s => s.name === 's')?.available || false,
            m: product?.sizes?.find(s => s.name === 'm')?.available || false,
            l: product?.sizes?.find(s => s.name === 'l')?.available || false,
            xl: product?.sizes?.find(s => s.name === 'xl')?.available || false,
        });
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setSelectedProduct(null);
        setOpen(false);
        setNewColor({ name: '', img: '' });
        setSizes({ s: false, m: false, l: false, xl: false });
    };

    const handleSave = async () => {
        try {
            const updatedSizes = Object.keys(sizes).map(size => ({
                name: size,
                available: sizes[size],
            }));

            const query = selectedProduct._id
                ? `
                    mutation {
                    updateProduct(
                        id: "${selectedProduct._id}",
                        name: "${selectedProduct.name}",
                        price: ${selectedProduct.price},
                        category_id: "${selectedProduct.category_id}",
                        img: "${selectedProduct.img}",
                        colors: [${selectedProduct.colors
                    .map(color => `{ name: "${color.name}", img: "${color.img}" }`)
                    .join(", ")}],
                        sizes: [${updatedSizes
                    .map(size => `{ name: "${size.name}", available: ${size.available} }`)
                    .join(", ")}]
                    ) {
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
                    }`
                :
                `
                    mutation {
                    addProduct(
                        name: "${selectedProduct.name}",
                        price: ${selectedProduct.price},
                        category_id: "${selectedProduct.category_id}",
                        img: "${selectedProduct.img}",
                        colors: [${selectedProduct.colors
                    .map(color => `{ name: "${color.name}", img: "${color.img}" }`)
                    .join(", ")}],
                        sizes: [${updatedSizes
                    .map(size => `{ name: "${size.name}", available: ${size.available} }`)
                    .join(", ")}]
                    ) {
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
                    }`;

            selectedProduct._id ? await axios.put(
                `${import.meta.env.VITE_API_GATEWAY_URL}`,
                { query },
                { headers: { 'Content-Type': 'application/json' } }
            ).then((response) => {
                console.log('Respuesta del servidor:', response.data);
            })
                .catch((error) => {
                    console.error('Error en la solicitud:', error);
                }) :
                await axios.post(
                    `${import.meta.env.VITE_API_GATEWAY_URL}`,
                    { query },
                    { headers: { 'Content-Type': 'application/json' } }
                ).then((response) => {
                    console.log('Respuesta del servidor:', response.data);
                })
                    .catch((error) => {
                        console.error('Error en la solicitud:', error);
                    });
            fetchProducts();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const mutation = `mutation {
                deleteProduct(id: "${id}") {
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
            }`;

            await axios.delete(
                `${import.meta.env.VITE_API_GATEWAY_URL}`,
                {
                    data: { query: mutation }, 
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then((response) => {
                console.log('Respuesta del servidor:', response.data);
            })
                .catch((error) => {
                    console.error('Error en la solicitud:', error);
                });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddColor = () => {
        if (newColor.name && newColor.img) {
            setSelectedProduct((prev) => ({
                ...prev,
                colors: [...(prev.colors || []), newColor],
            }));
            setNewColor({ name: '', img: '' });
        }
    };

    const handleRemoveColor = (index) => {
        setSelectedProduct((prev) => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index),
        }));
    };

    const handleSizeChange = (e) => {
        const { name, checked } = e.target;
        setSizes((prev) => ({ ...prev, [name]: checked }));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Product Management
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                Add Product
            </Button>

            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : dbError ? (
                <Typography color="error">There was an issue fetching the products from the database.</Typography>
            ) : products.length === 0 ? (
                <Typography>No products available.</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Colors</TableCell>
                            <TableCell>Sizes</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>
                                    <img src={product.img} alt={product.name} width={50} />
                                </TableCell>
                                <TableCell>
                                    {product.colors && product.colors.map((color, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap={1}>
                                            <img src={color.img} alt={color.name} width={20} />
                                            <Typography>{color.name}</Typography>
                                        </Box>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    {product.sizes && product.sizes.map((size, index) => {
                                        let sizeName = '';
                                        switch (size.name) {
                                            case 's':
                                                sizeName = 'Small';
                                                break;
                                            case 'm':
                                                sizeName = 'Medium';
                                                break;
                                            case 'l':
                                                sizeName = 'Large';
                                                break;
                                            case 'xl':
                                                sizeName = 'Extra Large';
                                                break;
                                            default:
                                                sizeName = size.name;
                                        }

                                        return (
                                            <Typography key={index}>
                                                {size.available ? '✅' : '❌'} {sizeName}
                                            </Typography>
                                        );
                                    })}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(product)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(product._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{selectedProduct?._id ? 'Edit Product' : 'New Product'}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            name="name"
                            label="Name"
                            value={selectedProduct?.name || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name="price"
                            label="Price"
                            type="number"
                            value={selectedProduct?.price || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name="img"
                            label="Image URL"
                            value={selectedProduct?.img || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name="category_id"
                            label="Category"
                            value={selectedProduct?.category_id || ''}
                            onChange={handleChange}
                            fullWidth
                        />

                        <Typography variant="h6">Colors</Typography>
                        {selectedProduct?.colors?.map((color, index) => (
                            <Box key={index} display="flex" alignItems="center" gap={1}>
                                <TextField
                                    label="Color Name"
                                    value={color.name}
                                    fullWidth
                                    disabled
                                />
                                <TextField
                                    label="Color Image"
                                    value={color.img}
                                    fullWidth
                                    disabled
                                />
                                <IconButton color='error' onClick={() => handleRemoveColor(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}

                        <Box display="flex" alignItems="center" gap={1}>
                            <TextField
                                label="Color Name"
                                value={newColor.name}
                                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Color Image"
                                value={newColor.img}
                                onChange={(e) => setNewColor({ ...newColor, img: e.target.value })}
                                fullWidth
                            />
                            <IconButton color="primary" onClick={handleAddColor}>
                                <AddIcon />
                            </IconButton>
                        </Box>

                        <Typography variant="h6">Sizes</Typography>
                        <FormGroup>
                            {['s', 'm', 'l', 'xl'].map((size) => (
                                <FormControlLabel
                                    key={size}
                                    control={<Checkbox checked={sizes[size]} onChange={handleSizeChange} name={size} />}
                                    label={size.toUpperCase()}
                                />
                            ))}
                        </FormGroup>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductsAdmin;
