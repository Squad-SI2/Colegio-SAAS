import 'package:flutter/material.dart';
import '../../../data/repositories/attendance_repository.dart';

class AsistenciaEstudianteScreen extends StatefulWidget {
  final int studentId; // Lo recibimos desde el login/dashboard

  const AsistenciaEstudianteScreen({super.key, required this.studentId});

  @override
  State<AsistenciaEstudianteScreen> createState() => _AsistenciaEstudianteScreenState();
}

class _AsistenciaEstudianteScreenState extends State<AsistenciaEstudianteScreen> {
  List<dynamic> asistencia = [];
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    cargarAsistencia();
  }

  void cargarAsistencia() async {
    try {
      final data = await AttendanceRepository.getByStudent(widget.studentId);
      setState(() {
        asistencia = data;
        cargando = false;
      });
    } catch (e) {
      setState(() => cargando = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error al cargar asistencia: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Asistencia")),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : asistencia.isEmpty
              ? const Center(child: Text("No hay registros de asistencia"))
              : ListView.builder(
                  itemCount: asistencia.length,
                  itemBuilder: (context, index) {
                    final registro = asistencia[index];
                    return Card(
                      child: ListTile(
                        leading: Icon(
                          registro["estado"] == "Presente"
                              ? Icons.check_circle
                              : Icons.cancel,
                          color: registro["estado"] == "Presente"
                              ? Colors.green
                              : Colors.red,
                        ),
                        title: Text("Fecha: ${registro["fecha"]}"),
                        subtitle: Text("Estado: ${registro["estado"]}"),
                      ),
                    );
                  },
                ),
    );
  }
}
