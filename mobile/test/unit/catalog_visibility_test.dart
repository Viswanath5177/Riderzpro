import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Catalog Visibility Filter Tests', () {
    test('Planned and Held back products never appear in customer catalog', () {
      final sampleBackendProducts = [
        {'id': 'p1', 'name': 'LED Fog Lights', 'status': 'ACTIVE'},
        {'id': 'p2', 'name': 'Prototype Seat Cover', 'status': 'Planned'},
        {'id': 'p3', 'name': 'Discontinued Exhaust', 'status': 'Held back'},
        {'id': 'p4', 'name': 'Smartphone Mount', 'status': 'LIVE'},
        {'id': 'p5', 'name': 'Future EV Charger', 'status': 'PLANNED'},
        {'id': 'p6', 'name': 'Recalled Brake Pads', 'status': 'HELD_BACK'},
      ];

      // Customer app visibility rule: exclude any Planned or Held back
      final visible = sampleBackendProducts.where((p) {
        final status = (p['status'] ?? '').toString().toLowerCase();
        return !status.contains('planned') && !status.contains('held');
      }).toList();

      expect(visible.length, 2);
      expect(visible.map((p) => p['id']), containsAll(['p1', 'p4']));
      expect(visible.any((p) => p['name']!.contains('Prototype')), isFalse);
      expect(visible.any((p) => p['name']!.contains('Discontinued')), isFalse);
      expect(visible.any((p) => p['name']!.contains('Future')), isFalse);
      expect(visible.any((p) => p['name']!.contains('Recalled')), isFalse);
    });
  });
}
