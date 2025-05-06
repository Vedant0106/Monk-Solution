import { Backdrop, Button, Divider, Modal, Typography, TextField, Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import monkCommerceLogo from './logo/monkCommerceLogo.png';
import ProductListComponent from './ProductListComponent';
import { useState } from 'react';

function ProductComponent() {
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productVariantTitles, setProductVariantTitles] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSelectedProducts = (products) => {
    setSelectedProducts(products);
    console.log('Data from ProductComponentList : ', products);

    const titles = [];

    products.forEach(product => {
      product.variants.forEach(variant => {
        titles.push({
          productTitle: product.title,
          variantTitle: variant.title,
        });
      });
    });

    setProductVariantTitles(titles);
    console.log('Product Variant Titles : ', productVariantTitles);
  };

  return (
    <Box>
      {/* Monk Commerce Logo and Name */}
      <Box display="flex" flexDirection="row" sx={{ padding: '0.5%' }}>
        <Box sx={{ paddingLeft: '1%' }}>
          <img alt="MonkLogo" src={monkCommerceLogo} />
        </Box>
        <Box sx={{ paddingLeft: '1%', paddingTop: '0.15%' }}>
          <Typography sx={{ color: '#909296', fontSize: "16px" }}>
            Monk Upsell & Cross-sell
          </Typography>
        </Box>
      </Box>

      {/* Divider */}
      <Divider />

      {/* Headers */}
      <Box sx={{ paddingLeft: '10%', paddingTop: '3%' }}>
        <Typography sx={{ color: 'black', fontWeight: 'bold' }}>
          Add Products
        </Typography>
      </Box>

      <Box display="flex" flexDirection="row" sx={{ paddingLeft: '10%', paddingTop: '1.5%' }}>
        <Box>
          <Typography sx={{ color: 'black',  fontWeight: 'bold' }}>
            Products
          </Typography>
        </Box>

        <Box sx={{ paddingLeft: '15%' }}>
          <Typography sx={{ color: 'black', fontWeight: 'bold' }}>
            Discount
          </Typography>
        </Box>
      </Box>

       {/* Products and Variants  */}
       <Box sx={{ paddingLeft: '10%', paddingTop: '3%' }}>
      {productVariantTitles.length > 0 ? (
        productVariantTitles.map((item, index) => (
          <Box key={index} sx={{ marginBottom: '10px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    color: 'black',
                    marginRight: '8px', 
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}.
                </Typography>
              </Box>

              
              <TextField
                value={item.productTitle}
                multiline
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: 'white',
                  fontSize: '16px',
                  width: '10%', 
                }}
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                type='number'
                variant="outlined"
                size="small"
                multiline 
                sx={{
                  backgroundColor: 'white',
                  fontSize: '16px',
                  width: '10%', 
                  paddingLeft:'7.5%'
                }}
              />

              <Box sx={{paddingLeft:'2%'}}>
                <Select size='small'>
                  <MenuItem value={1}>% Off</MenuItem>
                  <MenuItem value={2}>Flat Off</MenuItem>
                </Select>   
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft:'2%' }}>
              <TextField
                value={item.variantTitle}
                multiline
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: 'white',
                  fontSize: '12px',
                  width: '5%', 
                  paddingTop:'0.5%'
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>

            <Divider sx={{paddingTop:'2%', width:'40%'}}/>
          </Box>
        ))
      ) : (
        <Typography sx={{ color: 'black' }}>
          No products selected.
        </Typography>
      )}
    </Box>

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