import '../../core/services/api_client.dart';

class GradesRepository {
  static Future<List<dynamic>> getByStudent(int studentId) async {
    final data = await ApiClient.get("/students/$studentId/grades/");
    return data;
  }
}
