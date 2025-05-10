'use client';

import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !content) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First, get the current product data
      const productResponse = await axios.get(`http://localhost:3001/products/${productId}`);
      const product = productResponse.data;
      
      // Create the new review
      const newReview = {
        id: Date.now().toString(), // Generate a unique ID
        username,
        title,
        content,
        rating,
        date: new Date().toISOString()
      };
      
      // Add the new review to the product's reviews array
      const updatedProduct = {
        ...product,
        reviews: [...(product.reviews || []), newReview]
      };
      
      // Update the product with the new review
      await axios.put(`http://localhost:3001/products/${productId}`, updatedProduct);
      
      setUsername('');
      setTitle('');
      setContent('');
      setRating(5);
      
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-4 p-3 border rounded">
      <h4>Write a Review</h4>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name *</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Rating *</Form.Label>
              <Form.Select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                required
              >
                <option value="5">★★★★★ (5 stars)</option>
                <option value="4">★★★★☆ (4 stars)</option>
                <option value="3">★★★☆☆ (3 stars)</option>
                <option value="2">★★☆☆☆ (2 stars)</option>
                <option value="1">★☆☆☆☆ (1 star)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Label>Review Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Your Review *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Form>
    </div>
  );
};

export default ReviewForm; 