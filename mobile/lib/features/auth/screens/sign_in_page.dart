import 'package:flutter/material.dart';
import '../../../routes/app_routes.dart';
import '../../../data/repositories/auth_repository.dart';


class SignInPage2 extends StatelessWidget {
  const SignInPage2({super.key});

  @override
  Widget build(BuildContext context) {
    final bool isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      body: Center(
        child: isSmallScreen
            ? const Column(
                mainAxisSize: MainAxisSize.min,
                children: [_Logo(), _FormContent()],
              )
            : Container(
                padding: const EdgeInsets.all(32.0),
                constraints: const BoxConstraints(maxWidth: 800),
                child: const Row(
                  children: [
                    Expanded(child: _Logo()),
                    Expanded(child: Center(child: _FormContent())),
                  ],
                ),
              ),
      ),
    );
  }
}

class _Logo extends StatelessWidget {
  const _Logo();

  @override
  Widget build(BuildContext context) {
    final bool isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Aquí cambiamos el logo de Flutter por tu logo
        Image.asset(
          "assets/images/logo.png",
          width: isSmallScreen ? 100 : 200,
        ),
        const SizedBox(height: 16),
        Text(
          "Jesvaw EduSoft",
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.blue[700],
              ),
        ),
      ],
    );
  }
}


class _FormContent extends StatefulWidget {
  const _FormContent();

  @override
  State<_FormContent> createState() => __FormContentState();
}

class __FormContentState extends State<_FormContent> {
  bool _isPasswordVisible = false;
  bool _rememberMe = false;

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  String _email = "";
  String _password = "";

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 300),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextFormField(
              onChanged: (value) => _email = value,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Ingrese un correo';
                }
                bool emailValid = RegExp(
                  r"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                ).hasMatch(value);
                if (!emailValid) {
                  return 'Correo inválido';
                }
                return null;
              },
              decoration: const InputDecoration(
                labelText: 'Email',
                prefixIcon: Icon(Icons.email_outlined),
                border: OutlineInputBorder(),
              ),
            ),
            _gap(),
            TextFormField(
              onChanged: (value) => _password = value,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Ingrese contraseña';
                }
                if (value.length < 6) {
                  return 'Mínimo 6 caracteres';
                }
                return null;
              },
              obscureText: !_isPasswordVisible,
              decoration: InputDecoration(
                labelText: 'Contraseña',
                prefixIcon: const Icon(Icons.lock_outline_rounded),
                border: const OutlineInputBorder(),
                suffixIcon: IconButton(
                  icon: Icon(
                    _isPasswordVisible
                        ? Icons.visibility_off
                        : Icons.visibility,
                  ),
                  onPressed: () {
                    setState(() {
                      _isPasswordVisible = !_isPasswordVisible;
                    });
                  },
                ),
              ),
            ),
            _gap(),
            CheckboxListTile(
              value: _rememberMe,
              onChanged: (value) {
                if (value == null) return;
                setState(() {
                  _rememberMe = value;
                });
              },
              title: const Text('Recordarme'),
              controlAffinity: ListTileControlAffinity.leading,
              dense: true,
              contentPadding: const EdgeInsets.all(0),
            ),
            _gap(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                child: const Padding(
                  padding: EdgeInsets.all(10.0),
                  child: Text(
                    'Ingresar',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
                onPressed: () async {
                  if (_formKey.currentState?.validate() ?? false) {
                    
                    
                    try {
                      final ok = await AuthRepository.login(_email, _password);
                      if (ok) {
                        final role = await AuthRepository.getRole();

                        if (role == "student") {
                          Navigator.pushReplacementNamed(context, AppRoutes.studentDashboard);
                        } else if (role == "parent") {
                          Navigator.pushReplacementNamed(context, AppRoutes.parentDashboard);
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text("Rol no reconocido")),
                          );
                        }
                      } else {  
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("Credenciales inválidas")),
                        );
                      }
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text("Error al conectar: $e")),
                      );
                    }
                  } 
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _gap() => const SizedBox(height: 16);
}
