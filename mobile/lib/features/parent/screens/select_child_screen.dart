import 'package:flutter/material.dart';
import '../../../routes/app_routes.dart';

class SelectChildScreen extends StatelessWidget {
  const SelectChildScreen({super.key});

  // 🔹 Dummy: lista de hijos, luego esto vendrá del backend
  final List<Map<String, String>> children = const [
    {"name": "Juan Pérez", "grade": "3ro Primaria"},
    {"name": "Ana Pérez", "grade": "1ro Secundaria"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Seleccionar hijo")),
      body: ListView.builder(
        itemCount: children.length,
        itemBuilder: (context, index) {
          final child = children[index];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListTile(
              leading: const Icon(Icons.person, size: 32),
              title: Text(child["name"]!),
              subtitle: Text(child["grade"]!),
              onTap: () {
                Navigator.pushReplacementNamed(
                  context,
                  AppRoutes.parentDashboard,
                  arguments: child, // 🔹 pasamos hijo seleccionado
                );
              },
            ),
          );
        },
      ),
    );
  }
}
