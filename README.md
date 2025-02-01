# Document Summarizer App

A powerful document summarization tool built with modern web technologies and AI integration.

## Live Demo

## Features

- **Document Upload**: Support for various file formats including PDF, DOCX, and TXT.
- **AI-Powered Summarization**: Utilizes Gemini AI for accurate and concise document summarization.
- **User Authentication**: Secure login and registration system using JWT.
- **Responsive Design**: Fully responsive interface for seamless use across devices.
- **API Integration**: RESTful API endpoints for easy integration with other applications.
- **History Tracking**: Users can view and manage their summarization history.
- **Customizable Summaries**: Options to adjust summary length and focus areas.

## Technologies Used

- **Frontend**:
  - Next.js
  - Tailwind CSS
  - React
- **Backend**:
  - Node.js
  - Express.js
- **Database**:
  - PostgreSQL(Neon)
- **ORM**:
  - Prisma
- **Authentication**:
  - JSON Web Tokens (JWT)
- **AI Integration**:
  - Gemini AI

## Local Installation

Follow these steps to set up the project locally for development:

### Frontend Setup

1. Clone the repository: git clone
2. Navigate to the frontend directory: cd document-summarizer-fullstack/frontend
3. Install dependencies: npm i
4. Set up environment variables:

- Create a `.env.local` file in the frontend directory
- Add the following variable:
  NEXT_PUBLIC_API_URL=''

5. Start the development server: npm run dev

### Backend Setup

1. Open a new terminal and navigate to the backend directory:cd document-summarizer-fullstack/backend
2. Install dependencies: npm i
3. Set up environment variables:

- Create a `.env` file in the backend directory
- Add the following variables:
  ```
  JWT_SECRET=your_jwt_secret_key
  DATABASE_URL=your_postgres_database_url
  GEMINI_API_KEY=your_gemini_ai_api_key
  ```

4. Run database migrations: npx prisma migrate deploy

5. Start the server: nodemon server.js

After completing these steps, your local development environment should be set up and running.
