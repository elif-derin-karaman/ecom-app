'use client';

import { Form, Row, Col, Button } from 'react-bootstrap';

const SearchSortBar = ({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  categoryFilter,
  setCategoryFilter,
  categories
}) => {

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setSearchTerm('');
    setSortOption('');
  };

  const handleListClick = () => {

  };

  return (
    <Row className="mb-4 align-items-center">
      <Col md={3}>
        <Form.Group>
          <Form.Label>Categories</Form.Label>
          <Form.Select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={3}>
        <Form.Group>
          <Form.Label>Search By</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={3}>
        <Form.Group>
          <Form.Label>Sort By</Form.Label>
          <Form.Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">No Sorting</option>
            <option value="price_asc">Sort By Price: Low to High</option>
            <option value="price_desc">Sort By Price: High to Low</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={3} className="d-flex align-items-end">
        <Button 
          variant="primary" 
          className="w-100"
          onClick={handleListClick}
        >
          List
        </Button>
      </Col>
    </Row>
  );
};

export default SearchSortBar; 