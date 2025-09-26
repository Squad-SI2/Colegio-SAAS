import 'package:flutter/material.dart';

class TeacherDashboard extends StatelessWidget {
  const TeacherDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Dashboard Docente")),
      body: const Center(
        child: Text(
          "Pantalla Docente (placeholder)",
          style: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}
