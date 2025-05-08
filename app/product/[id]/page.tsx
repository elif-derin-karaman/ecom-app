'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import ReviewForm from '../../components/ReviewForm';
import ReviewsList from '../../components/ReviewsList';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface Campaign {
  id: number;
  productIds: number[];
  discountPercentage: number;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    const fetchProductAndCampaign = async () => {
      try {
        const [productResponse, campaignsResponse] = await Promise.all([
          axios.get(`http://localhost:3001/products/${productId}`),
          axios.get(`http://localhost:3001/campaigns`)
        ]);
        
        setProduct(productResponse.data);
        
        // Find campaign for this product
        const productCampaign = campaignsResponse.data.find(
          (c: Campaign) => c.productIds.includes(productId)
        );
        
        setCampaign(productCampaign || null);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductAndCampaign();
    }
  }, [productId]);

  const discountedPrice = product && campaign 
    ? product.price * (1 - campaign.discountPercentage / 100) 
    : product?.price || 0;

  const handleAddToCart = async () => {
    if (!product || quantity < 1) return;
    
    setIsAdding(true);
    try {
      // Check if product already in cart
      const cartResponse = await axios.get(`http://localhost:3001/cart?productId=${productId}`);
      
      if (cartResponse.data.length > 0) {
        // Update existing cart item
        const cartItem = cartResponse.data[0];
        await axios.put(`http://localhost:3001/cart/${cartItem.id}`, {
          ...cartItem,
          quantity: cartItem.quantity + quantity
        });
      } else {
        // Add new cart item
        await axios.post('http://localhost:3001/cart', {
          productId,
          title: product.title,
          price: discountedPrice,
          image: product.image,
          quantity,
          note: ''
        });
      }
      
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleGoToCart = () => {
    router.push('/cart');
  };

  const handleReviewAdded = () => {
    setRefreshReviews(prev => prev + 1);
  };

  if (loading) {
    return <div className="text-center my-5">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center my-5">Product not found</div>;
  }

  return (
    <Container>
      <Row className="mb-5">
        <Col md={6}>
          <img 
            src={product.image} 
            alt={product.title} 
            className="img-fluid rounded" 
            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
          />
        </Col>
        <Col md={6}>
          <h1>{product.title}</h1>
          <p className="lead">{product.description}</p>
          
          {campaign ? (
            <div className="mb-3">
              <p className="text-decoration-line-through text-muted">${product.price.toFixed(2)}</p>
              <h3 className="text-danger">${discountedPrice.toFixed(2)} <span className="badge bg-danger">{campaign.discountPercentage}% OFF</span></h3>
            </div>
          ) : (
            <h3 className="mb-3">${product.price.toFixed(2)}</h3>
          )}
          
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <Form.Control
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              style={{ width: '100px' }}
            />
          </div>
          
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg" 
              onClick={handleGoToCart}
            >
              Go to Cart
            </Button>
          </div>
        </Col>
      </Row>
      
      <hr />
      
      <Row>
        <Col>
          <ReviewsList productId={productId} refreshTrigger={refreshReviews} />
          <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />
        </Col>
      </Row>
    </Container>
  );
} 