import '../../core/services/api_client.dart';
import '../../core/constants/api_endpoints.dart';

class ParentRepository {
  static Future<List<dynamic>> getChildren(int parentId) async {
    final data = await ApiClient.get(ApiEndpoints.parentChildren(parentId));
    return data;
  }

  static Future<List<dynamic>> getChildrenGrades(int parentId) async {
    final data = await ApiClient.get(ApiEndpoints.parentGrades(parentId));
    return data;
  }

  static Future<List<dynamic>> getChildrenAttendance(int parentId) async {
    final data = await ApiClient.get(ApiEndpoints.parentAttendance(parentId));
    return data;
  }
}
