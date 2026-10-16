import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../core/money.dart';
import '../../../data/orders/normalize_order.dart';
import '../../../domain/order_status.dart';
import '../../../shared/widgets/pill_button.dart';
import '../../../shared/widgets/status_chip.dart';

class OrderDetailScreen extends StatefulWidget {
  const OrderDetailScreen({super.key, required this.orderId});
  final String orderId;
  @override
  State<OrderDetailScreen> createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends State<OrderDetailScreen> {
  NormalizedOrder? _order;

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    final raw = await rootBundle.loadString('assets/mock/order.detail.json');
    final json = jsonDecode(raw) as Map<String, dynamic>;
    setState(() => _order = normalizeOrder(json));
  }

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    if (_order == null) return Scaffold(appBar: AppBar(), body: const Center(child: CircularProgressIndicator()));
    final order = _order!;
    final step = OrderStatus.toStep(order.status);
    final canCancel = OrderStatus.canCancel(order.status);
    final showRider = OrderStatus.showRiderInfo(order.status);

    return Scaffold(
      appBar: AppBar(
        title: Text('#\${order.orderNumber}'),
        actions: [
          if (canCancel)
            TextButton(onPressed: () {}, child: const Text('Cancel', style: TextStyle(color: Colors.red))),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: ext.heroGradient,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Order Status', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 4),
                    Text(OrderStatus.label(order.status),
                        style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w800)),
                  ]),
                  const Spacer(),
                  StatusChip(status: order.status),
                ],
              ),
            ),
            const SizedBox(height: 16),
            // Timeline
            if (step != null) _OrderTimeline(currentStep: step),
            const SizedBox(height: 16),
            // Rider card (after assignment)
            if (showRider) _RiderCard(),
            // Track button
            PillButton(
              label: 'Live Track Order',
              icon: const Icon(Icons.location_on, color: Colors.white, size: 16),
              onPressed: () => context.go('/orders/\${widget.orderId}/track'),
            ),
            const SizedBox(height: 16),
            // Items
            Text('Items', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            ...order.items.map((item) => ListTile(
              leading: Container(width: 48, height: 48, decoration: BoxDecoration(color: ext.fieldFill, borderRadius: BorderRadius.circular(8))),
              title: Text(item.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              subtitle: Text('Qty: \${item.qty}', style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.onSurfaceVariant)),
              trailing: Text(Money.format(item.lineTotalPaise), style: TextStyle(color: ext.primaryRed, fontWeight: FontWeight.w700)),
            )),
            const SizedBox(height: 16),
            // Bill
            _BillCard(order: order),
            const SizedBox(height: 16),
            // Delivery address
            _AddressCard(order: order),
          ],
        ),
      ),
    );
  }
}

class _OrderTimeline extends StatelessWidget {
  const _OrderTimeline({required this.currentStep});
  final OrderStep currentStep;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    const steps = [
      ('Placed', Icons.check_circle_outline),
      ('Packed', Icons.inventory_2_outlined),
      ('Rider Assigned', Icons.delivery_dining_outlined),
      ('In Transit', Icons.local_shipping_outlined),
      ('Out for Delivery', Icons.directions_bike_outlined),
      ('Delivered', Icons.home_outlined),
    ];
    return Row(
      children: List.generate(steps.length, (i) {
        final done = i <= currentStep.index;
        final (label, icon) = steps[i];
        return Expanded(
          child: Column(
            children: [
              Row(
                children: [
                  if (i > 0) Expanded(child: Container(height: 2, color: i <= currentStep.index ? ext.primaryRed : Colors.grey.withOpacity(0.3))),
                  Icon(icon, size: 18, color: done ? ext.primaryRed : Colors.grey.withOpacity(0.4)),
                  if (i < steps.length - 1) Expanded(child: Container(height: 2, color: i < currentStep.index ? ext.primaryRed : Colors.grey.withOpacity(0.3))),
                ],
              ),
              const SizedBox(height: 4),
              Text(label, style: TextStyle(fontSize: 8, fontWeight: done ? FontWeight.w700 : FontWeight.w400,
                  color: done ? ext.primaryRed : Colors.grey), textAlign: TextAlign.center),
            ],
          ),
        );
      }),
    );
  }
}

class _RiderCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)],
      ),
      child: Row(
        children: [
          CircleAvatar(radius: 24, backgroundColor: AppThemeExtension.of(context).primaryRed.withOpacity(0.1),
              child: const Icon(Icons.person, color: Colors.grey)),
          const SizedBox(width: 12),
          const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Rider: Ravi Kumar', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
            Text('Vehicle: Bajaj CT100 · DL 4S 1234', style: TextStyle(fontSize: 12, color: Colors.grey)),
          ]),
          const Spacer(),
          IconButton(
            icon: const Icon(Icons.phone),
            onPressed: () {},
            color: AppThemeExtension.of(context).primaryRed,
          ),
        ],
      ),
    );
  }
}

class _BillCard extends StatelessWidget {
  const _BillCard({required this.order});
  final NormalizedOrder order;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)],
      ),
      child: Column(children: [
        _row('Subtotal', Money.format(order.subtotalPaise)),
        _row('Delivery', Money.format(order.deliveryPaise)),
        if (order.discountPaise > 0) _row('Discount', '-\${Money.format(order.discountPaise)}', color: const Color(0xFF1FA45B)),
        _row('Tax', Money.format(order.taxPaise)),
        const Divider(height: 16),
        _row('Total', Money.format(order.totalPaise), bold: true),
        const SizedBox(height: 8),
        Row(children: [
          Icon(Icons.payment_outlined, size: 14, color: ext.primaryRed),
          const SizedBox(width: 6),
          Text('\${order.payment.method} · \${order.payment.status}', style: const TextStyle(fontSize: 12)),
        ]),
      ]),
    );
  }

  Widget _row(String label, String value, {bool bold = false, Color? color}) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 3),
    child: Row(
      children: [
        Text(label, style: TextStyle(fontSize: bold ? 15 : 13, fontWeight: bold ? FontWeight.w800 : FontWeight.w400)),
        const Spacer(),
        Text(value, style: TextStyle(fontSize: bold ? 15 : 13, fontWeight: bold ? FontWeight.w800 : FontWeight.w400, color: color)),
      ],
    ),
  );
}

class _AddressCard extends StatelessWidget {
  const _AddressCard({required this.order});
  final NormalizedOrder order;

  @override
  Widget build(BuildContext context) {
    final addr = order.shippingAddress;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Icon(Icons.location_on_outlined, size: 16, color: AppThemeExtension.of(context).primaryRed),
            const SizedBox(width: 6),
            const Text('Delivery Address', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
          ]),
          const SizedBox(height: 8),
          Text('\${addr.street}\${addr.locality != null ? ", \${addr.locality}" : ""}\${addr.city}, \${addr.state} \${addr.pincode}',
              style: TextStyle(fontSize: 13, color: Theme.of(context).colorScheme.onSurfaceVariant, height: 1.5)),
        ],
      ),
    );
  }
}
