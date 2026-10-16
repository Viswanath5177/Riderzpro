import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/brand_colors.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  static const List<Map<String, String>> _mockNotifications = [
    {
      'title': 'Rider Assigned! 🏍️',
      'body': 'Rahul Verma is heading to Karol Bagh Hub to pick up your order #RZ-847291.',
      'time': '5 mins ago',
      'type': 'order',
    },
    {
      'title': 'Flash Deal: 20% Off Helmets 🔥',
      'body': 'Use code RIDER20 at checkout for instant savings on certified helmets.',
      'time': '2 hours ago',
      'type': 'promo',
    },
    {
      'title': 'Fitment Verified ✅',
      'body': 'Royal Enfield Hunter 350 accessories catalog updated for 2026 models.',
      'time': '1 day ago',
      'type': 'garage',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications', style: TextStyle(fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        itemCount: _mockNotifications.length,
        separatorBuilder: (_, __) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final item = _mockNotifications[index];
          return ListTile(
            contentPadding: const EdgeInsets.symmetric(vertical: 8),
            leading: CircleAvatar(
              backgroundColor: BrandColors.surfaceLight,
              child: Icon(
                item['type'] == 'order'
                    ? Icons.local_shipping
                    : item['type'] == 'promo'
                        ? Icons.local_offer
                        : Icons.garage,
                color: BrandColors.primary,
              ),
            ),
            title: Text(item['title']!, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(item['body']!, style: const TextStyle(fontSize: 13, color: Colors.grey)),
                const SizedBox(height: 4),
                Text(item['time']!, style: const TextStyle(fontSize: 11, color: BrandColors.slateText)),
              ],
            ),
          );
        },
      ),
    );
  }
}
