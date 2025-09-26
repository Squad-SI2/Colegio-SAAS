import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

class ParentAgendaScreen extends StatefulWidget {
  const ParentAgendaScreen({super.key});

  @override
  State<ParentAgendaScreen> createState() => _ParentAgendaScreenState();
}

class _ParentAgendaScreenState extends State<ParentAgendaScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  Map<String, dynamic>? child;

  // Dummy de agenda por hijo
  final Map<String, Map<DateTime, List<String>>> _agendaByChild = {
    "Juan Pérez": {
      DateTime.utc(2025, 9, 2): ["Entrega tarea de Matemáticas"],
      DateTime.utc(2025, 9, 4): ["Examen de Lenguaje"],
    },
    "Ana Pérez": {
      DateTime.utc(2025, 9, 7): ["Proyecto de Ciencias"],
      DateTime.utc(2025, 9, 10): ["Examen de Historia"],
    },
  };

  List<String> _getAgendaForDay(DateTime day) {
    if (child == null) return [];
    final agenda = _agendaByChild[child!["name"]] ?? {};
    return agenda[DateTime.utc(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    // Recibimos hijo seleccionado
    child = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>?;

    return Scaffold(
      appBar: AppBar(
        title: Text("Agenda - ${child?["name"] ?? "Hijo"}"),
      ),
      body: Column(
        children: [
          // Calendario
          TableCalendar(
            firstDay: DateTime.utc(DateTime.now().year, 1, 1),
            lastDay: DateTime.utc(DateTime.now().year, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            eventLoader: _getAgendaForDay,
            startingDayOfWeek: StartingDayOfWeek.monday,
            calendarFormat: CalendarFormat.month,
            headerStyle: const HeaderStyle(
              formatButtonVisible: false,
              titleCentered: true,
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

          // Lista de eventos
          Expanded(
            child: ListView(
              children: _getAgendaForDay(_selectedDay ?? _focusedDay)
                  .map((event) => Card(
                        margin: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        child: ListTile(
                          leading: const Icon(Icons.assignment),
                          title: Text(event),
                        ),
                      ))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}
