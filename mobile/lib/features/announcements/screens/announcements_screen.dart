import 'package:flutter/material.dart';

class AnnouncementsScreen extends StatelessWidget {
  const AnnouncementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Dummy de anuncios
    final List<Map<String, String>> announcements = [
      {
        "titulo": "Reunión de padres",
        "contenido": "Se convoca a todos los padres de familia del curso 3ro de primaria.",
        "categoria": "Reunión",
        "fecha": "2025-09-05 18:00",
        "adjunto": "PDF: convocatoria.pdf"
      },
      {
        "titulo": "Examen de Matemáticas",
        "contenido": "El examen trimestral de matemáticas será el 12 de septiembre.",
        "categoria": "Examen",
        "fecha": "2025-09-12 08:00",
        "adjunto": ""
      },
      {
        "titulo": "Pago de pensiones",
        "contenido": "Recordatorio de pago de la pensión escolar antes del 15 de septiembre.",
        "categoria": "Aviso",
        "fecha": "2025-09-15 23:59",
        "adjunto": ""
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text("Anuncios"),
      ),
      body: ListView.builder(
        itemCount: announcements.length,
        itemBuilder: (context, index) {
          final anuncio = announcements[index];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Título
                  Text(
                    anuncio["titulo"]!,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 6),

                  // Categoría y fecha
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Chip(
                        label: Text(anuncio["categoria"]!),
                        backgroundColor: Colors.blue[100],
                      ),
                      Text(
                        anuncio["fecha"]!,
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),

                  // Contenido
                  Text(anuncio["contenido"]!),

                  const SizedBox(height: 8),

                  // Adjunto (si existe)
                  if (anuncio["adjunto"]!.isNotEmpty)
                    Row(
                      children: [
                        const Icon(Icons.attach_file, size: 18),
                        const SizedBox(width: 4),
                        Text(
                          anuncio["adjunto"]!,
                          style: const TextStyle(
                              fontSize: 13, color: Colors.blue),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
