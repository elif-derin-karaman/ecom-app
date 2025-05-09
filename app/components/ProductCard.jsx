'use client';

import { useState } from 'react';
import { Card, Button, Form, Badge } from 'react-bootstrap';
import Link from 'next/link';
import axios from 'axios';

const ProductCard = ({ id, title, description, price, image, discount = 0 }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;

  const addToCart = async () => {
    if (quantity < 1) return;
    
    setIsAdding(true);
    try {
      const cartResponse = await axios.get(`http://localhost:3001/cart?productId=${id}`);
      
      if (cartResponse.data.length > 0) {
        const cartItem = cartResponse.data[0];
        await axios.put(`http://localhost:3001/cart/${cartItem.id}`, {
          ...cartItem,
          quantity: cartItem.quantity + quantity
        });
      } else {
        await axios.post('http://localhost:3001/cart', {
          productId: id,
          title,
          price: discountedPrice,
          image,
          quantity
        });
      }
      
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="h-100">
      <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card.Img 
          variant="top" 
          src={image} 
          style={{ height: '200px', objectFit: 'cover' }} 
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card.Title>{title}</Card.Title>
          <Card.Text className="text-truncate">{description}</Card.Text>
        </Link>
        <div className="mt-auto">
          {discount > 0 ? (
            <div className="mb-2">
              <span className="text-decoration-line-through text-muted me-2">${price.toFixed(2)}</span>
              <span className="text-danger fw-bold">${discountedPrice.toFixed(2)}</span>
              <Badge bg="danger" className="ms-2">{discount}% OFF</Badge>
            </div>
          ) : (
            <Card.Text className="mb-2 fw-bold">${price.toFixed(2)}</Card.Text>
          )}
          
          <div className="d-flex align-items-center mb-2">
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              style={{ width: '70px' }}
              className="me-2"
            />
            <Button 
              variant="primary" 
              onClick={addToCart} 
              disabled={isAdding}
              className="w-100"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard; 