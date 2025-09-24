import 'package:flutter/material.dart';
import '../../../data/repositories/announcements_repository.dart';

class AnnouncementsScreen extends StatefulWidget {
  const AnnouncementsScreen({super.key});

  @override
  State<AnnouncementsScreen> createState() => _AnnouncementsScreenState();
}

class _AnnouncementsScreenState extends State<AnnouncementsScreen> {
  List<dynamic> anuncios = [];
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    cargarAnuncios();
  }

  void cargarAnuncios() async {
    try {
      final data = await AnnouncementsRepository.getAnnouncements();
      setState(() {
        anuncios = data;
        cargando = false;
      });
    } catch (e) {
      setState(() => cargando = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error al cargar anuncios: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Anuncios")),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : anuncios.isEmpty
              ? const Center(child: Text("No hay anuncios disponibles"))
              : ListView.builder(
                  itemCount: anuncios.length,
                  itemBuilder: (context, index) {
                    final anuncio = anuncios[index];
                    return Card(
                      margin: const EdgeInsets.all(8),
                      child: ListTile(
                        leading: const Icon(Icons.campaign, color: Colors.blue),
                        title: Text(
                          anuncio["titulo"] ?? "Sin título",
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(anuncio["contenido"] ?? "Sin contenido"),
                      ),
                    );
                  },
                ),
    );
  }
}
