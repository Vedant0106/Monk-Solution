import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Typography, CircularProgress, Alert, Box, IconButton, Divider,
    TextField, Checkbox, FormControlLabel, Button, Paper, Grid
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function ProductListComponent({ handlePopupClose, handleSelectedProducts }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVariants, setSelectedVariants] = useState({});

    const apiUrl = 'https://stageapi.monkcommerce.app/task/products/search?search=Hat&page=2&limit=1';
    const apiKey = '72njgfa948d9aS7gs5';

    const handleSearchChange = (event) => setSearchQuery(event.target.value);
    const handleSearch = () => console.log('Searching for:', searchQuery);

    const handleMainCheck = (productId, variants) => {
        setSelectedVariants((prev) => {
            const current = prev[productId] || {};
            const isAllChecked = variants.every((v) => current[v.id]);
            const updated = variants.reduce((acc, v) => {
                acc[v.id] = !isAllChecked;
                return acc;
            }, {});
            return { ...prev, [productId]: updated };
        });
    };

    const handleVariantCheck = (productId, variantId) => {
        setSelectedVariants((prev) => {
            const updated = {
                ...prev[productId],
                [variantId]: !prev[productId]?.[variantId]
            };
            return { ...prev, [productId]: updated };
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: { "x-api-key": apiKey },
                });
                setProducts(response.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const countCheckedMainCheckboxes = () =>
        products.filter(p => p.variants.every(v => selectedVariants[p.id]?.[v.id])).length;

    const handleAddClick = () => {
        const selectedProducts = products
            .filter(p => p.variants.every(v => selectedVariants[p.id]?.[v.id]))
            .map(p => ({
                title: p.title,
                variants: p.variants.filter(v => selectedVariants[p.id]?.[v.id]),
            }));
        handleSelectedProducts(selectedProducts);
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Alert severity="error">An error occurred: {error}</Alert>
    );

    return (
        <Paper sx={{ padding: 3, bgcolor: '#F6F6F8', maxWidth: 800, margin: 'auto' }}>
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                <Typography variant="h6" fontWeight='bold'>Select Products</Typography>
                <IconButton onClick={handlePopupClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <TextField
                fullWidth
                label="Search Product"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                size="small"
                sx={{ mb: 2 }}
            />

            <Divider sx={{ mb: 2 }} />

            {products.length > 0 ? (
                products.map((product) => (
                    <Box key={product.id} mb={2}>
                        <Box display="flex" alignItems="center">
                            <Checkbox
                                checked={product.id in selectedVariants &&
                                    Object.values(selectedVariants[product.id]).some(Boolean)}
                                onChange={() => handleMainCheck(product.id, product.variants)}
                                color="success"
                            />
                            {product.image?.src && (
                                <img src={product.image.src} alt={product.title} style={{ width: 40, height: 40, marginRight: 10 }} />
                            )}
                            <Typography>{product.title} - {product.tags}</Typography>
                        </Box>

                        {product.variants.map((variant) => (
                            <Grid container key={variant.id} spacing={2} alignItems="center" pl={4}>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedVariants[product.id]?.[variant.id] || false}
                                                onChange={() => handleVariantCheck(product.id, variant.id)}
                                                color="success"
                                            />
                                        }
                                        label={variant.title}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{variant.inventory_quantity} available</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">${variant.price}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                ))
            ) : (
                <Typography>No products available</Typography>
            )}

            <Divider sx={{ mt: 2, mb: 2 }} />

            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography>{countCheckedMainCheckboxes()} product(s) selected</Typography>
                <Box>
                    <Button onClick={handlePopupClose} sx={{ mr: 2 }} variant='outlined'>Cancel</Button>
                    <Button variant='contained' sx={{ bgcolor: '#008060' }} onClick={handleAddClick}>Add</Button>
                </Box>
            </Box>
        </Paper>
    );
}

export default ProductListComponent;