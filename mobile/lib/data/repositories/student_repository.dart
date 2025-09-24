import '../../core/services/api_client.dart';
import '../../core/constants/api_endpoints.dart';

class StudentRepository {
  static Future<List<dynamic>> getStudents() async {
    final data = await ApiClient.get(ApiEndpoints.students);
    return data;
  }
}
