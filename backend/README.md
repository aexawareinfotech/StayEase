# StayEase Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Copy the `.env.example` file to `.env`
   - Update `MONGO_URI` if your local MongoDB runs on a different URI.
   - Update `JWT_SECRET` with a secure random string.

3. **Seed Database**
   To quickly create an admin, a regular user, and a few sample rooms, run:
   ```bash
   node seeder.js -i
   ```
   **Admin credentials:**
   - Email: admin@stayease.com
   - Password: admin123

   **Guest credentials:**
   - Email: user@stayease.com
   - Password: Password@123

4. **Run Server**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000/api/v1`

## Testing the API
A Postman collection `postman_collection.json` is included. Import this file into Postman, set up a global environment for your `Bearer <token>` in auth sections as needed, or place the token in headers.
