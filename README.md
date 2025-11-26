# FINPILOT - Personal Finance Management App

A comprehensive React Native application for managing personal finances with AI-powered insights and automated transaction tracking.

## Features

### 10 Main Screens

1. **Dashboard** - Overview of your financial status with balance card, statistics, and recent activity
2. **Transactions** - Complete transaction history with filtering options
3. **Jars** - Savings jars management for goal-based saving
4. **Goals** - Track financial goals with progress indicators
5. **AI Insights** - Personalized financial recommendations powered by AI
6. **AI Coach** - Chat interface for financial advice
7. **UPI SMS** - Automatic transaction parsing from bank SMS
8. **Portfolio** - Asset allocation and net worth tracking
9. **Alerts** - Financial notifications and reminders
10. **Settings** - User preferences and account management

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Expo Vector Icons** for icons
- Custom theme system with consistent colors and typography

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode (Mac only)
- For Android: Android Studio

## Installation

1. Clone the repository:
```bash
git clone https://github.com/inskillify/FINPILOT.git
cd FINPILOT
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
expo start
```

4. Run on your device:
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with Expo Go app

## Project Structure

```
FINPILOT/
├── App.tsx                          # Main app entry point
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Bottom tab navigation setup
│   ├── screens/
│   │   ├── DashboardScreen.tsx      # Dashboard with balance overview
│   │   ├── TransactionsScreen.tsx   # Transaction list with filters
│   │   ├── JarsScreen.tsx           # Savings jars management
│   │   ├── GoalsScreen.tsx          # Financial goals tracking
│   │   ├── AIInsightsScreen.tsx     # AI-powered insights
│   │   ├── AICoachScreen.tsx        # Chat with AI coach
│   │   ├── UPISMSScreen.tsx         # SMS transaction parser
│   │   ├── PortfolioScreen.tsx      # Portfolio and net worth
│   │   ├── AlertsScreen.tsx         # Notifications
│   │   └── SettingsScreen.tsx       # User settings
│   ├── components/
│   │   ├── BalanceCard.tsx          # Balance display component
│   │   ├── TransactionItem.tsx      # Transaction list item
│   │   ├── JarCard.tsx              # Savings jar card
│   │   ├── GoalCard.tsx             # Goal tracking card
│   │   ├── InsightCard.tsx          # AI insight card
│   │   └── Button.tsx               # Custom button component
│   └── theme/
│       ├── colors.ts                # Color palette
│       └── typography.ts            # Typography styles
├── package.json
├── tsconfig.json
└── README.md
```

## Key Components

### BalanceCard
Displays the current balance with income and expense details.

### TransactionItem
Shows individual transaction with category, amount, and date.

### JarCard
Represents a savings jar with progress bar and target amount.

### GoalCard
Displays financial goals with completion percentage.

### InsightCard
Shows AI-generated financial insights with impact levels.

## Customization

### Colors
Edit `src/theme/colors.ts` to customize the color scheme:
```typescript
export const colors = {
  primary: '#FFC107',  // Yellow accent color
  background: '#F5F5F5',
  // ... more colors
};
```

### Typography
Modify `src/theme/typography.ts` to adjust text styles:
```typescript
export const typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  // ... more styles
};
```

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Testing

This is a frontend-only implementation. You'll need to:
1. Set up a backend API for data persistence
2. Integrate with actual banking APIs for transaction data
3. Implement AI services for insights and coaching
4. Add SMS reading permissions and parsing logic
5. Connect to financial data providers for portfolio tracking

## Future Enhancements

- Backend integration with REST API
- Real-time data synchronization
- Biometric authentication
- Multi-currency support
- Export reports (PDF, CSV)
- Budget planning and tracking
- Recurring transaction management
- Bank account linking
- Investment recommendations
- Tax calculation and filing assistance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@finpilot.com or open an issue in the GitHub repository.

## Acknowledgments

- Design inspiration from modern fintech applications
- Icons by Expo Vector Icons
- Built with React Native and Expo

---

**Note**: This is a frontend implementation. Backend services, API integrations, and data persistence need to be implemented separately for a production-ready application.