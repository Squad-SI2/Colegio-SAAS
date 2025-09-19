import '../../core/services/api_client.dart';

class ParentRepository {
  static Future<List<dynamic>> getChildren(int parentId) async {
    final data = await ApiClient.get("/parents/$parentId/children/");
    return data;
  }

  static Future<List<dynamic>> getChildrenGrades(int parentId) async {
    final data = await ApiClient.get("/parents/$parentId/grades/");
    return data;
  }

  static Future<List<dynamic>> getChildrenAttendance(int parentId) async {
    final data = await ApiClient.get("/parents/$parentId/attendance/");
    return data;
  }
}
