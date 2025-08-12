# Werp

This project is a server and channel-based chat application. Users can create servers, chat in channels, and send friend requests.

## Features
- Create servers and channels
- Real-time messaging in channels
- Send friend requests
- JWT-based authentication
- Join servers with invite codes

## Installation

### Requirements
- Node.js (v18+ recommended)
- MongoDB (local or cloud)

### Steps
1. Clone the repository:
   ```bash
   git clone <repo-url>
   ```
2. Install dependencies for both server and client:
   ```bash
   cd deneme-project/server
   npm install
   cd ../client
   npm install
   ```
3. Create a `.env` file for the server and enter your MongoDB connection string:
   ```env
   MONGO_URI=mongodb://localhost:27017/werp
   PORT=5000
   JWT_SECRET=[random value1]
   JWT_EXPIRATION=1h
   JWT_REFRESH_SECRET=[random value2]
   JWT_REFRESH_EXPIRATION=7d
   ```
4. Create a `.env` file for the client:
   ```env
   server=http://localhost:5000
   ```

## Running

### Server
```bash
cd server
npm start
```

### Client
```bash
cd client
npm run dev
```

## Usage
- Register and log in.
- Create servers and add channels.
- Chat in channels.
- Add friends and join servers with invite codes.

## Contribution
You can open pull requests and issues.

## License
MIT

