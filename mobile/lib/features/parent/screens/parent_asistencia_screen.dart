import 'package:flutter/material.dart';
import '../../../data/repositories/parent_repository.dart';

class ParentAsistenciaScreen extends StatefulWidget {
  final int parentId;

  const ParentAsistenciaScreen({super.key, required this.parentId});

  @override
  State<ParentAsistenciaScreen> createState() => _ParentAsistenciaScreenState();
}

class _ParentAsistenciaScreenState extends State<ParentAsistenciaScreen> {
  List<dynamic> hijosAsistencia = [];
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    cargarAsistenciaHijos();
  }

  void cargarAsistenciaHijos() async {
    try {
      final data = await ParentRepository.getChildrenAttendance(widget.parentId);
      setState(() {
        hijosAsistencia = data;
        cargando = false;
      });
    } catch (e) {
      setState(() => cargando = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error al cargar asistencia de hijos: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Asistencia de Hijos")),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : hijosAsistencia.isEmpty
              ? const Center(child: Text("No hay registros de asistencia"))
              : ListView.builder(
                  itemCount: hijosAsistencia.length,
                  itemBuilder: (context, index) {
                    final registro = hijosAsistencia[index];
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
                        title: Text("Estudiante: ${registro["estudiante"]}"),
                        subtitle: Text("Fecha: ${registro["fecha"]} - Estado: ${registro["estado"]}"),
                      ),
                    );
                  },
                ),
    );
  }
}
