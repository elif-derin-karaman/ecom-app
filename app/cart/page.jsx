'use client';

import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import Link from 'next/link';

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:3001/cart');
      setCartItems(response.data);
      
      // Initialize notes from cart items
      const initialNotes = {};
      response.data.forEach((item) => {
        initialNotes[item.id] = item.note || '';
      });
      setNotes(initialNotes);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const item = cartItems.find(item => item.id === itemId);
      if (!item) return;
      
      await axios.put(`http://localhost:3001/cart/${itemId}`, {
        ...item,
        quantity: newQuantity
      });
      
      // Update local state
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const updateNote = async (itemId) => {
    try {
      const item = cartItems.find(item => item.id === itemId);
      if (!item) return;
      
      await axios.put(`http://localhost:3001/cart/${itemId}`, {
        ...item,
        note: notes[itemId] || ''
      });
      
      // Update local state
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, note: notes[itemId] || '' } : item
      ));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3001/cart/${itemId}`);
      
      // Update local state
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const emptyCart = async () => {
    try {
      // Delete all items one by one
      await Promise.all(cartItems.map(item => 
        axios.delete(`http://localhost:3001/cart/${item.id}`)
      ));
      
      // Update local state
      setCartItems([]);
    } catch (error) {
      console.error('Error emptying cart:', error);
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePayment = async () => {
    try {
      // Clear the cart
      await emptyCart();
      setShowCheckout(false);
      setShowThankYou(true);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal < 1000 ? 50 : 0;
  const total = subtotal + deliveryFee;

  if (loading) {
    return <div className="text-center my-5">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2>Your Shopping Cart is Empty</h2>
        <p>Add some products to your cart and come back here to complete your purchase.</p>
        <Link href="/">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
        
        {/* Thank You Modal */}
        <Modal show={showThankYou} onHide={() => setShowThankYou(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thank You for Your Purchase!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Your order has been successfully placed.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowThankYou(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Shopping Cart</h1>
      
      <Table responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>
                <div className="d-flex align-items-center">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '10px' }}
                  />
                  <div>
                    <Link href={`/product/${item.productId}`} style={{ textDecoration: 'none' }}>
                      <h6 className="mb-0">{item.title}</h6>
                    </Link>
                    <Form.Group className="mt-2">
                      <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder="Add a note"
                        value={notes[item.id] || ''}
                        onChange={(e) => setNotes({...notes, [item.id]: e.target.value})}
                        onBlur={() => updateNote(item.id)}
                      />
                    </Form.Group>
                  </div>
                </div>
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  style={{ width: '70px' }}
                />
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <div className="d-flex justify-content-between mb-4">
        <Button variant="outline-danger" onClick={emptyCart}>
          Empty Cart
        </Button>
        <Link href="/">
          <Button variant="outline-primary">
            Continue Shopping
          </Button>
        </Link>
      </div>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Delivery Fee:</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="small text-muted mb-2">
              Add ${(1000 - subtotal).toFixed(2)} more to get free delivery
            </div>
          )}
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </Card.Body>
      </Card>
      
      <div className="d-grid">
        <Button 
          variant="success" 
          size="lg" 
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
      
      {/* Checkout Modal */}
      <Modal show={showCheckout} onHide={() => setShowCheckout(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Delivery Fee:</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total to be paid:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckout(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePayment}>
            Pay Now
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Thank You Modal */}
      <Modal show={showThankYou} onHide={() => setShowThankYou(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thank You for Your Purchase!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your order has been successfully placed.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowThankYou(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
} 