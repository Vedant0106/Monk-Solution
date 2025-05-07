import {
  Backdrop,
  Button,
  Divider,
  Modal,
  Typography,
  TextField,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import Box from '@mui/material/Box';
import monkCommerceLogo from './logo/monkCommerceLogo.png';
import ProductListComponent from './ProductListComponent';
import { useState } from 'react';

function ProductComponent() {
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productVariantTitles, setProductVariantTitles] = useState([]);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleSelectedProducts = (products) => {
    setSelectedProducts(products);

    const titles = [];

    products.forEach((product) => {
      product.variants.forEach((variant) => {
        titles.push({
          productTitle: product.title,
          variantTitle: variant.title,
        });
      });
    });

    setProductVariantTitles(titles);
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <img alt="Monk Logo" src={monkCommerceLogo} width={50} />
        <Typography sx={{ color: '#909296', fontSize: '18px', fontWeight: 500 }}>
          Monk Upsell & Cross-sell
        </Typography>
      </Box>

      <Divider />

      {/* Title */}
      <Typography variant="h5" fontWeight="bold" mt={4} mb={2}>
        Add Products
      </Typography>

      {/* Column Headings */}
      <Box display="flex" gap={4} alignItems="center" mb={2}>
        <Typography fontWeight="bold">Products</Typography>
        <Typography fontWeight="bold">Discount</Typography>
      </Box>

      {/* Product Variant List */}
      <Box>
        {productVariantTitles.length > 0 ? (
          productVariantTitles.map((item, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                padding: 2,
                marginBottom: 2,
                maxWidth: '600px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Box display="flex" gap={2} alignItems="center" mb={1}>
                <Typography fontWeight="bold" width="20px">
                  {index + 1}.
                </Typography>

                <TextField
                  label="Product Title"
                  value={item.productTitle}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="Discount"
                  type="number"
                  variant="outlined"
                  size="small"
                  sx={{ width: '100px' }}
                />

                <Select
                  size="small"
                  defaultValue={1}
                  sx={{ width: '100px' }}
                >
                  <MenuItem value={1}>% Off</MenuItem>
                  <MenuItem value={2}>Flat Off</MenuItem>
                </Select>
              </Box>

              <TextField
                label="Variant Title"
                value={item.variantTitle}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Paper>
          ))
        ) : (
          <Typography color="text.secondary">No products selected.</Typography>
        )}
      </Box>

      {/* Add Product Button */}
      <Box sx={{ paddingLeft: '10%', paddingTop: '2%' }}>
        <Button variant='outlined' onClick={handleOpen} sx={{ borderColor: '#008060', color: '#008060' }}>
          Add Button
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '663px', height: '612px' }}>
            <ProductListComponent
              handlePopupClose={handleClose}
              handleSelectedProducts={handleSelectedProducts}
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default ProductComponent;
