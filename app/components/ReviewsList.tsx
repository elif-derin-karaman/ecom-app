'use client';

import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import axios from 'axios';

interface Review {
  id: number;
  productId: number;
  username: string;
  title: string;
  content: string;
  rating: number;
  date: string;
}

interface ReviewsListProps {
  productId: number;
  refreshTrigger: number;
}

const ReviewsList = ({ productId, refreshTrigger }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/reviews?productId=${productId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, refreshTrigger]);

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <div className="text-center my-4">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center my-4">No reviews yet. Be the first to review!</div>;
  }

  return (
    <div className="my-4">
      <h4>Customer Reviews ({reviews.length})</h4>
      {reviews.map((review) => (
        <Card key={review.id} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <span className="fw-bold">{review.username}</span>
                <span className="text-warning ms-2">{renderStars(review.rating)}</span>
              </div>
              <small className="text-muted">
                {new Date(review.date).toLocaleDateString()}
              </small>
            </div>
            {review.title && <Card.Title className="h6">{review.title}</Card.Title>}
            <Card.Text>{review.content}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList; 