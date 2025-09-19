import 'package:flutter/material.dart';

class AnnouncementsScreen extends StatelessWidget {
  const AnnouncementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> anuncios = [
      {
        "titulo": "Reunión de Padres",
        "contenido": "Se convoca a todos los padres este viernes a las 18:00."
      },
      {
        "titulo": "Examen Final de Matemáticas",
        "contenido": "El examen final se realizará el lunes 22 de septiembre."
      },
      {
        "titulo": "Feriado Nacional",
        "contenido": "No habrá clases el miércoles 25 por feriado."
      },
    ];

    return Scaffold(
      appBar: AppBar(title: const Text("Anuncios")),
      body: ListView.builder(
        itemCount: anuncios.length,
        itemBuilder: (context, index) {
          final anuncio = anuncios[index];
          return Card(
            margin: const EdgeInsets.all(8),
            child: ListTile(
              leading: const Icon(Icons.campaign, color: Colors.blue),
              title: Text(anuncio["titulo"]!,
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(anuncio["contenido"]!),
            ),
          );
        },
      ),
    );
  }
}
