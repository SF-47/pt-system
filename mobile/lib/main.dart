import 'package:flutter/material.dart';

import 'screens/startup/startup_screen.dart';

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