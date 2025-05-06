import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, CircularProgress, Alert, Box, IconButton, Divider, TextField, Checkbox, FormControlLabel, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function ProductListComponent({ handlePopupClose, handleSelectedProducts }) {

    // State Management
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVariants, setSelectedVariants] = useState({});

    // API Details
    const apiUrl = 'https://stageapi.monkcommerce.app/task/products/search?search=Hat&page=2&limit=1';
    const apiKey = '72njgfa948d9aS7gs5'; 

    // Search Functionality
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        console.log('Searching for:', searchQuery); 
    };

    // Checkbox Functionality
    const handleMainCheck = (productId, variants) => {
        setSelectedVariants((prevSelectedVariants) => {
            const currentProductVariants = prevSelectedVariants[productId] || {};
            const isAllChecked = variants.every((variant) => currentProductVariants[variant.id]);
            
            const updatedVariants = variants.reduce((acc, variant) => {
                acc[variant.id] = !isAllChecked;
                return acc;
            }, {});

            return { ...prevSelectedVariants, [productId]: updatedVariants };
        });
    };

    const handleVariantCheck = (productId, variantId) => {
        setSelectedVariants((prevSelectedVariants) => {
            const productVariants = prevSelectedVariants[productId] || {};
            const updatedVariants = { ...productVariants, [variantId]: !productVariants[variantId] };
            return { ...prevSelectedVariants, [productId]: updatedVariants };
        });
    };

    // Getting data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        "x-api-key": apiKey,
                    },
                });

                console.log("Response : ", response.data);
                setProducts(response.data || []);
            } 
            catch (err) {
                console.error("Error fetching data: ", err);
                setError(err.response?.data?.message || "An error occurred");
            } 
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box>
            <Alert severity="error"> An Error occurred : {error}</Alert>
        </Box>
    );

    // Returns the number of parent checkboxes checked 
    const countCheckedMainCheckboxes = () => {
        return products.filter(product => {
            const productCheckboxes = selectedVariants[product.id] || {};
            return product.variants.every(variant => productCheckboxes[variant.id]);
        }).length;
    };

    const checkedMainCount = countCheckedMainCheckboxes();

    // Add Button Functionality
    const handleAddClick = () => {
        const selectedProducts = products
            .filter(product => {
                const productCheckboxes = selectedVariants[product.id] || {};
                return product.variants.every(variant => productCheckboxes[variant.id]);
            })
            .map(product => ({
                title: product.title,
                variants: product.variants.filter(variant => selectedVariants[product.id]?.[variant.id]),
            }));
    
        handleSelectedProducts(selectedProducts);
    };


    return (
        <Box sx={{ bgcolor: '#F6F6F8' }}>

            {/* Select Products Header and Close Icon */}
            <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <Box sx={{ padding: '1%' }}>
                    <Typography fontWeight='bold'>Select Products</Typography>
                </Box>

                <Box>
                    <IconButton onClick={handlePopupClose}>
                        <CloseIcon sx={{ color: 'black' }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Divider 1 */}
            <Divider sx={{ paddingTop: '1%' }} />

            {/* Search Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '1%' }}>
                <TextField
                    label="Search Product"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    size="small"
                    sx={{
                        width: '95%',
                        margin: '10px',
                    }}
                />
            </Box>

            {/* Divider 2 */}
            <Divider sx={{ paddingTop: '1%' }} />

            {/* Products Content */}
            {products.length > 0 ? (
                products.map((product) => (
                    <Box key={product.id} overflow="auto">
                        <Box display='flex' flexDirection='row' sx={{ paddingLeft: '2.5%', paddingTop: '1%' }} >
                            <Box>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={product.id in selectedVariants
                                                && Object.values(selectedVariants[product.id]).some(Boolean)
                                            }
                                            onChange={() => handleMainCheck(product.id, product.variants)}
                                            color="success"
                                        />
                                    }
                                />
                            </Box>

                            <Box>
                                {product.image?.src && (
                                    <img
                                        src={product.image.src}
                                        alt={product.title}
                                        style={{ width: '40px', height: '40px' }}
                                    />
                                )}
                            </Box>

                            <Box sx={{ paddingLeft: '2.5%', paddingTop: '1.5%' }}>
                                <Typography>{product.title} - {product.tags}</Typography>
                            </Box>

                            <Divider />
                        </Box>

                        {/* Variant Details */}
                        <Box>
                            {product.variants && product.variants.length > 0 ? (
                                product.variants.map((variant) => (
                                    <Box display='flex' flexDirection='row' key={variant.id} sx={{ width: '100%' }}>

                                        <Box sx={{ width: '60%', paddingLeft: '5%' }}>
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
                                        </Box>

                                        <Box display='flex' flexDirection='row' sx={{ width: '35%', paddingTop: '1.5%' }}>

                                            <Box sx={{ width: '60%' }}>
                                                <Typography>{variant.inventory_quantity} available </Typography>
                                            </Box>

                                            <Box sx={{ width: '40%' }}>
                                                <Typography> ${variant.price}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2"> No variants available </Typography>
                            )}
                        </Box>
                    </Box>
                ))
            ) : (
                // Edge case when no products are available
                <Box>
                    <Typography variant="body1">No products available</Typography>
                </Box>
            )}

            {/* Divider 3 */}
            <Divider sx={{ paddingTop: '1%' }} />

            {/* Final Row */}
            <Box display='flex' flexDirection='row' sx={{width:'100%', padding:'2%'}}>
                <Box sx={{ padding: '1%', paddingLeft:'2%', width:'65%' }}>
                    <Typography variant="body1">
                        {checkedMainCount} product(s) selected 
                    </Typography>
                </Box>

                <Box sx={{width:'15%'}}>
                    <Button variant='outlined' color="#00000066" onClick={handlePopupClose}> Cancel </Button>
                </Box>

                <Box sx={{paddingLeft:'2%'}}>
                    <Button variant="contained" sx={{bgcolor:'#008060'}} onClick={handleAddClick}> Add </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ProductListComponent;
