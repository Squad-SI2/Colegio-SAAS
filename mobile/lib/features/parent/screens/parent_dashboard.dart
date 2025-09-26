import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../../routes/app_routes.dart';

class ParentDashboard extends StatefulWidget {
  const ParentDashboard({super.key});

  @override
  State<ParentDashboard> createState() => _ParentDashboardState();
}

class _ParentDashboardState extends State<ParentDashboard> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  Map<String, dynamic>? child;

  // 🔹 Dummy de eventos por hijo (luego vendrá del backend)
  final Map<String, Map<DateTime, List<String>>> _eventsByChild = {
    "Juan Pérez": {
      DateTime.utc(2025, 9, 2): ["Reunión de padres"],
      DateTime.utc(2025, 9, 10): ["Examen de Matemáticas"],
    },
    "Ana Pérez": {
      DateTime.utc(2025, 9, 5): ["Entrega tarea Lenguaje"],
      DateTime.utc(2025, 9, 18): ["Exposición Ciencias"],
    },
  };

  List<String> _getEventsForDay(DateTime day) {
    if (child == null) return [];
    final events = _eventsByChild[child!["name"]] ?? {};
    return events[DateTime.utc(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    // Recibimos el hijo seleccionado desde SelectChildScreen
    child = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>?;
    if (child == null) {
      return Scaffold(
        appBar: AppBar(title: const Text("Dashboard Padre")),
        body: const Center(
          child: Text(
            "No se seleccionó ningún hijo",
            style: TextStyle(fontSize: 16),
          ),
        ),
      );
    }
    return Scaffold(
      appBar: AppBar(
        title: Text("Dashboard Padre - ${child?["name"] ?? "Hijo"}"),
        leading: IconButton(
          icon: const Icon(Icons.logout),
          onPressed: () {
            // Aquí puedes limpiar sesión, token, etc.
            Navigator.pushReplacementNamed(context, "/signIn");
          },
        ),
      ),
      body: Column(
        children: [
          //  Calendario
          TableCalendar(
            firstDay: DateTime.utc(DateTime.now().year, 1, 1),
            lastDay: DateTime.utc(DateTime.now().year, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            eventLoader: _getEventsForDay,
            startingDayOfWeek: StartingDayOfWeek.monday,
            calendarFormat: CalendarFormat.month,
            headerStyle:  HeaderStyle(
              formatButtonVisible: false,
              titleCentered: true,
              leftChevronIcon: Icon(Icons.chevron_left),
              rightChevronIcon: Icon(Icons.chevron_right),
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
          const SizedBox(height: 8),

          //  Lista de eventos del día
          Expanded(
            child: ListView(
              children: _getEventsForDay(_selectedDay ?? _focusedDay)
                  .map((event) => ListTile(
                        leading: const Icon(Icons.event),
                        title: Text(event),
                      ))
                  .toList(),
            ),
          ),

          //  Botones de acceso rápido
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Wrap(
              spacing: 12,
              runSpacing: 12,
              alignment: WrapAlignment.center,
              children: [
                _quickButton(context, Icons.school, "Notas",
                    AppRoutes.parentNotas, child!),
                _quickButton(context, Icons.check_circle_outline, "Asistencia",
                    AppRoutes.parentAsistencia, child!),
                _quickButton(context, Icons.campaign_outlined, "Anuncios",
                    AppRoutes.announcements, child!),
                _quickButton(context, Icons.schedule, "Horario",
                    AppRoutes.horario, child!),
                _quickButton(context, Icons.event_note, "Agenda",
                    AppRoutes.parentAgenda, child!),  
              ],
            ),
          ),
        ],
      ),
    );
  }

  //  QuickButton ahora recibe el hijo y lo pasa como argumento
  Widget _quickButton(BuildContext context, IconData icon, String label,
      String route, Map<String, dynamic> child) {
    return ElevatedButton.icon(
      onPressed: () => Navigator.pushNamed(
        context,
        route,
        arguments: child, // se pasa el hijo seleccionado
      ),
      icon: Icon(icon, size: 20),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
  
}
