import 'package:flutter/material.dart';

import 'screens/auth/login_screen.dart';
import 'screens/home/home_screen.dart';
import 'services/token_storage.dart';

void main() {
  runApp(const PersonalTrainerApp());
}

class PersonalTrainerApp extends StatelessWidget {
  const PersonalTrainerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Personal Trainer',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2F855A),
        ),
      ),
      home: const StartupScreen(),
    );
  }
}

class StartupScreen extends StatelessWidget {
  const StartupScreen({super.key});

  Future<bool> _isLoggedIn() async {
    return await TokenStorage().hasToken();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: _isLoggedIn(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(
                color: Color(0xFF2F855A),
              ),
            ),
          );
        }

        if (snapshot.data == true) {
          return const HomeScreen();
        }

        return const LoginScreen();
      },
    );
  }
}