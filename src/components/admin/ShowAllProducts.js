import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { API } from '../../utils/config';

import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box
} from '@mui/material';

export const ShowAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch(`${API}/product?order=asc&sortBy=quantity&limit=10`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data);
        }
      })
      .catch(() => {
        if (isMounted) setError('Failed to fetch products.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Show All Products
        </Typography>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        {!loading && !error && (
          products.length > 0 ? (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography color="text.secondary">
                        Quantity: {product.quantity}
                      </Typography>
                      {/* Add more product info here if available */}
                    </CardContent>
                    <CardActions>
                      <Button size="small" href={`/product/${product._id}`}>
                        View
                      </Button>
                      {/* You can add more actions like Edit/Delete here */}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">No products found.</Alert>
          )
        )}
      </Container>
    </Layout>
  );
};