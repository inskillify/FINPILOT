# FINPILOT - Your Financial Copilot

A comprehensive React Native financial management application with AI-powered insights, transaction tracking, goal management, and portfolio analysis.

## 🎯 Project Overview

FINPILOT is a full-stack financial management application designed to help users:
- Track income and expenses with intelligent categorization
- Manage savings goals with feasibility analysis
- Organize money into virtual "jars" for different purposes
- Monitor investment portfolio with P&L tracking
- Get AI-powered financial insights and recommendations
- Parse UPI/bank SMS for automatic transaction logging
- Receive smart alerts for financial events

## 📱 Features

### 10 Core Screens

#### 1. **Dashboard** 
- Real-time balance display
- Safe-to-spend meter
- 7-day spending forecast
- Quick stats (income, expenses, savings)
- Spending habits visualization
- Active alerts summary
- Quick action buttons

#### 2. **Transactions**
- Complete transaction history with infinite scroll
- Category-based filtering
- Date range filtering
- Add transaction modal
- CSV upload capability
- Transaction details view

#### 3. **Jars**
- Virtual savings buckets
- Progress tracking with visual indicators
- Allocation recommendations
- Create new jars
- Jar recommendations widget
- Summary statistics

#### 4. **Goals**
- Financial goal tracking
- Timeline visualization
- Feasibility analysis
- Monthly required savings calculation
- Priority-based organization
- Milestone tracking

#### 5. **Portfolio**
- Asset tracking (stocks, ETFs, mutual funds)
- P&L calculation and display
- Asset allocation charts
- Risk meter
- 7-day forecast
- Top gainers/losers
- Diversification analysis

#### 6. **AI Insights**
- Spending pattern analysis
- Predictive analytics
- Optimization recommendations
- Categorization statistics
- Cash runout alerts
- Confidence metrics

#### 7. **AI Coach**
- Chat interface with AI financial advisor
- Suggested prompts
- Context-aware responses
- Actionable recommendations
- Message history

#### 8. **UPI SMS Parser**
- SMS input and parsing
- Automatic transaction extraction
- Category auto-detection
- Transaction preview
- Batch processing
- Example SMS templates

#### 9. **Alerts**
- Severity-based notifications (Critical, Warning, Info)
- Smart suggestions
- Action buttons
- Dismissible alerts
- Alert history

#### 10. **Settings**
- Profile management
- Preferences (notifications, theme, currency)
- Security settings (biometric, 2FA)
- Data management (backup, export, import)
- About & Help
- Logout

## 🏗️ Architecture

### Frontend (React Native)
```
src/
├── screens/          # 10 main screens + auth screens
├── components/       # Reusable UI components
├── navigation/       # Navigation structure
├── theme/           # Colors and typography
└── App.tsx          # Main entry point
```

### Backend (Express.js + Prisma)
```
backend/
├── server.ts        # Express server with 40+ API endpoints
├── prisma/
│   └── schema.prisma # 11-model database schema
└── .env             # Environment configuration
```

### Database (PostgreSQL)
- Users
- Transactions
- Jars
- Goals
- Assets
- Portfolio
- Alerts
- AI Insights
- Chat Messages
- SMS Records
- Spending Habits

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Expo CLI
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/inskillify/FINPILOT.git
cd FINPILOT
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Setup backend**
```bash
cd backend
npm install
npx prisma migrate dev --name init
```

4. **Configure environment**
Create `.env` file in backend:
```
DATABASE_URL="postgresql://user:password@localhost:5432/finpilot_db"
JWT_SECRET="your-secret-key"
PORT=3000
```

5. **Start backend server**
```bash
cd backend
npm run dev
```

6. **Start frontend**
```bash
npm start
# or
expo start
```

## 📦 Key Dependencies

### Frontend
- `react-native` - Mobile framework
- `@react-navigation` - Navigation
- `expo` - Development platform
- `@expo/vector-icons` - Icons
- `react-native-gesture-handler` - Gestures

