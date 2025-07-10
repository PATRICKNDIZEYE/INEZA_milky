# 🥛 INEZA DAIRY Management System

A modern, comprehensive dairy management system built with Next.js, designed to streamline milk collection, farmer management, and payment processing for dairy cooperatives.

![INEZA DAIRY](https://img.shields.io/badge/INEZA-DAIRY-blue?style=for-the-badge&logo=milk)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green?style=for-the-badge&logo=prisma)

## ✨ Features

### 🏠 **Dashboard & Analytics**
- Real-time dashboard with key metrics
- Collection trends and revenue analytics
- Quality monitoring and alerts
- Recent activity tracking

### 👥 **Multi-Role User Management**
- **Admin**: Full system access and user management
- **Manager**: Operational oversight and reporting
- **Operator**: Collection center specific operations
- **Viewer**: Read-only access to reports

### 🐄 **Farmer Management**
- Comprehensive farmer profiles
- Bulk import functionality
- Bank account details and payment rates
- Activity tracking and status management

### 🥛 **Milk Collection System**
- Quality parameter tracking (fat content, SNF, density, temperature, pH)
- Real-time collection recording
- Quality grading (Excellent, Good, Fair, Poor)
- Collection center assignment

### 💰 **Payment Processing**
- Automated payment calculations
- Bulk payment processing
- Payment status tracking
- SMS notifications to farmers

### 📊 **Reporting & Analytics**
- Sales reports and trends
- Customer analytics
- Inventory management
- Financial reporting

### 📱 **SMS Integration**
- Automated farmer notifications
- Payment confirmations
- Delivery alerts
- Kinyarwanda language support

### 🏢 **Collection Center Management**
- Multiple collection center support
- Capacity management
- Location-based operations
- Operator assignment

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Reliable database
- **bcryptjs** - Password hashing
- **date-fns** - Date manipulation

### **External Services**
- **FDI SMS API** - SMS notifications
- **Stripe** - Payment processing (ready for integration)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ineza-dairy-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

Configure your `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ineza_dairy"
NEXTAUTH_SECRET="your-secret-key"
SMS_API_KEY="your-sms-api-key"
SMS_API_URL="your-sms-api-url"
```

4. **Database Setup**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 👤 Default Users

After seeding the database, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@dairysystem.com` | `admin123` |
| Operator | `operator@dairysystem.com` | `operator123` |

## 📱 Key Features in Action

### **Dashboard Overview**
- Total farmers and active farmers count
- Today's and monthly collection volumes
- Revenue tracking and quality metrics
- Real-time collection trends

### **Farmer Management**
- Add farmers with comprehensive details
- Bulk import via CSV
- Track delivery history and payments
- Manage collection center assignments

### **Collection Process**
- Record milk deliveries with quality parameters
- Automatic quality grading
- Real-time data entry
- Collection center specific operations

### **Payment System**
- Automated payment calculations
- Bulk payment processing
- SMS notifications to farmers
- Payment status tracking

### **User Management**
- Role-based access control
- Collection center assignment for operators
- User activity tracking
- Secure authentication

## 🏗️ Project Structure

```
project/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── farmers/          # Farmer management
│   ├── deliveries/       # Collection management
│   ├── payments/         # Payment processing
│   └── users/            # User management
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── dashboard/        # Dashboard components
│   └── farmers/          # Farmer-specific components
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── scripts/              # Database scripts
```

## 🔧 Configuration

### **Database Schema**
The system uses a comprehensive database schema with:
- Users and role management
- Farmers and collection centers
- Deliveries and quality tracking
- Payments and financial records
- Activity logging and SMS tracking

### **SMS Integration**
Configure SMS notifications for:
- Payment confirmations
- Delivery alerts
- Quality notifications
- System announcements

### **Collection Centers**
- Multiple collection center support
- Capacity management
- Location-based operations
- Operator assignments

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user info

### **Farmers**
- `GET /api/farmers` - List farmers
- `POST /api/farmers` - Create farmer
- `PUT /api/farmers/[id]` - Update farmer
- `DELETE /api/farmers/[id]` - Delete farmer

### **Deliveries**
- `GET /api/deliveries` - List deliveries
- `POST /api/deliveries` - Record delivery
- `PUT /api/deliveries/[id]` - Update delivery

### **Payments**
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `PUT /api/payments/[id]` - Update payment

### **Users**
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## 🎯 Use Cases

### **For Dairy Cooperatives**
- Streamline milk collection processes
- Improve quality control
- Enhance farmer relationships
- Optimize payment processing

### **For Collection Centers**
- Efficient daily operations
- Quality parameter tracking
- Real-time data entry
- Operator management

### **For Farmers**
- Transparent payment tracking
- Quality feedback
- SMS notifications
- Delivery history

## 🔒 Security Features

- Role-based access control
- Secure password hashing
- API authentication
- Data validation
- Activity logging

## 📈 Performance

- Optimized database queries
- Efficient data filtering
- Real-time updates
- Responsive design
- Mobile-friendly interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the dairy industry**

*Empowering dairy cooperatives with modern technology* 