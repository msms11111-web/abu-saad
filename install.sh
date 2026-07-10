#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

print_success "Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_success "npm is installed: $(npm --version)"

# Start installation
print_info "Starting Saudi Essence installation..."

# Create .env files if they don't exist
if [ ! -f .env ]; then
    print_warning "Creating .env file from .env.example..."
    cp .env.example .env
    print_info "Please edit .env file with your configuration"
fi

if [ ! -f server/.env ]; then
    print_warning "Creating server/.env file from server/.env.example..."
    cp server/.env.example server/.env
fi

if [ ! -f client/.env ]; then
    print_warning "Creating client/.env file from client/.env.example..."
    cp client/.env.example client/.env
fi

# Install root dependencies
print_info "Installing root dependencies..."
npm install
print_success "Root dependencies installed"

# Install server dependencies
print_info "Installing server dependencies..."
cd server
npm install
print_success "Server dependencies installed"
cd ..

# Install client dependencies
print_info "Installing client dependencies..."
cd client
npm install
print_success "Client dependencies installed"
cd ..

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p uploads
mkdir -p uploads/thumbnails
mkdir -p logs
print_success "Directories created"

# Ask if user wants to seed database
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Seeding database..."
    cd server
    npm run seed
    cd ..
    print_success "Database seeded"
fi

# Installation complete
echo ""
print_success "Installation complete! 🎉"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Edit .env file with your configuration"
echo "2. Run: ${GREEN}npm run dev${NC} (to start development servers)"
echo "3. Run: ${GREEN}docker-compose up --build${NC} (to use Docker)"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  npm run dev          - Start development servers"
echo "  npm run build        - Build for production"
echo "  npm start            - Start production servers"
echo "  cd server && npm run seed - Seed database"
echo ""
echo -e "${BLUE}Access the application:${NC}"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:5000"
echo ""

print_success "Happy coding! 🚀"
