import 'package:shared_preferences/shared_preferences.dart';
import '../../core/services/api_client.dart';

class AuthRepository {
  static Future<bool> login(String email, String password) async {
    final response = await ApiClient.post("/auth/token/", {
      "email": email,
      "password": password,
    });

    if (response["access"] != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("access_token", response["access"]);
      await prefs.setString("refresh_token", response["refresh"]);

      // 👇 Si el backend devuelve también el rol o perfil
      if (response["role"] != null) {
        await prefs.setString("role", response["role"]);
      }

      return true;
    }
    return false;
  }

  static Future<String?> getRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("role");
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
