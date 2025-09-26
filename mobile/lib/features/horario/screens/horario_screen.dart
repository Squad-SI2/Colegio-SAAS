import 'package:flutter/material.dart';

class HorarioScreen extends StatelessWidget {
  const HorarioScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Horario")),
      body: const Center(
        child: Text(
          "Pantalla de Horario (placeholder)",
          style: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}
