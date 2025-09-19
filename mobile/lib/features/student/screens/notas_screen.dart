import 'package:flutter/material.dart';

class NotasScreen extends StatelessWidget {
  const NotasScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> notas = [
      {"materia": "Matemáticas", "nota": 85},
      {"materia": "Lenguaje", "nota": 90},
      {"materia": "Ciencias", "nota": 78},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text("Notas")),
      body: ListView.builder(
        itemCount: notas.length,
        itemBuilder: (context, index) {
          final item = notas[index];
          return Card(
            child: ListTile(
              leading: const Icon(Icons.book),
              title: Text(item["materia"]),
              trailing: Text(
                item["nota"].toString(),
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
