import '../../core/services/api_client.dart';

class AnnouncementsRepository {
  static Future<List<dynamic>> getAnnouncements() async {
    final data = await ApiClient.get("/announcements/");
    return data;
  }
}
