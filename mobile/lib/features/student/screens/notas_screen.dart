import 'package:flutter/material.dart';
import '../../../data/repositories/grades_repository.dart';

class NotasEstudianteScreen extends StatefulWidget {
  final int studentId;

  const NotasEstudianteScreen({super.key, required this.studentId});

  @override
  State<NotasEstudianteScreen> createState() => _NotasEstudianteScreenState();
}

class _NotasEstudianteScreenState extends State<NotasEstudianteScreen> {
  List<dynamic> notas = [];
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    cargarNotas();
  }

  void cargarNotas() async {
    try {
      final data = await GradesRepository.getByStudent(widget.studentId);
      setState(() {
        notas = data;
        cargando = false;
      });
    } catch (e) {
      setState(() => cargando = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error al cargar notas: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Notas")),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : notas.isEmpty
              ? const Center(child: Text("No hay notas registradas"))
              : ListView.builder(
                  itemCount: notas.length,
                  itemBuilder: (context, index) {
                    final nota = notas[index];
                    return Card(
                      child: ListTile(
                        leading: const Icon(Icons.book, color: Colors.blue),
                        title: Text(nota["materia"] ?? "Materia"),
                        trailing: Text(
                          "${nota["nota"]}",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: (nota["nota"] ?? 0) >= 51
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
