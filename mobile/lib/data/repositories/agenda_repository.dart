import '../../core/services/api_client.dart';

class AgendaRepository {
  static Future<List<dynamic>> getByStudent(int studentId) async {
    final data = await ApiClient.get("/students/$studentId/tasks/");
    return data;
  }
}
