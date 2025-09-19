import '../../core/services/api_client.dart';

class AttendanceRepository {
  static Future<List<dynamic>> getByStudent(int studentId) async {
    final data = await ApiClient.get("/students/$studentId/attendance/");
    return data;
  }
}
