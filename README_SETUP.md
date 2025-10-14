# MindYatra - Mental Wellness App

A comprehensive React Native mental health application with 4 main services, subscription system, and professional booking features.

## 🎯 Features

### Free Services
1. **AI Text Analysis** - Analyze your thoughts and get sentiment analysis with emotional breakdown and personalized advice
2. **Depression Meter** - Take a 9-question PHQ-9 based assessment with instant results and recommendations

### Premium Services (₹250 India / $50 International)
3. **Unarathma Service** - AI + Doctor reports with direct doctor consultation
4. **Activity Hub** - Access to music, videos, games, books, and mental wellness blogs

### Additional Features
- **Session Booking** - Book sessions with psychologists and therapists
- **User Profile** - Manage account and subscription status
- **Secure Authentication** - Login/Signup with validation

## 📁 Project Structure

```
mindyatra-app/
├── App.js
├── app.json
├── package.json
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── HomeScreen.js
│   │   ├── AIAnalysisScreen.js
│   │   ├── DepressionMeterScreen.js
│   │   ├── UnarathmaScreen.js
│   │   ├── ActivityHubScreen.js
│   │   ├── BookingScreen.js
│   │   ├── SubscriptionScreen.js
│   │   └── ProfileScreen.js
│   ├── components/
│   │   ├── Header.js
│   │   ├── Button.js
│   │   └── ChartComponent.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── payment.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   └── utils/
│       ├── constants.js
│       └── validation.js
└── assets/
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Required Dependencies

Install the following packages:

```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install @react-native-async-storage/async-storage
npm install @react-native-picker/picker
npm install react-native-screens react-native-safe-area-context
npm install @expo/vector-icons
```

Or if you're using Expo (recommended):

```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install @react-native-async-storage/async-storage
npx expo install @react-native-picker/picker
npx expo install react-native-screens react-native-safe-area-context
```

## 📦 Package.json Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-native-async-storage/async-storage": "1.18.2",
    "@react-native-picker/picker": "2.4.10",
    "react-native-screens": "~3.22.0",
    "react-native-safe-area-context": "4.6.3",
    "@expo/vector-icons": "^13.0.0",
    "expo": "~49.0.0",
    "expo-status-bar": "~1.6.0"
  }
}
```

## 🏃‍♂️ Running the App

### Development Mode

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

## 🎨 User Flow

1. **Login/Signup** → User creates account (country selection for pricing)
2. **Home Screen** → View all 4 services with premium badges
3. **Free Services** → Access AI Analysis & Depression Meter
4. **Premium Wall** → Prompt to subscribe for Unarathma & Activity Hub
5. **Subscription** → One-time payment (₹250 or $50)
6. **Full Access** → All services unlocked after payment
7. **Session Booking** → Book appointments with professionals
8. **Profile** → View subscription status and manage account

## 🔒 Premium Access Logic

- **Unarathma** & **Activity Hub** require premium subscription
- User prompted to subscribe when accessing premium features
- Subscription persists in AsyncStorage
- Premium status verified on app launch and screen focus

## 🛠️ Customization

### API Integration
Replace mock API calls in `src/services/api.js` with your actual backend:

```javascript
const API_BASE_URL = 'https://your-api-url.com/api';
```

### Payment Gateway
Integrate actual payment in `src/services/payment.js`:
- **India**: Razorpay
- **International**: Stripe

### Styling
Modify colors and sizes in `src/utils/constants.js`:

```javascript
export const COLORS = {
  primary: '#6366f1',  // Change app theme color
  secondary: '#8b5cf6',
  // ...
};
```

## 📱 Screen Descriptions

### LoginScreen & SignupScreen
- Email/password authentication
- Form validation
- Country selection (for pricing)
- Password visibility toggle

### HomeScreen
- Service grid with 4 main services
- Premium badges on locked services
- Quick access to booking
- Premium banner for free users

### AIAnalysisScreen
- Text input for thoughts/feelings
- Sentiment analysis results
- Emotion breakdown chart
- Personalized advice

### DepressionMeterScreen
- 9-question PHQ-9 assessment
- Progress tracking
- Severity scoring (Minimal/Mild/Moderate/Severe)
- Recommendations based on results

### UnarathmaScreen
- Comprehensive assessment form
- AI-powered analysis
- Doctor consultation option
- Report generation with ID

### ActivityHubScreen
- Tabbed interface (Music, Videos, Games, Books, Blogs)
- Content categories with items
- Play/Read functionality

### BookingScreen
- Specialist selection
- Date/time slot picker
- Session type (Video/Audio)
- Booking summary

### SubscriptionScreen
- Pricing display (India/International)
- Feature list
- Testimonials
- Payment processing

### ProfileScreen
- User information
- Subscription status
- Quick stats
- Settings & logout

## 🔐 Security Notes

- Passwords should be hashed before storage (implement backend)
- Use secure storage for tokens
- Implement proper API authentication
- Add payment gateway security (PCI compliance)
- Enable HTTPS for all API calls

## 🐛 Troubleshooting

### Common Issues

**Navigation not working:**
```bash
npm install @react-navigation/native-stack
```

**AsyncStorage errors:**
```bash
npx expo install @react-native-async-storage/async-storage
```

**Icon not showing:**
```bash
npm install @expo/vector-icons
```

## 📝 TODO (Backend Integration)

- [ ] Connect to actual AI/ML API for text analysis
- [ ] Integrate real-time booking system
- [ ] Add payment gateway (Razorpay/Stripe)
- [ ] Implement user authentication backend
- [ ] Set up database for user data
- [ ] Add push notifications
- [ ] Implement actual video/audio call functionality
- [ ] Add content management system for Activity Hub

## 🤝 Contributing

This is a complete mental wellness application. To extend:
1. Add more assessment tools
2. Integrate real-time chat with doctors
3. Add progress tracking over time
4. Implement mood journal
5. Add community support forums

## 📄 License

This project is for educational purposes. Modify as needed for your use case.

## 💡 Notes

- All API calls are currently mocked - replace with actual backend
- Payment processing is simulated - integrate real payment gateway
- User data stored locally in AsyncStorage - implement proper database
- Charts are custom built - can replace with libraries like react-native-chart-kit

---

**Built with React Native & Expo**

For support: support@mindyatra.com
