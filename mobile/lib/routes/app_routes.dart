import 'package:flutter/material.dart';
import '../features/student/screens/student_dashboard.dart';
import '../features/parent/screens/parent_dashboard.dart';
import '../features/announcements/screens/announcements_screen.dart';
import '../features/student/screens/notas_screen.dart';
import '../features/student/screens/asistencia_screen.dart';
import '../features/student/screens/agenda_screen.dart';
import '../features/parent/screens/parent_notas_screen.dart';
import '../features/parent/screens/parent_asistencia_screen.dart';

class AppRoutes {
  static const String studentDashboard = '/student_dashboard';
  static const String parentDashboard = '/parent_dashboard';
  static const String announcements = '/announcements';

  // Estudiante
  static const String notas = '/notas';
  static const String asistencia = '/asistencia';
  static const String agenda = '/agenda';

  // Padre
  static const String parentNotas = '/parent_notas';
  static const String parentAsistencia = '/parent_asistencia';

  static Map<String, WidgetBuilder> routes = {
    studentDashboard: (context) => const StudentDashboard(),
    parentDashboard: (context) => const ParentDashboard(),
    announcements: (context) => const AnnouncementsScreen(),
    notas: (context) => const NotasScreen(),
    asistencia: (context) => const AsistenciaEstudianteScreen(studentId: 1), 
    agenda: (context) => const AgendaEstudianteScreen(studentId: 1),
    parentNotas: (context) => const ParentNotasScreen(parentId: 1),
    parentAsistencia: (context) => const ParentAsistenciaScreen(parentId: 1),

  };
}
