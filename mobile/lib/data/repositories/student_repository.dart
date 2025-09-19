import '../../core/services/api_client.dart';

class StudentRepository {
  static Future<List<dynamic>> getStudents() async {
    final data = await ApiClient.get("/students/");
    return data;
  }
}
