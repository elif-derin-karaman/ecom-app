'use client';

import { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import Link from 'next/link';
import axios from 'axios';

interface CartItem {
  id: number;
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const NavigationBar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/cart');
        const cartItems = response.data as CartItem[];
        
        // Update cart count
        setCartCount(cartItems.length);
        
        // Calculate total amount
        const total = cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCartData();
    
    // Set up interval to check cart data periodically
    const interval = setInterval(fetchCartData, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} href="/">E-Commerce App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">Home</Nav.Link>
            <Nav.Link as={Link} href="/add-campaign">Add Campaign</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link className="me-3">
              Total: <span className="text-warning fw-bold">${cartTotal.toFixed(2)}</span>
            </Nav.Link>
            <Nav.Link as={Link} href="/cart">
              Cart <Badge bg="danger">{cartCount}</Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 