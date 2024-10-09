# social_media_backend
This project is a Node.js-based backend for a social media platform with features like user authentication (JWT-based), post creation, following/unfollowing, and interacting with posts. It uses PostgreSQL as the database and follows the MVC (Model-View-Controller) architecture.
#Features
User Registration and Authentication (JWT)
Create, Read, and Delete Posts
Follow/Unfollow Users
Comment and Like posts
Secure API endpoints

#Prerequisites
Ensure you have Node.js installed (v14+ recommended) and PostgreSQL running.

#Installation
1. Clone the repository:
  git clone https://github.com/your-username/social-media-backend.git
  cd social-media-backend

2. Navigate to the api folder:
   cd api
   
3. Install all dependencies:
   npm i / npm install

#Dependencies include:

pg for PostgreSQL interaction

crypto for password hashing

jsonwebtoken (JWT) for user authentication

moment for time formatting

bcryptjs for password encryption

express for handling routes

sequelize for ORM (Object Relational Mapping)

4. Set up environment variables in a .env file (create it in the root of the api folder):
   
DB_HOST=your-db-host

DB_USER=your-db-username

DB_PASSWORD=your-db-password

DB_DATABASE=your-db-name

JWT_SECRET=your-secret-key


6. Set up the database: Run PostgreSQL and make sure to create the required database for the application. You can then sync the Sequelize models by running the project.

#Commands to Start the Project

1.Run the server:
 cd api
 npm start
 
2.To check requests, use tools like Postman or Insomnia.

 Usage:
 
Registration: Use /api/register to create a new user.

Login: Use /api/login to authenticate and receive a token.

Add Post: After logging in, you can create posts by sending a request to /api/posts.

Follow Users: Use /api/follow/:id to follow other users.

Comment and Like: Use /api/posts/:id/comment or /api/posts/:id/like.

Note: Make sure to include the accessToken (JWT token) in your request headers for authenticated routes.
 
