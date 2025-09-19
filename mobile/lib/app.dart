import 'package:flutter/material.dart';
import 'routes/app_routes.dart';
import 'features/auth/screens/sign_in_page.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Colegio App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      // Primera pantalla: login
      home: const SignInPage2(),
      routes: AppRoutes.routes,
    );
  }
}