### Backend
- `express` - Web framework
- `prisma` - ORM
- `postgresql` - Database
- `jsonwebtoken` - Authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin support

## 🎨 Design System

### Colors
- **Primary**: #3B82F6 (Blue)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Danger**: #EF4444 (Red)
- **Background**: #F9FAFB (Light Gray)
- **Text**: #1F2937 (Dark Gray)

### Typography
- **H1**: 32px, Bold
- **H2**: 28px, Bold
- **H3**: 24px, Bold
- **H4**: 18px, Semibold
- **Body**: 16px, Regular
- **Small**: 14px, Regular
- **Caption**: 12px, Regular

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Biometric login support
- Two-factor authentication
- Secure data encryption
- CORS protection
- Input validation

## 📊 API Endpoints (40+)

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Dashboard
- `GET /dashboard` - Get dashboard data

### Transactions
- `GET /transactions` - List transactions
- `POST /transactions` - Create transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `POST /transactions/upload` - CSV upload

### Jars
- `GET /jars` - List jars
- `POST /jars` - Create jar
- `PUT /jars/:id` - Update jar
- `DELETE /jars/:id` - Delete jar
- `POST /jars/:id/allocate` - Allocate money

### Goals
- `GET /goals` - List goals
- `POST /goals` - Create goal
- `PUT /goals/:id` - Update goal
- `DELETE /goals/:id` - Delete goal

### Portfolio
- `GET /portfolio` - Get portfolio data
- `GET /assets` - List assets
- `POST /assets` - Add asset
- `PUT /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset

### AI Insights
- `GET /insights/predictions` - Get predictions
- `GET /insights/patterns` - Get spending patterns
- `GET /insights/optimizations` - Get recommendations

### Alerts
- `GET /alerts` - List alerts
- `POST /alerts` - Create alert
- `PUT /alerts/:id` - Update alert
- `DELETE /alerts/:id` - Delete alert

### SMS Parser
- `POST /sms/parse` - Parse SMS

### Chat
- `POST /chat/message` - Send message
- `GET /chat/history` - Get chat history

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📈 Performance Optimizations

- Lazy loading of screens
- Memoized components
- Efficient list rendering
- Image optimization
- Code splitting
- Bundle size optimization

## 🔄 State Management

- React Context API for global state
- Local component state for UI
- Redux (optional for complex state)

## 📱 Responsive Design

- Mobile-first approach
- Tablet support
- Landscape orientation support
- Safe area handling

## 🌐 Internationalization

- Multi-language support ready
- Currency localization
- Date/time formatting

## 📝 Code Structure

### Component Pattern
```typescript
interface ComponentProps {
  // Props definition
}

const Component: React.FC<ComponentProps> = (props) => {
  // Component logic
  return (
    // JSX
  );
};

export default Component;
```

### Screen Pattern
```typescript
const ScreenName = ({ navigation }: any) => {
  // Screen logic
  return (
    <View style={styles.container}>
      {/* Screen content */}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles
});

export default ScreenName;
```

## 🚀 Deployment

### Frontend
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit
```

### Backend
```bash
# Deploy to Heroku
git push heroku main

# Deploy to AWS
# Configure AWS credentials and deploy
```

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Component Guide](./docs/COMPONENTS.md)
- [Setup Guide](./docs/SETUP.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: INskillify
- **Email**: inskillify@gmail.com

## 🙏 Acknowledgments

- React Native community
- Expo team
- Prisma team
- All contributors

## 📞 Support

For support, email inskillify@gmail.com or open an issue on GitHub.

## 🔗 Links

- **GitHub**: https://github.com/inskillify/FINPILOT
- **Live Demo**: (Coming soon)
- **Documentation**: (Coming soon)

---

**Last Updated**: November 26, 2025
**Version**: 1.0.0
