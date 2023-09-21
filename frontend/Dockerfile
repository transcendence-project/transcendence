# Use Node.js v16 as the base image
FROM node:16

# Set the working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json before other files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "serve"]