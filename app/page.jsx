'use client';

import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import CampaignCarousel from './components/CampaignCarousel';
import SearchSortBar from './components/SearchSortBar';
import ProductCard from './components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, campaignsResponse] = await Promise.all([
          axios.get('http://localhost:3001/products'),
          axios.get('http://localhost:3001/campaigns')
        ]);
        
        const productsData = productsResponse.data;
        setProducts(productsData);
        setCampaigns(campaignsResponse.data);
        
        const uniqueCategories = [...new Set(productsData.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductDiscount = (productId) => {
    const campaign = campaigns.find(c => c.productIds.includes(productId));
    return campaign ? campaign.discountPercentage : 0;
  };

  const categoryFilteredProducts = categoryFilter 
    ? products.filter(product => product.category === categoryFilter)
    : products;

  const searchFilteredProducts = searchTerm 
    ? categoryFilteredProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categoryFilteredProducts;

  const sortedProducts = [...searchFilteredProducts].sort((a, b) => {
    if (sortOption === 'price_asc') {
      return a.price - b.price;
    } else if (sortOption === 'price_desc') {
      return b.price - a.price;
    }
    return 0;
  });

  if (loading) {
    return <div className="text-center my-5">Loading products...</div>;
  }

  return (
    <div>
      <CampaignCarousel />
      
      <SearchSortBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
      />
      
      <Row>
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-4">
              <ProductCard 
                id={product.id}
                title={product.title}
                description={product.description}
                price={product.price}
                image={product.image}
                discount={getProductDiscount(product.id)}
              />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <div className="text-center my-5">
              <h4>No products found</h4>
              <p>Try changing your search criteria</p>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
} 