# DEVIQ - Complete Mobile App Development Guide

## Overview

This guide provides comprehensive instructions for converting DEVIQ web platform into native iOS and Android mobile applications for App Store and Google Play submission.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [React Native Setup](#react-native-setup)
3. [iOS App Development](#ios-app-development)
4. [Android App Development](#android-app-development)
5. [App Store Submission](#app-store-submission)
6. [Google Play Submission](#google-play-submission)
7. [Payment Integration](#payment-integration)
8. [AI Integration](#ai-integration)

---

## Architecture Overview

### Technology Stack
- **Frontend**: React Native
- **Backend**: FastAPI (already built)
- **Database**: MongoDB (already configured)
- **AI**: OpenAI API / Anthropic Claude
- **Payment**: Stripe + PayStack
- **Push Notifications**: Firebase Cloud Messaging
- **Analytics**: Firebase Analytics

### App Features
- User Authentication
- AI Chat Interface
- Project Management
- Code Editor & Preview
- Template Library
- Subscription Management
- Export Functionality

---

## React Native Setup

### Prerequisites

```bash
# Install Node.js 18+
node --version

# Install React Native CLI
npm install -g react-native-cli

# For iOS (macOS only)
# Install Xcode from App Store
# Install CocoaPods
sudo gem install cocoapods

# For Android
# Install Android Studio
# Install Android SDK
# Set up environment variables
```

### Initialize Project

```bash
# Create new React Native project
npx react-native init DEVIQ --template react-native-template-typescript

cd DEVIQ
```

### Install Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

# UI Components
npm install react-native-vector-icons
npm install react-native-linear-gradient
npm install react-native-syntax-highlighter

# API & State
npm install axios
npm install @tanstack/react-query
npm install @react-native-async-storage/async-storage

# Code Editor
npm install @monaco-editor/react  # For web
npm install react-native-code-editor  # For mobile

# Payment
npm install @stripe/stripe-react-native

# AI Integration
npm install openai  # Or anthropic SDK

# Push Notifications
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging

# Analytics
npm install @react-native-firebase/analytics
```

### Project Structure

```
DEVIQ/
├── android/
├── ios/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignupScreen.tsx
│   │   ├── Dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── Projects/
│   │   │   ├── ProjectsListScreen.tsx
│   │   │   └── ProjectDetailScreen.tsx
│   │   ├── AI/
│   │   │   └── AIChat Screen.tsx
│   │   └── Settings/
│   │       └── SettingsScreen.tsx
│   ├── components/
│   │   ├── CodeEditor/
│   │   ├── ProjectCard/
│   │   └── ChatMessage/
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── storage.ts
│   ├── hooks/
│   ├── utils/
│   └── theme/
│       └── colors.ts (Dark Blue Theme)
└── App.tsx
```

---

## iOS App Development

### 1. Configure iOS Project

#### Update Info.plist

```xml
<!-- ios/DEVIQ/Info.plist -->
<key>CFBundleDisplayName</key>
<string>DEVIQ</string>

<key>CFBundleIdentifier</key>
<string>com.deviq.app</string>

<key>CFBundleVersion</key>
<string>1.0.0</string>

<!-- Permissions -->
<key>NSCameraUsageDescription</key>
<string>DEVIQ needs camera access for profile photos</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>DEVIQ needs photo library access for uploading images</string>

<key>NSUserTrackingUsageDescription</key>
<string>We use tracking to provide personalized content</string>
```

#### Configure App Icons

Required sizes:
- 1024x1024 (App Store)
- 180x180 (iPhone @3x)
- 120x120 (iPhone @2x)
- 167x167 (iPad Pro)
- 152x152 (iPad @2x)
- 76x76 (iPad)

Use Figma or Sketch to create icons with DEVIQ logo (Dark Blue background with white Code2 icon).

#### Setup CocoaPods

```bash
cd ios
pod install
cd ..
```

### 2. Build iOS App

```bash
# Development build
npx react-native run-ios

# Production build
# Open Xcode
open ios/DEVIQ.xcworkspace

# In Xcode:
# 1. Select "Any iOS Device (arm64)" as target
# 2. Product → Archive
# 3. Wait for archive to complete
# 4. Distribute App → App Store Connect → Upload
```

### 3. Code Signing

```bash
# In Xcode:
# 1. Select project in navigator
# 2. Select target "DEVIQ"
# 3. Go to "Signing & Capabilities"
# 4. Team: Select your Apple Developer Team
# 5. Bundle Identifier: com.deviq.app
# 6. Signing Certificate: Apple Distribution
```

---

## Android App Development

### 1. Configure Android Project

#### Update build.gradle

```gradle
// android/app/build.gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId \"com.deviq.app\"
        minSdkVersion 23
        targetSdkVersion 33
        versionCode 1
        versionName \"1.0.0\"
    }
    
    signingConfigs {
        release {
            storeFile file('deviq-release.keystore')
            storePassword 'YOUR_PASSWORD'
            keyAlias 'deviq'
            keyPassword 'YOUR_PASSWORD'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}\n```

#### Generate Signing Key

```bash
keytool -genkey -v -keystore android/app/deviq-release.keystore \\
  -alias deviq -keyalg RSA -keysize 2048 -validity 10000

# Answer prompts:
# Password: [Create strong password]
# First and Last Name: Mwenge Emmanuel Mobinzo
# Organization: DEVIQ
# City: Johannesburg
# State: Gauteng
# Country Code: ZA
```

#### Update AndroidManifest.xml

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\">
    
    <uses-permission android:name=\"android.permission.INTERNET\" />
    <uses-permission android:name=\"android.permission.CAMERA\" />
    <uses-permission android:name=\"android.permission.READ_EXTERNAL_STORAGE\" />
    <uses-permission android:name=\"android.permission.WRITE_EXTERNAL_STORAGE\" />
    
    <application
        android:name=\".MainApplication\"
        android:label=\"@string/app_name\"
        android:icon=\"@mipmap/ic_launcher\"
        android:roundIcon=\"@mipmap/ic_launcher_round\"
        android:allowBackup=\"false\"
        android:theme=\"@style/AppTheme\">
        
        <activity
            android:name=\".MainActivity\"
            android:label=\"@string/app_name\"
            android:configChanges=\"keyboard|keyboardHidden|orientation|screenSize|uiMode\"
            android:launchMode=\"singleTask\"
            android:windowSoftInputMode=\"adjustResize\"
            android:exported=\"true\">
            <intent-filter>
                <action android:name=\"android.intent.action.MAIN\" />
                <category android:name=\"android.intent.category.LAUNCHER\" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 2. Build Android App

```bash
# Development build
npx react-native run-android

# Production build
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## App Store Submission (iOS)

### 1. Apple Developer Account Setup

1. Go to https://developer.apple.com
2. Enroll in Apple Developer Program ($99/year)
3. Complete identity verification
4. Accept agreements

### 2. App Store Connect Setup

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in details:
   - **Platform**: iOS
   - **Name**: DEVIQ
   - **Primary Language**: English
   - **Bundle ID**: com.deviq.app
   - **SKU**: DEVIQ001
   - **User Access**: Full Access

### 3. App Information

#### Basic Info
- **Name**: DEVIQ
- **Subtitle**: AI-Powered App Development
- **Category**: Developer Tools
- **Secondary Category**: Productivity

#### Description (4000 characters max)
```
DEVIQ - AI-Powered Mobile App Development

Create stunning iOS and Android applications instantly using the power of artificial intelligence. No coding experience required.

KEY FEATURES:
✓ AI-Powered Development - Generate complete apps with AI
✓ Instant Creation - Build apps in minutes, not months
✓ Cross-Platform - iOS and Android from one codebase
✓ Smart Templates - Pre-built templates for any app type
✓ Real-time Preview - See your app as you build
✓ Code Export - Download complete source code
✓ Professional Support - Get help when you need it

PERFECT FOR:
• Entrepreneurs with app ideas
• Small businesses going mobile
• Designers without coding skills
• Students learning development
• Agencies building for clients

SUBSCRIPTION PLANS:

Free Plan:
- 3 active projects
- Basic AI assistance
- Community support
- Standard templates
- Export code

Pro Plan ($9.99/month):
- Unlimited projects
- Advanced AI features
- Priority support
- Premium templates
- Code optimization
- Export to GitHub

Enterprise Plan ($29.99/month):
- Everything in Pro
- Team collaboration
- Custom branding
- API access
- Dedicated support
- Advanced analytics

HOW IT WORKS:
1. Sign up and choose a template
2. Chat with AI to customize your app
3. Preview in real-time
4. Export and publish

TECHNICAL FEATURES:
- React Native code generation
- Native iOS & Android support
- RESTful API integration
- Firebase backend support
- Modern UI components
- Responsive design
- Dark/Light themes
- Secure authentication

DEVIQ uses advanced AI to understand your requirements and generate production-ready mobile applications. Our platform handles the complex coding while you focus on your vision.

Start building your dream app today with DEVIQ!

Privacy Policy: https://deviq.app/privacy
Terms of Service: https://deviq.app/terms
Support: support@deviq.app
```

#### Keywords (100 characters)
```
app builder,mobile dev,ai coding,no code,ios android,app maker,devtools
```

#### Support URL
```
https://deviq.app/support
```

#### Marketing URL
```
https://deviq.app
```

#### Privacy Policy URL (REQUIRED)
```
https://deviq.app/privacy
```

### 4. Pricing and Availability

- **Price**: Free (with in-app purchases)
- **Availability**: All Countries
- **In-App Purchases**:
  - Pro Monthly: $9.99
  - Pro Yearly: $99.99 (save 17%)
  - Enterprise Monthly: $29.99
  - Enterprise Yearly: $299.99 (save 17%)

### 5. Screenshots

Required sizes and quantities:

**6.7\" Display (iPhone 14 Pro Max):**
- Size: 1290 x 2796 pixels
- Minimum: 3 screenshots
- Recommended: 5-8 screenshots

**Recommended Screenshots:**
1. Landing/Hero screen with tagline
2. Project dashboard showing multiple projects
3. AI chat interface with conversation
4. Code editor with syntax highlighting
5. Template library
6. App preview/export screen
7. Subscription plans
8. Settings/profile screen

**12.9\" iPad Pro:**
- Size: 2048 x 2732 pixels
- Minimum: 3 screenshots

### 6. App Preview Video (Optional)

- Length: 15-30 seconds
- Resolution: Same as screenshot sizes
- Content: Show app creation flow from start to finish
- No external branding or ads

### 7. App Review Information

**Contact Information:**
- First Name: Mwenge
- Last Name: Mobinzo
- Phone: +27 [Your Phone]
- Email: support@deviq.app

**Demo Account (Test Credentials):**
```
Email: reviewer@deviq.app
Password: ReviewTest2025!

Notes:
- Account has Pro subscription for testing
- Sample projects already created
- All features unlocked for review
```

**Notes for Reviewer:**
```
DEVIQ is an AI-powered mobile app development platform.

To test the app:
1. Login with provided credentials
2. Click "New Project" to see AI generation
3. Chat with AI to customize the app
4. View generated code in the editor
5. Test template library
6. Review subscription plans (payment testing)

The app generates React Native code for mobile applications.
AI features may take 5-10 seconds to respond.
All subscriptions are handled via App Store In-App Purchases.

Thank you for reviewing DEVIQ!
```

### 8. Build Upload

```bash
# In Xcode after successful archive:
# 1. Window → Organizer
# 2. Select your archive
# 3. Click "Distribute App"
# 4. Select "App Store Connect"
# 5. Select "Upload"
# 6. Follow prompts to upload

# Wait 10-30 minutes for build to appear in App Store Connect
```

### 9. Submit for Review

1. Go to App Store Connect
2. Select your app
3. Click "+" to create new version (1.0.0)
4. Fill in "What's New in This Version"
5. Select build from dropdown
6. Complete all required fields
7. Click "Submit for Review"

**Review Timeline:** 24-48 hours typically

---

## Google Play Submission (Android)

### 1. Google Play Developer Account

1. Go to https://play.google.com/console
2. Pay $25 one-time registration fee
3. Complete identity verification
4. Accept agreements

### 2. Create App

1. Click "Create app"
2. Fill in details:
   - **App name**: DEVIQ
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
   - **Declarations**: Check all required boxes

### 3. Store Listing

#### App Details

**App name**: DEVIQ

**Short description** (80 characters):
```
Build iOS & Android apps instantly with AI. No coding required!
```

**Full description** (4000 characters):
```
[Use same description as iOS App Store]
```

**App icon**: 512 x 512 pixels PNG (32-bit)

**Feature graphic**: 1024 x 500 pixels PNG/JPEG

**Phone screenshots**:
- Size: 1080 x 1920 or higher
- Minimum: 2 screenshots
- Maximum: 8 screenshots
- Format: PNG or JPEG

**7-inch tablet screenshots** (optional):
- Size: 1200 x 1920 or higher

**10-inch tablet screenshots** (optional):
- Size: 1920 x 1200 or higher

**Video** (optional):
- YouTube video URL
- Demo of app functionality

#### Categorization

- **App category**: Tools
- **Tags**: app development, coding, ai, mobile apps
- **Content rating**: Complete questionnaire (Everyone)

#### Contact details

- **Email**: support@deviq.app
- **Phone**: +27 [Your Phone]
- **Website**: https://deviq.app

#### Privacy Policy

- **URL**: https://deviq.app/privacy (REQUIRED)

### 4. App Content

#### Privacy Policy

Must include:
- What data is collected
- How data is used
- How data is secured
- User data rights
- Contact information

#### Data Safety

Declare data collection:
- **Location**: Not collected
- **Personal info**: Name, Email
- **Financial info**: Payment details (via Play Billing)
- **Photos and videos**: Optional (profile pictures)
- **App activity**: Usage data, analytics

All data encrypted in transit and at rest.

#### App access

Provide test credentials:
```
Email: reviewer@deviq.app
Password: ReviewTest2025!
```

#### Ads

- Does your app contain ads?: No

#### Content ratings

Complete International Age Rating Coalition (IARC) questionnaire:
- Violence: None
- Sexuality: None
- Language: None
- Controlled Substances: None
- Miscellaneous: None

Result: Rated for Everyone

#### Target audience

- **Target age**: 13+
- **Appeal to children**: No

#### News app

- Is this a news app?: No

#### COVID-19 contact tracing

- Contains contact tracing/status features?: No

### 5. Build Upload

```bash
# Upload AAB file
# In Google Play Console:
# 1. Go to "Release" → "Production"
# 2. Click "Create new release"
# 3. Click "Upload" and select app-release.aab
# 4. Add release notes
# 5. Save and review
```

#### Release notes (500 characters):
```
DEVIQ v1.0.0 - Initial Release

✓ AI-powered app development
✓ Generate iOS & Android apps
✓ Smart templates library
✓ Real-time code preview
✓ Export source code
✓ Subscription plans
✓ Dark blue theme

Create mobile apps in minutes with AI!
```

### 6. Pricing & Distribution

- **Countries**: Select all countries
- **Pricing**: Free (with in-app products)
- **In-app products**:
  - Pro Monthly: $9.99
  - Pro Yearly: $99.99
  - Enterprise Monthly: $29.99
  - Enterprise Yearly: $299.99

### 7. Submit for Review

1. Complete all sections (green checkmarks)
2. Click "Review release"
3. Review all information
4. Click "Start rollout to Production"

**Review Timeline:** Few hours to 7 days

---

## Payment Integration

### Stripe Setup

```bash
npm install @stripe/stripe-react-native
```

```typescript
// src/services/payment.ts
import { useStripe } from '@stripe/stripe-react-native';

export const subscribeToplan = async (plan: string) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  // Get client secret from backend
  const response = await fetch(`${API_URL}/api/subscriptions/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ plan })
  });
  
  const { clientSecret } = await response.json();
  
  // Initialize payment sheet
  const { error } = await initPaymentSheet({
    paymentIntentClientSecret: clientSecret,
    merchantDisplayName: 'DEVIQ',
  });
  
  if (error) {
    throw error;
  }
  
  // Present payment sheet
  const { error: paymentError } = await presentPaymentSheet();
  
  if (paymentError) {
    throw paymentError;
  }
  
  return { success: true };
};
```

### App Store In-App Purchases (iOS)

```bash
npm install react-native-iap
```

```typescript
// src/services/iap.ts
import * as RNIap from 'react-native-iap';

const productIds = [
  'com.deviq.pro.monthly',
  'com.deviq.pro.yearly',
  'com.deviq.enterprise.monthly',
  'com.deviq.enterprise.yearly',
];

export const initIAP = async () => {
  await RNIap.initConnection();
  await RNIap.getProducts(productIds);
};

export const purchaseProduct = async (productId: string) => {
  try {
    const purchase = await RNIap.requestPurchase(productId);
    
    // Verify with backend
    await fetch(`${API_URL}/api/subscriptions/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ purchase })
    });
    
    // Finish transaction
    await RNIap.finishTransaction(purchase, false);
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};
```

### Google Play Billing (Android)

Uses same `react-native-iap` library with different product IDs.

---

## AI Integration

### OpenAI Integration

```bash
npm install openai
```

```typescript
// src/services/ai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateCode = async (prompt: string, context: any) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an expert mobile app developer specializing in React Native. Generate clean, production-ready code.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });
  
  return response.choices[0].message.content;
};
```

### Backend AI Route (Already Created)

The backend already has AI routes that need to be connected to OpenAI:

```python
# In backend/routes/ai_routes.py
# Replace generate_ai_response function with:

import openai
import os

openai.api_key = os.environ.get('OPENAI_API_KEY')

def generate_ai_response(message: str, project: dict, history: list) -> dict:
    # Build context from project and history
    context = f\"\"\"
    Project: {project['name']}
    Type: {project['appType']}
    Platform: {project['platform']}
    
    User request: {message}
    \"\"\"
    
    response = openai.ChatCompletion.create(
        model=\"gpt-4\",
        messages=[
            {\"role\": \"system\", \"content\": \"You are a mobile app development assistant.\"},
            {\"role\": \"user\", \"content\": context}
        ],
        temperature=0.7,
        max_tokens=2000
    )
    
    ai_message = response.choices[0].message.content
    
    return {
        \"message\": ai_message,
        \"code\": parse_code_from_response(ai_message),
        \"suggestions\": generate_suggestions(ai_message)
    }
```

---

## Testing Checklist

### Functionality
- [ ] User registration and login
- [ ] Create new project
- [ ] AI chat generates code
- [ ] Code editor displays correctly
- [ ] Template library loads
- [ ] Subscription purchase flow
- [ ] Project export
- [ ] Settings and profile

### Performance
- [ ] App launches in < 3 seconds
- [ ] AI responses in < 10 seconds
- [ ] Smooth scrolling and animations
- [ ] No memory leaks
- [ ] Works offline (cached data)

### UI/UX
- [ ] Dark blue theme consistent
- [ ] All buttons responsive
- [ ] Forms validate correctly
- [ ] Loading states visible
- [ ] Error messages clear
- [ ] Navigation intuitive

### Platform-Specific
- [ ] iOS: Back swipe gesture works
- [ ] Android: Back button handled
- [ ] Push notifications work
- [ ] Deep links functional
- [ ] Share functionality works

---

## Launch Checklist

### Pre-Launch
- [ ] All features tested
- [ ] Payment integration working
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Support email configured
- [ ] Analytics setup
- [ ] Crash reporting enabled
- [ ] App Store assets ready
- [ ] Screenshots captured
- [ ] App description written

### Launch Day
- [ ] Submit iOS build
- [ ] Submit Android build
- [ ] Monitor review status
- [ ] Prepare marketing materials
- [ ] Social media announcement ready
- [ ] Support team briefed

### Post-Launch
- [ ] Monitor reviews
- [ ] Track analytics
- [ ] Fix critical bugs ASAP
- [ ] Plan feature updates
- [ ] Engage with users

---

## Support & Resources

### Documentation
- React Native: https://reactnative.dev
- iOS Guidelines: https://developer.apple.com/design/human-interface-guidelines
- Android Guidelines: https://material.io/design
- Stripe: https://stripe.com/docs
- OpenAI: https://platform.openai.com/docs

### Support
- Email: support@deviq.app
- Developer: mwengeemmanuel@deviq.app

### Payment Account
All revenue goes to:
- **Account Holder**: Mwenge Emmanuel Mobinzo
- **Account Number**: 19195042437
- **Bank**: Discovery Bank
- **Branch Code**: 679000
- **SWIFT**: DISCZAJJXXX

---

## Conclusion

This guide provides everything needed to convert DEVIQ web platform into production mobile apps. Follow each section carefully and test thoroughly before submission.

For technical support or questions, contact: support@deviq.app

**Good luck with your app launch! 🚀**
