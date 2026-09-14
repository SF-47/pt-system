class Client {
  final int id;
  final String fullName;
  final String username;
  final String email;
  final String phoneNumber;
  final bool isActive;

  Client({
    required this.id,
    required this.fullName,
    required this.username,
    required this.email,
    required this.phoneNumber,
    required this.isActive,
  });

  factory Client.fromJson(Map<String, dynamic> json) {
    return Client(
      id: json['id'],
      fullName: json['fullName'],
      username: json['username'],
      email: json['email'],
      phoneNumber: json['phoneNumber'],
      isActive: json['isActive'] ?? false,
    );
  }
}