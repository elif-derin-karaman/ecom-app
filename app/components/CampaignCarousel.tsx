'use client';

import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import axios from 'axios';

interface Campaign {
  id: number;
  title: string;
  description: string;
  image: string;
  productIds: number[];
  discountPercentage: number;
}

const CampaignCarousel = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:3001/campaigns');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div className="text-center my-4">Loading campaigns...</div>;
  }

  if (campaigns.length === 0) {
    return null;
  }

  return (
    <Carousel className="mb-4">
      {campaigns.map((campaign) => (
        <Carousel.Item key={campaign.id}>
          <img
            className="d-block w-100"
            src={campaign.image}
            alt={campaign.title}
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            <p className="text-warning fw-bold">{campaign.discountPercentage}% OFF</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CampaignCarousel; 