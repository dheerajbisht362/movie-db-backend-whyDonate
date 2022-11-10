# Backend for movies search app
Live Deploy Link https://fir-movie-caf0c.web.app/

# Tech-Stack Used #
    - body-parser: "^1.20.1"
    - cors: "^2.8.5"
    - dotenv: "^16.0.3"
    - express: "^4.18.2"
    - file-system-db: "^1.1.0"
    - jsonwebtoken: "^8.5.1"
    - mongoose: "^6.7.2"
    - node-fetch: "^3.2.10
    - typescript: "^4.8.4"
    
 ## How to run the Project 🤖
 1) Clone the project and open backend folder with `cd backend`
 2) Install the required packages with `npm install`
 3) After project install dependencies and run the command `npm run start`
 4) Server will start running on localhost:3000
 
 ### Api along with its features
  - /login
    - body {user,email, password}
    - registers users and store into file with file-system-db
    - next time same password should be used to login(no forgetting password 💫)
    - message with the corrosponding errror if any
  
  
  - /movies/:query
    - authorised route - valid jwt token required in headers authorization 
    - query movies from api
