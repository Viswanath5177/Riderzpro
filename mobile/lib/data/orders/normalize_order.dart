import 'dart:developer' as dev;

class NormalizedOrder {
  const NormalizedOrder({
    required this.id,
    required this.orderNumber,
    required this.createdAt,
    this.estimatedDelivery,
    required this.status,
    required this.contact,
    required this.shippingAddress,
    this.deliveryInstructions,
    required this.items,
    required this.sellers,
    required this.subtotalPaise,
    required this.deliveryPaise,
    required this.discountPaise,
    this.couponCode,
    required this.taxPaise,
    required this.totalPaise,
    required this.payment,
    this.statusHistory,
  });

  final String id;
  final String orderNumber;
  final int createdAt;          // ms epoch
  final String? estimatedDelivery;
  final String status;          // raw string (never crashes on unknown)
  final OrderContact contact;
  final ShippingAddress shippingAddress;
  final String? deliveryInstructions;
  final List<OrderItem> items;
  final List<OrderSeller> sellers;
  final int subtotalPaise;
  final int deliveryPaise;
  final int discountPaise;
  final String? couponCode;
  final int taxPaise;
  final int totalPaise;
  final OrderPayment payment;
  final List<StatusHistoryEntry>? statusHistory;
}

class OrderContact {
  const OrderContact({required this.name, required this.phone, this.email});
  final String name;
  final String phone;
  final String? email;
}

class ShippingAddress {
  const ShippingAddress({
    required this.street,
    this.locality,
    this.landmark,
    required this.city,
    required this.state,
    required this.pincode,
    this.latitude,
    this.longitude,
  });
  final String street;
  final String? locality;
  final String? landmark;
  final String city;
  final String state;
  final String pincode;
  final double? latitude;
  final double? longitude;
}

class OrderItem {
  const OrderItem({
    required this.productId,
    required this.name,
    this.imageUrl,
    required this.qty,
    required this.unitPricePaise,
    required this.lineTotalPaise,
    required this.sellerId,
  });
  final String productId;
  final String name;
  final String? imageUrl;
  final int qty;
  final int unitPricePaise;
  final int lineTotalPaise;
  final String sellerId;
}

class OrderSeller {
  const OrderSeller({required this.id, required this.name});
  final String id;
  final String name;
}

class OrderPayment {
  const OrderPayment({required this.method, required this.status, this.amountDuePaise});
  final String method;
  final String status;
  final int? amountDuePaise;
}

class StatusHistoryEntry {
  const StatusHistoryEntry({required this.status, required this.timestamp, this.description, this.source});
  final String status;
  final int timestamp;
  final String? description;
  final String? source;
}

