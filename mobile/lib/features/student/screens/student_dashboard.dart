import 'package:flutter/material.dart';
import '../../../data/repositories/grades_repository.dart';
import '../../../data/repositories/attendance_repository.dart';
import '../../../data/repositories/announcements_repository.dart';
import '../../auth/screens/sign_in_page.dart';

class StudentDashboard extends StatefulWidget {
  const StudentDashboard({super.key});

  @override
  State<StudentDashboard> createState() => _StudentDashboardState();
}

class _StudentDashboardState extends State<StudentDashboard> {
  double promedio = 0.0;
  double asistencia = 0.0;
  String ultimoAnuncio = "";
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    cargarDatos();
  }

  void cargarDatos() async {
    try {
      // 👇 Aquí luego deberías usar el id real del estudiante que venga del login
      const estudianteId = 1;

      final notas = await GradesRepository.getByStudent(estudianteId);
      final asistencias = await AttendanceRepository.getByStudent(estudianteId);
      final anuncios = await AnnouncementsRepository.getAnnouncements();

      setState(() {
        promedio = _calcularPromedio(notas);
        asistencia = _calcularAsistencia(asistencias);
        ultimoAnuncio = anuncios.isNotEmpty ? anuncios.first["titulo"] : "";
        cargando = false;
      });
    } catch (e) {
      setState(() => cargando = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error al cargar datos: $e")),
      );
    }
  }

  double _calcularPromedio(List<dynamic> notas) {
    if (notas.isEmpty) return 0.0;
    final total = notas
        .map((n) => (n["nota"] as num).toDouble())
        .reduce((a, b) => a + b);
    return total / notas.length;
  }

  double _calcularAsistencia(List<dynamic> asistencias) {
    if (asistencias.isEmpty) return 0.0;
    final presentes =
        asistencias.where((a) => a["estado"] == "Presente").length;
    return (presentes / asistencias.length) * 100;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Jesvaw EduSoft"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const SignInPage2()),
                (route) => false,
              );
            },
          )
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const UserAccountsDrawerHeader(
              decoration: BoxDecoration(color: Colors.blue),
              accountName: Text("Estudiante"),
              accountEmail: Text("student@test.com"),
              currentAccountPicture: CircleAvatar(
                backgroundColor: Colors.white,
                child: Icon(Icons.person, size: 40, color: Colors.blue),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.grade),
              title: const Text("Notas"),
              onTap: () {
                Navigator.pushNamed(context, "/notas");
              },
            ),
            ListTile(
              leading: const Icon(Icons.fact_check),
              title: const Text("Asistencia"),
              onTap: () {
                Navigator.pushNamed(context, "/asistencia");
              },
            ),
            ListTile(
              leading: const Icon(Icons.event),
              title: const Text("Agenda"),
              onTap: () {
                Navigator.pushNamed(context, "/agenda");
              },
            ),
            ListTile(
              leading: const Icon(Icons.campaign),
              title: const Text("Anuncios"),
              onTap: () {
                Navigator.pushNamed(context, "/announcements");
              },
            ),
          ],
        ),
      ),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    "Bienvenido Estudiante",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  Card(
                    color: Colors.blue[50],
                    child: ListTile(
                      leading: const Icon(Icons.grade, color: Colors.blue),
                      title: const Text("Promedio de Notas"),
                      trailing: Text(
                        promedio.toStringAsFixed(1),
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Card(
                    color: Colors.green[50],
                    child: ListTile(
                      leading: const Icon(Icons.fact_check, color: Colors.green),
                      title: const Text("Asistencia"),
                      trailing: Text(
                        "${asistencia.toStringAsFixed(1)}%",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Card(
                    color: Colors.orange[50],
                    child: ListTile(
                      leading:
                          const Icon(Icons.campaign, color: Colors.orange),
                      title: const Text("Último Anuncio"),
                      subtitle: Text(ultimoAnuncio),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
