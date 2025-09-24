import '../../core/services/api_client.dart';
import '../../core/constants/api_endpoints.dart';

class AnnouncementsRepository {
  static Future<List<dynamic>> getAnnouncements() async {
    final data = await ApiClient.get(ApiEndpoints.announcements);
    return data;
  }

  static Future<dynamic> getLastAnnouncement() async {
    final data = await ApiClient.get(ApiEndpoints.lastAnnouncement);
    return data;
  }
}
