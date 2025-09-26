import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../../routes/app_routes.dart';

class StudentDashboard extends StatefulWidget {
  const StudentDashboard({super.key});

  @override
  State<StudentDashboard> createState() => _StudentDashboardState();
}

class _StudentDashboardState extends State<StudentDashboard> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  final Map<DateTime, List<String>> _events = {
    DateTime.utc(2025, 9, 2): ["Marcado de notas"],
    DateTime.utc(2025, 9, 4): ["Examen de Matemáticas"],
    DateTime.utc(2025, 9, 5): ["Entrega de tarea"],
    DateTime.utc(2025, 9, 11): ["Exposición de Lenguaje"],
    DateTime.utc(2025, 9, 18): ["Entrega Proyecto", "Reunión padres"],
  };

  List<String> _getEventsForDay(DateTime day) {
    return _events[DateTime.utc(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Dashboard Estudiante"),
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
          //  Calendario principal
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
          //  Eventos del día seleccionado
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
          //  Botones de accesos rápidos
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Wrap(
              spacing: 12,
              runSpacing: 12,
              alignment: WrapAlignment.center,
              children: [
                _quickButton(
                    context, Icons.school, "Notas", AppRoutes.notas),
                _quickButton(context, Icons.check_circle_outline, "Asistencia",
                    AppRoutes.asistencia),
                _quickButton(context, Icons.event_note, "Agenda",
                    AppRoutes.agenda),
                _quickButton(context, Icons.campaign_outlined, "Anuncios",
                    AppRoutes.announcements),
                _quickButton(context, Icons.schedule, "Horario",
                    AppRoutes.horario),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _quickButton(
      BuildContext context, IconData icon, String label, String route) {
    return ElevatedButton.icon(
      onPressed: () => Navigator.pushNamed(context, route),
      icon: Icon(icon, size: 20),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}
