import 'package:flutter/material.dart';
import '../../../data/repositories/agenda_repository.dart';

class AgendaEstudianteScreen extends StatefulWidget {
  final int studentId;

  const AgendaEstudianteScreen({super.key, required this.studentId});

  @override
  State<AgendaEstudianteScreen> createState() => _AgendaEstudianteScreenState();
}

class _AgendaEstudianteScreenState extends State<AgendaEstudianteScreen> {
  List<dynamic> agenda = [];
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    cargarAgenda();
  }

  void cargarAgenda() async {
    try {
      final data = await AgendaRepository.getByStudent(widget.studentId);
      setState(() {
        agenda = data;
        cargando = false;
      });
    } catch (e) {
      setState(() => cargando = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error al cargar agenda: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Agenda")),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : agenda.isEmpty
              ? const Center(child: Text("No hay tareas ni exámenes programados"))
              : ListView.builder(
                  itemCount: agenda.length,
                  itemBuilder: (context, index) {
                    final item = agenda[index];
                    return Card(
                      child: ListTile(
                        leading: const Icon(Icons.event_note, color: Colors.blue),
                        title: Text(item["titulo"] ?? "Actividad"),
                        subtitle: Text("Fecha: ${item["fecha"] ?? 'Sin fecha'}"),
                        trailing: Text(item["tipo"] ?? "General"),
                      ),
                    );
                  },
                ),
    );
  }
}
