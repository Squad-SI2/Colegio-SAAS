import '../../core/services/api_client.dart';
import '../../core/constants/api_endpoints.dart';

class AttendanceRepository {
  static Future<List<dynamic>> getByStudent(int studentId) async {
    final data = await ApiClient.get(ApiEndpoints.studentGrades(studentId));
    return data;
  }
}
