'use client';

import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  image: string;
}

export default function AddCampaign() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, campaignsResponse] = await Promise.all([
          axios.get('http://localhost:3001/products'),
          axios.get('http://localhost:3001/campaigns')
        ]);
        
        setProducts(productsResponse.data);
        setCampaigns(campaignsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProductToggle = (productId: number) => {
    setSelectedProducts(prevSelected => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter(id => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !image || selectedProducts.length === 0) {
      alert('Please fill in all fields and select at least one product');
      return;
    }
    
    setSubmitting(true);
    
    try {
      await axios.post('http://localhost:3001/campaigns', {
        title,
        description,
        image,
        productIds: selectedProducts,
        discountPercentage
      });
      
      alert('Campaign added successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setImage('');
      setDiscountPercentage(10);
      setSelectedProducts([]);
      
      // Refresh campaigns
      const campaignsResponse = await axios.get('http://localhost:3001/campaigns');
      setCampaigns(campaignsResponse.data);
    } catch (error) {
      console.error('Error adding campaign:', error);
      alert('Error adding campaign. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <Container>
      <h1 className="mb-4">Add New Campaign</h1>
      
      <Row>
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Campaign Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Discount Percentage</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="99"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(parseInt(e.target.value) || 10)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Select Products for Campaign</Form.Label>
              <div className="d-flex flex-wrap">
                {products.map(product => (
                  <div key={product.id} className="me-3 mb-3">
                    <Form.Check
                      type="checkbox"
                      id={`product-${product.id}`}
                      label={product.title}
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductToggle(product.id)}
                    />
                  </div>
                ))}
              </div>
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? 'Adding Campaign...' : 'Add Campaign'}
            </Button>
          </Form>
        </Col>
        
        <Col md={4}>
          <h4>Current Campaigns</h4>
          {campaigns.length === 0 ? (
            <p>No campaigns yet</p>
          ) : (
            campaigns.map(campaign => (
              <Card key={campaign.id} className="mb-3">
                <Card.Img 
                  variant="top" 
                  src={campaign.image} 
                  style={{ height: '120px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{campaign.title}</Card.Title>
                  <Card.Text>{campaign.description}</Card.Text>
                  <div className="small text-muted">
                    Discount: {campaign.discountPercentage}%
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
} 