/// Normalises a raw order Map (camelCase OR snake_case) into a NormalizedOrder.
/// Unknown statuses are logged once and returned as-is.
NormalizedOrder normalizeOrder(Map<String, dynamic> raw) {
  dynamic _v(String camel, String snake) => raw[camel] ?? raw[snake];

  final id = (_v('id', 'id') ?? '').toString();
  final orderNumber = (_v('orderNumber', 'order_number') ?? id).toString();
  final createdAtRaw = _v('createdAt', 'created_at');
  final createdAt = createdAtRaw is int
      ? createdAtRaw
      : int.tryParse(createdAtRaw?.toString() ?? '0') ?? 0;

  final status = (_v('status', 'status') ?? 'PLACED').toString();
  // Log unknown statuses once
  const _known = {
    'PLACED','CONFIRMED','PACKED','VENDOR_ACCEPTED','RIDER_ASSIGNED','PICKED_UP',
    'DISPATCHED','SHIPPED','IN_TRANSIT','OUT_FOR_DELIVERY','ON_THE_WAY','DELIVERED',
    'CANCELLED','REFUNDED','RETURNED','FAILED',
  };
  if (!_known.contains(status.toUpperCase())) {
    dev.log('normalizeOrder: unknown status "\$status" for order \$id', name: 'Riderzpro');
  }

  Map<String, dynamic> _asMap(dynamic val) {
    if (val is Map<String, dynamic>) return val;
    if (val is Map) return val.map((k, v) => MapEntry(k.toString(), v));
    return {};
  }

  final contactRaw = _asMap(raw['contact']);
  final contact = OrderContact(
    name: (contactRaw['name'] ?? _v('customerName', 'customer_name') ?? '').toString(),
    phone: (contactRaw['phone'] ?? '').toString(),
    email: contactRaw['email']?.toString(),
  );

  final addrRaw = _asMap(raw['shippingAddress'] ?? raw['shipping_address']);
  final addr = ShippingAddress(
    street: (addrRaw['street'] ?? '').toString(),
    locality: addrRaw['locality']?.toString(),
    landmark: addrRaw['landmark']?.toString(),
    city: (addrRaw['city'] ?? 'Delhi').toString(),
    state: (addrRaw['state'] ?? 'Delhi').toString(),
    pincode: (addrRaw['pincode'] ?? '').toString(),
    latitude: (addrRaw['latitude'] as num?)?.toDouble(),
    longitude: (addrRaw['longitude'] as num?)?.toDouble(),
  );

  final itemsRaw = (raw['items'] ?? []) as List<dynamic>;
  final items = itemsRaw.map((e) {
    final m = _asMap(e);
    return OrderItem(
      productId: (m['productId'] ?? m['product_id'] ?? '').toString(),
      name: (m['name'] ?? '').toString(),
      imageUrl: m['imageUrl']?.toString() ?? m['image_url']?.toString(),
      qty: (m['qty'] ?? m['quantity'] ?? 1 as num).toInt(),
      unitPricePaise: (m['unitPricePaise'] ?? m['unit_price_paise'] ?? 0 as num).toInt(),
      lineTotalPaise: (m['lineTotalPaise'] ?? m['line_total_paise'] ?? 0 as num).toInt(),
      sellerId: (m['sellerId'] ?? m['seller_id'] ?? 'v1').toString(),
    );
  }).toList();

  final sellersRaw = (raw['sellers'] ?? []) as List<dynamic>;
  final sellers = sellersRaw.map((e) {
    final m = _asMap(e);
    return OrderSeller(
      id: (m['id'] ?? '').toString(),
      name: (m['name'] ?? '').toString(),
    );
  }).toList();

  int _pi(String camel, String snake) =>
      ((_v(camel, snake) ?? 0) as num).toInt();

  final payRaw = _asMap(raw['payment']);
  final payment = OrderPayment(
    method: (payRaw['method'] ?? 'COD').toString(),
    status: (payRaw['status'] ?? 'PENDING').toString(),
    amountDuePaise: (payRaw['amountDuePaise'] ?? payRaw['amount_due_paise'] as num?)?.toInt(),
  );

  final histRaw = raw['statusHistory'] ?? raw['status_history'];
  final history = histRaw == null ? null : (histRaw as List<dynamic>).map((e) {
    final m = _asMap(e);
    return StatusHistoryEntry(
      status: (m['status'] ?? '').toString(),
      timestamp: (m['timestamp'] ?? 0 as num).toInt(),
      description: m['description']?.toString(),
      source: m['source']?.toString(),
    );
  }).toList();

  return NormalizedOrder(
    id: id,
    orderNumber: orderNumber,
    createdAt: createdAt,
    estimatedDelivery: _v('estimatedDelivery', 'estimated_delivery')?.toString(),
    status: status,
    contact: contact,
    shippingAddress: addr,
    deliveryInstructions: _v('deliveryInstructions', 'delivery_instructions')?.toString(),
    items: items,
    sellers: sellers,
    subtotalPaise: _pi('subtotalPaise', 'subtotal_paise'),
    deliveryPaise: _pi('deliveryPaise', 'delivery_paise'),
    discountPaise: _pi('discountPaise', 'discount_paise'),
    couponCode: _v('couponCode', 'coupon_code')?.toString(),
    taxPaise: _pi('taxPaise', 'tax_paise'),
    totalPaise: _pi('totalPaise', 'total_paise'),
    payment: payment,
    statusHistory: history,
  );
}
