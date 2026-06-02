# Firebase Example - User Input Flutter Application

A Flutter application that demonstrates user input collection and integration with Firebase Firestore for data persistence.

## Features

- User input form with validation
- Firebase Firestore integration
- Real-time data storage
- User feedback with loading states
- Clean and responsive UI design

## Project Structure

```
lib/
├── main.dart           # Main application entry point with Firebase initialization
├── userinput.dart      # User input widget with Firestore integration
└── firebase_options.dart  # Firebase configuration
```

## Getting Started

### Prerequisites

- Flutter SDK (^3.11.4)
- Dart SDK
- Firebase project setup
- Android Studio or Xcode (for platform-specific setup)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/firebaseexample.git
cd firebaseexample
```

2. Install dependencies:
```bash
flutter pub get
```

3. Configure Firebase:
   - Replace the placeholder credentials in `lib/firebase_options.dart` with your Firebase project credentials
   - Run `flutterfire configure` to auto-setup Firebase

4. Run the application:
```bash
flutter run
```

## Firebase Setup

### Firestore Collection: `users`

Document structure:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "timestamp": "server_timestamp"
}
```

## Dependencies

- `firebase_core: ^2.24.0` - Firebase core functionality
- `cloud_firestore: ^4.13.0` - Firestore database
- `firebase_auth: ^4.16.0` - Firebase authentication

## Usage

1. Launch the application
2. Fill in the user input form with:
   - Name
   - Email
   - Phone number
3. Click "Save User" button
4. Data will be automatically saved to Firestore

## Project Development

This project was developed with three key commits:

1. **Commit 1**: Initial setup with Firebase integration and dependencies
2. **Commit 2**: UserInput widget implementation with Firestore integration
3. **Commit 3**: UI refinement and user feedback improvements

## Developers

- Created as an educational example for Firebase Firestore integration in Flutter

## License

MIT License - Feel free to use and modify for educational purposes

## Support

For issues and questions, please contact or create an issue in the repository.

---

**Note**: Before deploying to production, ensure to:
- Update Firebase security rules
- Replace placeholder credentials with actual Firebase project credentials
- Test on actual devices
- Implement user authentication if needed
