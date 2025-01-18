# Dockerfile for frontend
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the src folder to ensure index.css is included
COPY src/ ./src/

# Install dependencies
RUN npm install

# Ensure Tailwind CSS builds
RUN npm run postinstall

# Copy remaining files
COPY . .

# Expose port and start the app
EXPOSE 3000
CMD ["npm", "start"]
