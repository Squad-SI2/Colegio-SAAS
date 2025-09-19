import 'package:flutter/material.dart';
import '../../../data/repositories/parent_repository.dart';

class ParentNotasScreen extends StatefulWidget {
  final int parentId;

  const ParentNotasScreen({super.key, required this.parentId});

  @override
  State<ParentNotasScreen> createState() => _ParentNotasScreenState();
}

class _ParentNotasScreenState extends State<ParentNotasScreen> {
  List<dynamic> notasHijos = [];
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    cargarNotasHijos();
  }

  void cargarNotasHijos() async {
    try {
      final data = await ParentRepository.getChildrenGrades(widget.parentId);
      setState(() {
        notasHijos = data;
        cargando = false;
      });
    } catch (e) {
      setState(() => cargando = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error al cargar notas de hijos: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Notas de Hijos")),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : notasHijos.isEmpty
              ? const Center(child: Text("No hay notas registradas"))
              : ListView.builder(
                  itemCount: notasHijos.length,
                  itemBuilder: (context, index) {
                    final registro = notasHijos[index];
                    return Card(
                      child: ListTile(
                        leading: const Icon(Icons.person, color: Colors.green),
                        title: Text("Hijo: ${registro["estudiante"]}"),
                        subtitle: Text("Materia: ${registro["materia"]}"),
                        trailing: Text(
                          "${registro["nota"]}",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: (registro["nota"] ?? 0) >= 51
                                ? Colors.green
                                : Colors.red,
                          ),
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
