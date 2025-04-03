# Profile Mapper

## Overview

Profile Mapper is an innovative web application that allows users to explore and visualize professional profiles on an interactive geographical map. The platform provides a seamless experience for discovering, searching, and understanding the global distribution of professionals.

## 🌟 Features

### Core Functionality
- Interactive profile browsing
- Geographical visualization of profiles
- Detailed profile information
- Advanced search and filtering
- Responsive design

### Technical Highlights
- Next.js 15 with App Router
- TypeScript
- Prisma ORM
- PostgreSQL Database
- Tailwind CSS
- Shadcn UI
- Google Maps Integration
- Zod Validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL Database
- Google Maps API Key

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/profile-mapper.git
cd profile-mapper
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with the following:
```
DATABASE_URL="your_postgresql_connection_string"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

4. Initialize Prisma
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server
```bash
npm run dev
```

## 📂 Project Structure
```
src/
├── app/
│   ├── api/
│   ├── admin/
│   ├── map/
│   └── profiles/
├── components/
├── hooks/
├── lib/
├── styles/
└── types/
```

## 🛠 Technologies Used

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion

### Backend
- Prisma ORM
- PostgreSQL
- Zod Validation

### Mapping
- Google Maps API
- Geocoding Services

### State Management
- SWR (Stale-While-Revalidate)

## 🔐 Authentication (Planned)
- Role-based access control
- User registration
- Profile management

## 🗺️ Geocoding
- Automatic address to coordinates conversion
- Fallback mechanisms for invalid addresses

## 📱 Responsive Design
- Mobile-friendly
- Adaptive layouts
- Cross-device compatibility

## 🧪 Testing
- Unit Tests
- Integration Tests
- End-to-End Tests (Planned)

## 🚢 Deployment
Easily deployable on:
- Vercel
- Netlify
- Heroku
- DigitalOcean

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Workflow
- Follow TypeScript best practices
- Maintain consistent code style
- Write comprehensive tests
- Update documentation

## 📋 Roadmap
- [ ] Implement user authentication
- [ ] Add advanced filtering
- [ ] Create user profiles
- [ ] Enhance mapping features
- [ ] Implement social sharing

## 🐛 Reporting Issues
Please use the GitHub Issues section to report bugs or suggest features.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact
Your Name - sravan.pant5@gmail.com

Project Link: [https://github.com/sravanpant/profile-mapper](https://github.com/sravanpant/profile-mapper)
```

