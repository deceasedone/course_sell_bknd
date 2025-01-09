# Course Selling Management App

A Node.js-based application for managing course selling operations with separate functionalities for users and admins. Built while learning backend development, this project emphasizes modular and scalable architecture.

## Features

### User Routes:
- **Login**  
- **Signup**  
- **Purchase a Course**  
- **View All Available Courses**  
- **View Purchased Courses**  

### Admin Routes:
- **Login**  
- **Signup**  
- **Create a Course**  
- **Delete a Course**  
- **Add Course Content**  

## Steps to Build

1. **Initialize the Project**  
   Run `npm init` to set up a new Node.js project.

2. **Install Dependencies**  
   Install required packages:  
   bash
   npm install express jsonwebtoken mongoose dotenv

3.Create Entry Point
  Set up index.js to initialize the Express app and connect to the database.

4.Define Routes
  Implement route skeletons for users and admins.

5.Create Schemas
  Use MongoDB schemas for models:

    User
    Admin
    Course
    Purchase

6.Configure Database

    Use MongoDB with a .env file for secure configuration:

    MONGODB_URI=your_mongodb_connection_string

7.Implement Authentication
  Use JWT for secure user and admin authentication, protecting routes with middleware.

8.Complete Functionalities
  Build out all defined user and admin routes for full functionality
