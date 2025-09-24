import '../../core/services/api_client.dart';
import '../../core/constants/api_endpoints.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthRepository {
  static Future<bool> login(String email, String password) async {
    //  ByPass solo para pruebas
  if (email == "estudiante@gmail.com" && password == "123456") {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString("role", "student");
    await prefs.setInt("user_id", 1);
    return true;
  }
  if (email == "padre@gmail.com" && password == "123456") {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString("role", "parent");
    await prefs.setInt("user_id", 1);
    return true;
  }// Fin ByPass 

    final response = await ApiClient.post(ApiEndpoints.login, {
      "email": email,
      "password": password,
    });

    if (response["access"] != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("access_token", response["access"]);
      await prefs.setString("refresh_token", response["refresh"]);
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
