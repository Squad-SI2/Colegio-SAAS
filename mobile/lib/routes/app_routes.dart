import 'package:flutter/material.dart';

// Auth
import '../features/auth/screens/sign_in_page.dart';

// Student
import '../features/student/screens/student_dashboard.dart';
import '../features/student/screens/notas_screen.dart';
import '../features/student/screens/asistencia_screen.dart';
import '../features/student/screens/agenda_screen.dart';

// Parent
import '../features/parent/screens/parent_dashboard.dart';
import '../features/parent/screens/parent_notas_screen.dart';
import '../features/parent/screens/parent_asistencia_screen.dart';
import '../features/parent/screens/select_child_screen.dart'; 
import '../features/parent/screens/parent_agenda_screen.dart';
import '../features/parent/screens/parent_agenda_screen.dart';

// Announcements
import '../features/announcements/screens/announcements_screen.dart';

// nuevo 
import '../features/teacher/screens/teacher_dashboard.dart';

// teacher
import '../features/horario/screens/horario_screen.dart';



class AppRoutes {
  static const String signIn = "/signIn";

  // Student
  static const String studentDashboard = "/studentDashboard";
  static const String notas = "/notas";
  static const String asistencia = "/asistencia";
  static const String agenda = "/agenda";

  // Parent
  static const String parentDashboard = "/parentDashboard";
  static const String parentNotas = "/parentNotas";
  static const String parentAsistencia = "/parentAsistencia";
  static const String selectChild = "/selectChild"; 
  static const String parentAgenda = "/parentAgenda";

  //Nuevo 
  static const String teacherDashboard = "/teacherDashboard";
  static const String horario = "/horario";
  


  // Shared
  static const String announcements = "/announcements";

  static Map<String, WidgetBuilder> routes = {
    // Auth
    signIn: (context) => const SignInPage(),

    // Student
    studentDashboard: (context) => const StudentDashboard(),
    notas: (context) => const NotasEstudianteScreen(studentId: 1),
    asistencia: (context) => const AsistenciaEstudianteScreen(studentId: 1),
    agenda: (context) => const AgendaEstudianteScreen(studentId: 1),

    // Parent
    selectChild: (context) => const SelectChildScreen(), 
    parentDashboard: (context) => const ParentDashboard(),
    parentNotas: (context) => const ParentNotasScreen(),
    parentAsistencia: (context) => const ParentAsistenciaScreen(),
    parentAgenda: (context) => const ParentAgendaScreen(),

    //teacher 
    teacherDashboard: (context) => const TeacherDashboard(), // pantalla vacía por ahora
    
    
    //Horario
    horario: (context) => const HorarioScreen(), // pantalla dummy
   





    // Shared
    announcements: (context) => const AnnouncementsScreen(),
  };
}
