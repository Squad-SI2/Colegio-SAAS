import 'package:flutter/material.dart';
import '../../../data/repositories/parent_repository.dart';
import '../../../data/repositories/announcements_repository.dart';
import '../../auth/screens/sign_in_page.dart';

class ParentDashboard extends StatefulWidget {
  const ParentDashboard({super.key});

  @override
  State<ParentDashboard> createState() => _ParentDashboardState();
}

class _ParentDashboardState extends State<ParentDashboard> {
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
      // 👇 Aquí luego deberías usar el id real del padre que venga del login
      const parentId = 1;

      final hijos = await ParentRepository.getChildren(parentId);

      if (hijos.isNotEmpty) {
        final notas =
            await ParentRepository.getChildrenGrades(parentId);
        final asistencias =
            await ParentRepository.getChildrenAttendance(parentId);
        final anuncios = await AnnouncementsRepository.getAnnouncements();

        setState(() {
          promedio = _calcularPromedio(notas);
          asistencia = _calcularAsistencia(asistencias);
          ultimoAnuncio =
              anuncios.isNotEmpty ? anuncios.first["titulo"] : "";
          cargando = false;
        });
      } else {
        setState(() => cargando = false);
      }
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
              decoration: BoxDecoration(color: Colors.green),
              accountName: Text("Padre"),
              accountEmail: Text("parent@test.com"),
              currentAccountPicture: CircleAvatar(
                backgroundColor: Colors.white,
                child: Icon(Icons.person, size: 40, color: Colors.green),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.grade),
              title: const Text("Notas de Hijos"),
              onTap: () {
                Navigator.pushNamed(context, "/parentNotas");
              },
            ),
            ListTile(
              leading: const Icon(Icons.fact_check),
              title: const Text("Asistencia de Hijos"),
              onTap: () {
                Navigator.pushNamed(context, "/parentAsistencia");
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
                    "Bienvenido Padre",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  Card(
                    color: Colors.blue[50],
                    child: ListTile(
                      leading: const Icon(Icons.grade, color: Colors.blue),
                      title: const Text("Promedio de Notas de Hijos"),
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
                      title: const Text("Asistencia de Hijos"),
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
