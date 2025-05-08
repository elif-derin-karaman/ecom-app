# E-Commerce Web Application

This is an e-commerce web application built with React, Next.js, Node.js, and Bootstrap for CS391 Web Application Development course.

## Features

- Home page with product listings, search, sort, and campaign carousel
- Product detail page with reviews and ratings
- Shopping cart functionality
- Campaign management

## Technologies Used

- React.js
- Next.js
- Bootstrap & React Bootstrap
- JSON Server for RESTful API
- Axios for HTTP requests

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository or extract the archive file

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application (both frontend and backend):
   ```
   npm run dev:all
   ```

This will start:
- Next.js development server on http://localhost:3000
- JSON Server on http://localhost:3001

## Project Structure

- `/app`: Next.js application pages and components
- `/app/components`: Reusable React components
- `/data`: JSON data for the backend
- `/public`: Static assets

## Pages

1. **Home Page** (`/app/page.tsx`): 
   - Displays products with search and sort functionality
   - Shows campaign carousel
   - Allows adding products to cart

2. **Product Detail Page** (`/app/product/[id]/page.tsx`):
   - Shows detailed product information
   - Displays reviews and allows adding new reviews
   - Allows adding product to cart with quantity selection

3. **Shopping Cart Page** (`/app/cart/page.tsx`):
   - Lists cart items with quantity controls
   - Allows adding special notes for each product
   - Calculates subtotal, delivery fee, and total
   - Provides checkout functionality

4. **Add Campaign Page** (`/app/add-campaign/page.tsx`):
   - Form to create new campaigns
   - Shows existing campaigns
   - Allows selecting products for the campaign

## API Endpoints

The application uses JSON Server for the backend with the following endpoints:

- `GET /products`: Get all products
- `GET /products/:id`: Get a specific product
- `GET /campaigns`: Get all campaigns
- `POST /campaigns`: Create a new campaign
- `GET /cart`: Get cart items
- `POST /cart`: Add item to cart
- `PUT /cart/:id`: Update cart item
- `DELETE /cart/:id`: Remove item from cart
- `GET /reviews`: Get all reviews
- `GET /reviews?productId=:id`: Get reviews for a specific product
- `POST /reviews`: Add a new review
