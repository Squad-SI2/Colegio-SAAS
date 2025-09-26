import 'package:flutter/material.dart';

class ParentNotasScreen extends StatelessWidget {
  const ParentNotasScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // 🔹 Recibimos el hijo seleccionado como argumento
    final child =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>?;

    // 🔹 Dummy de notas por materia y trimestre (igual que en estudiante)
    final List<Map<String, dynamic>> notas = [
      {"materia": "Matemáticas", "T1": 80, "T2": 85, "T3": 90},
      {"materia": "Lenguaje", "T1": 75, "T2": 70, "T3": 82},
      {"materia": "Ciencias", "T1": 88, "T2": 91, "T3": 87},
      {"materia": "Historia", "T1": 70, "T2": 74, "T3": 78},
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text("Notas - ${child?["name"] ?? "Hijo"}"),
      ),
      body: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          headingRowColor: MaterialStateProperty.all(Colors.blue[50]),
          border: TableBorder.all(color: Colors.grey.shade300),
          columns: const [
            DataColumn(label: Text("Materia")),
            DataColumn(label: Text("Trimestre 1")),
            DataColumn(label: Text("Trimestre 2")),
            DataColumn(label: Text("Trimestre 3")),
            DataColumn(label: Text("Promedio")),
          ],
          rows: notas.map((e) {
            final double t1 = (e["T1"] ?? 0).toDouble();
            final double t2 = (e["T2"] ?? 0).toDouble();
            final double t3 = (e["T3"] ?? 0).toDouble();

            //  Cálculo del promedio acumulado según trimestres disponibles
            int trimestresCompletados = 0;
            double suma = 0;
            if (t1 > 0) {
              suma += t1;
              trimestresCompletados++;
            }
            if (t2 > 0) {
              suma += t2;
              trimestresCompletados++;
            }
            if (t3 > 0) {
              suma += t3;
              trimestresCompletados++;
            }
            final promedio = trimestresCompletados > 0
                ? (suma / trimestresCompletados).toStringAsFixed(1)
                : "-";

            return DataRow(cells: [
              DataCell(Text(e["materia"])),
              DataCell(Text(t1.toString())),
              DataCell(Text(t2.toString())),
              DataCell(Text(t3.toString())),
              DataCell(Text(promedio)),
            ]);
          }).toList(),
        ),
      ),
    );
  }
}
