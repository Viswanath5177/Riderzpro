import 'package:flutter_test/flutter_test.dart';
import 'package:riderzpro/data/orders/normalize_order.dart';

void main() {
  group('normalizeOrder Tests', () {
    test('Normalizes camelCase fixture', () {
      final camelFixture = {
        'id': 'RZ-101',
        'orderNumber': 'RZ-101-CAMEL',
        'createdAt': 1728900000000,
        'estimatedDelivery': '30-45 mins',
        'status': 'PACKED',
        'contact': {
          'name': 'Rahul Sharma',
          'phone': '9876543210',
          'email': 'rahul@example.com'
        },
        'shippingAddress': {
          'street': '12 Connaught Circle',
          'locality': 'Connaught Place',
          'city': 'New Delhi',
          'state': 'Delhi',
          'pincode': '110001',
          'latitude': 28.6315,
          'longitude': 77.2167
        },
        'deliveryInstructions': 'Leave with security guard',
        'items': [
          {
            'productId': 'p-helm-01',
            'name': 'Vega Bolt Helmet',
            'imageUrl': 'assets/catalogue/helmet.png',
            'qty': 1,
            'unitPricePaise': 249900,
            'lineTotalPaise': 249900,
            'sellerId': 'v-speed'
          }
        ],
        'sellers': [
          {'id': 'v-speed', 'name': 'Speed Moto Delhi'}
        ],
        'subtotalPaise': 249900,
        'deliveryPaise': 4000,
        'discountPaise': 20000,
        'couponCode': 'RIDER200',
        'taxPaise': 41382,
        'totalPaise': 275282,
        'payment': {
          'method': 'UPI',
          'status': 'PAID',
          'amountDuePaise': 0
        }
      };

      final order = normalizeOrder(camelFixture);
      expect(order.id, 'RZ-101');
      expect(order.orderNumber, 'RZ-101-CAMEL');
      expect(order.status, 'PACKED');
      expect(order.contact.name, 'Rahul Sharma');
      expect(order.shippingAddress.pincode, '110001');
      expect(order.items.length, 1);
      expect(order.items[0].productId, 'p-helm-01');
      expect(order.payment.method, 'UPI');
      expect(order.totalPaise, 275282);
    });

    test('Normalizes snake_case fixture', () {
      final snakeFixture = {
        'id': 'RZ-202',
        'order_number': 'RZ-202-SNAKE',
        'created_at': 1728905000000,
        'estimated_delivery': '40-50 mins',
        'status': 'in_transit',
        'customer_name': 'Aarav Patel',
        'shipping_address': {
          'street': 'Block C, Rohini Sector 7',
          'city': 'Delhi',
          'state': 'Delhi',
          'pincode': '110085'
        },
        'delivery_instructions': 'Call before arriving',
        'items': [
          {
            'product_id': 'p-lock-02',
            'name': 'Disc Brake Lock',
            'image_url': 'assets/catalogue/lock.png',
            'quantity': 2,
            'unit_price_paise': 45000,
            'line_total_paise': 90000,
            'seller_id': 'v-auto'
          }
        ],
        'sellers': [
          {'id': 'v-auto', 'name': 'AutoZone Karol Bagh'}
        ],
        'subtotal_paise': 90000,
        'delivery_paise': 5200,
        'discount_paise': 0,
        'coupon_code': null,
        'tax_paise': 16200,
        'total_paise': 111400,
        'payment': {
          'method': 'COD',
          'status': 'COD_DUE',
          'amount_due_paise': 111400
        }
      };

      final order = normalizeOrder(snakeFixture);
      expect(order.id, 'RZ-202');
      expect(order.orderNumber, 'RZ-202-SNAKE');
      expect(order.status, 'in_transit');
      expect(order.contact.name, 'Aarav Patel');
      expect(order.shippingAddress.street, 'Block C, Rohini Sector 7');
      expect(order.items[0].qty, 2);
      expect(order.items[0].lineTotalPaise, 90000);
      expect(order.totalPaise, 111400);
      expect(order.payment.status, 'COD_DUE');
    });

    test('Unknown order status does not crash and preserves raw label', () {
      final fixture = {
        'id': 'RZ-303',
        'status': 'AWAITING_CUSTOMS_CLEARANCE',
        'items': [],
        'sellers': [],
      };

      final order = normalizeOrder(fixture);
      expect(order.status, 'AWAITING_CUSTOMS_CLEARANCE');
      expect(order.id, 'RZ-303');
    });
  });
}
