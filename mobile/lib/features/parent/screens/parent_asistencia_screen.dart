import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

class ParentAsistenciaScreen extends StatefulWidget {
  const ParentAsistenciaScreen({super.key});

  @override
  State<ParentAsistenciaScreen> createState() => _ParentAsistenciaScreenState();
}

class _ParentAsistenciaScreenState extends State<ParentAsistenciaScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  Map<String, dynamic>? child;

  //  Dummy de asistencia del hijo
  final Map<DateTime, String> _asistencia = {
    DateTime.utc(2025, 9, 1): "Presente",
    DateTime.utc(2025, 9, 2): "Ausente",
    DateTime.utc(2025, 9, 3): "Presente",
    DateTime.utc(2025, 9, 4): "Licencia",
    DateTime.utc(2025, 9, 5): "Presente",
  };

  @override
  Widget build(BuildContext context) {
    // Recibimos el hijo como argumento
    child = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>?;

    //  Calcular resumen
    int presentes = _asistencia.values.where((v) => v == "Presente").length;
    int ausentes = _asistencia.values.where((v) => v == "Ausente").length;
    int licencias = _asistencia.values.where((v) => v == "Licencia").length;
    int total = _asistencia.length;
    double porcentaje =
        total > 0 ? (presentes / total * 100).toDouble() : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: Text("Asistencia - ${child?["name"] ?? "Hijo"}"),
      ),
      body: Column(
        children: [
          //  Resumen de asistencia
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _statCard("Presentes", presentes, Colors.green),
                _statCard("Ausentes", ausentes, Colors.red),
                _statCard("Licencias", licencias, Colors.orange),
                _statCard(
                    "Asistencia %", porcentaje.toStringAsFixed(1), Colors.blue),
              ],
            ),
          ),

          //  Calendario con colores
          TableCalendar(
            firstDay: DateTime.utc(DateTime.now().year, 1, 1),
            lastDay: DateTime.utc(DateTime.now().year, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            startingDayOfWeek: StartingDayOfWeek.monday,
            calendarFormat: CalendarFormat.month,
            headerStyle: const HeaderStyle(
              formatButtonVisible: false,
              titleCentered: true,
            ),
            calendarBuilders: CalendarBuilders(
              defaultBuilder: (context, day, focusedDay) {
                final status = _asistencia[DateTime.utc(
                  day.year,
                  day.month,
                  day.day,
                )];
                if (status == "Presente") {
                  return _dayBox(day, Colors.green[200]!);
                } else if (status == "Ausente") {
                  return _dayBox(day, Colors.red[200]!);
                } else if (status == "Licencia") {
                  return _dayBox(day, Colors.orange[200]!);
                }
                return null; // default
              },
            ),
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
            },
            onPageChanged: (focusedDay) {
              setState(() {
                _focusedDay = focusedDay;
              });
            },
          ),
          const SizedBox(height: 12),

          //  Lista de registros del día seleccionado
          Expanded(
            child: ListView(
              children: [
                if (_selectedDay != null)
                  ListTile(
                    leading: const Icon(Icons.event),
                    title: Text(
                      "Fecha: ${_selectedDay!.day}-${_selectedDay!.month}-${_selectedDay!.year}",
                    ),
                    subtitle: Text(
                      "Estado: ${_asistencia[DateTime.utc(_selectedDay!.year, _selectedDay!.month, _selectedDay!.day)] ?? "Sin registro"}",
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  //  Widget de caja para estadísticas
  Widget _statCard(String title, dynamic value, Color color) {
    return Column(
      children: [
        Text(title, style: TextStyle(fontSize: 12, color: Colors.grey[700])),
        const SizedBox(height: 4),
        CircleAvatar(
          backgroundColor: color,
          radius: 20,
          child: Text(
            value.toString(),
            style: const TextStyle(color: Colors.white, fontSize: 14),
          ),
        ),
      ],
    );
  }

  //  Widget para pintar días con color según estado
  Widget _dayBox(DateTime day, Color color) {
    return Container(
      margin: const EdgeInsets.all(6),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text("${day.day}"),
    );
  }
}
