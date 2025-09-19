import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static const String baseUrl = "http://localhost:8000/api"; 
  //  http://10.0.2.2:8000/api
  //  Android Emulator usa 10.0.2.2
  //  Chrome/Web y Windows usan http://localhost:8000/api

  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("access_token");
  }

  static Future<dynamic> get(String endpoint) async {
    final token = await _getToken();
    final response = await http.get(
      Uri.parse("$baseUrl$endpoint"),
      headers: {
        "Content-Type": "application/json",
        if (token != null) "Authorization": "Bearer $token",
      },
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Error GET $endpoint: ${response.statusCode}");
    }
  }

  static Future<dynamic> post(String endpoint, Map<String, dynamic> body) async {
    final token = await _getToken();
    final response = await http.post(
      Uri.parse("$baseUrl$endpoint"),
      headers: {
        "Content-Type": "application/json",
        if (token != null) "Authorization": "Bearer $token",
      },
      body: jsonEncode(body),
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Error POST $endpoint: ${response.statusCode} - ${response.body}");
    }
  }
}
