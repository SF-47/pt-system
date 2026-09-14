import 'package:flutter/material.dart';

import '../../models/client.dart';
import '../../services/client_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ClientService _clientService = ClientService();

  Client? _client;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final client = await _clientService.getProfile();

      if (!mounted) return;

      setState(() {
        _client = client;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8F6),
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: const Color(0xFF2F855A),
        foregroundColor: Colors.white,
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          color: Color(0xFF2F855A),
        ),
      );
    }

    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            _errorMessage!,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Color(0xFFDC2626),
            ),
          ),
        ),
      );
    }

    if (_client == null) {
      return const Center(
        child: Text('No profile data available.'),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          const CircleAvatar(
            radius: 45,
            backgroundColor: Color(0xFFEAF6EF),
            child: Icon(
              Icons.person,
              size: 50,
              color: Color(0xFF2F855A),
            ),
          ),

          const SizedBox(height: 16),

          Text(
            _client!.fullName,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937),
            ),
          ),

          const SizedBox(height: 24),

          _ProfileItem(
            icon: Icons.person_outline,
            label: 'Username',
            value: _client!.username,
          ),

          _ProfileItem(
            icon: Icons.email_outlined,
            label: 'Email',
            value: _client!.email,
          ),

          _ProfileItem(
            icon: Icons.phone_outlined,
            label: 'Phone',
            value: _client!.phoneNumber,
          ),

          _ProfileItem(
            icon: Icons.check_circle_outline,
            label: 'Account Status',
            value: _client!.isActive ? 'Active' : 'Inactive',
          ),
        ],
      ),
    );
  }
}

class _ProfileItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _ProfileItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      color: Colors.white,
      elevation: 1,
      child: ListTile(
        leading: Icon(
          icon,
          color: const Color(0xFF2F855A),
        ),
        title: Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            color: Color(0xFF6B7280),
          ),
        ),
        subtitle: Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            color: Color(0xFF1F2937),
          ),
        ),
      ),
    );
  }
}