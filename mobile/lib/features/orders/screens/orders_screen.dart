import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../core/money.dart';
import '../../../data/orders/normalize_order.dart';
import '../../../shared/widgets/status_chip.dart';

class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key});
  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen> with SingleTickerProviderStateMixin {
  late final TabController _tabs;
  List<NormalizedOrder>? _orders;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 2, vsync: this);
    _loadMockOrders();
  }

  @override
  void dispose() { _tabs.dispose(); super.dispose(); }

  Future<void> _loadMockOrders() async {
    final raw = await rootBundle.loadString('assets/mock/orders.mine.json');
    final json = jsonDecode(raw) as Map<String, dynamic>;
    final list = json['orders'] as List<dynamic>? ?? [];
    setState(() => _orders = list.map((e) => normalizeOrder(e as Map<String, dynamic>)).toList());
  }

  @override
  Widget build(BuildContext context) {
    final activeStatuses = {'PLACED','CONFIRMED','PACKED','VENDOR_ACCEPTED','RIDER_ASSIGNED','PICKED_UP','DISPATCHED','SHIPPED','IN_TRANSIT','OUT_FOR_DELIVERY','ON_THE_WAY'};
    final active = _orders?.where((o) => activeStatuses.contains(o.status.toUpperCase())).toList() ?? [];
    final past = _orders?.where((o) => !activeStatuses.contains(o.status.toUpperCase())).toList() ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Orders'),
        bottom: TabBar(
          controller: _tabs,
          tabs: const [Tab(text: 'Active'), Tab(text: 'Past')],
          indicatorColor: AppThemeExtension.of(context).primaryRed,
          labelColor: AppThemeExtension.of(context).primaryRed,
        ),
      ),
      body: _orders == null
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabs,
              children: [
                _OrderList(orders: active),
                _OrderList(orders: past),
              ],
            ),
    );
  }
}

class _OrderList extends StatelessWidget {
  const _OrderList({required this.orders});
  final List<NormalizedOrder> orders;

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return Center(child: Text('No orders here', style: Theme.of(context).textTheme.bodyLarge));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      itemBuilder: (_, i) => _OrderCard(order: orders[i]),
    );
  }
}

class _OrderCard extends StatelessWidget {
  const _OrderCard({required this.order});
  final NormalizedOrder order;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return GestureDetector(
      onTap: () => context.go('/orders/\${order.id}'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardTheme.color,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text('#\${order.orderNumber}', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                const Spacer(),
                StatusChip(status: order.status),
              ],
            ),
            const SizedBox(height: 8),
            Text('\${order.items.length} item\${order.items.length != 1 ? "s" : ""} · \${Money.format(order.totalPaise)}',
                style: TextStyle(fontSize: 13, color: Theme.of(context).colorScheme.onSurfaceVariant)),
            if (order.estimatedDelivery != null) ...[
              const SizedBox(height: 4),
              Row(children: [
                Icon(Icons.schedule_outlined, size: 13, color: ext.primaryRed),
                const SizedBox(width: 5),
                Text(order.estimatedDelivery!, style: TextStyle(fontSize: 12, color: ext.primaryRed, fontWeight: FontWeight.w600)),
              ]),
            ],
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => context.go('/orders/\${order.id}/track'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
                      side: BorderSide(color: ext.primaryRed),
                      foregroundColor: ext.primaryRed,
                    ),
                    child: const Text('Track Order', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {},
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
                    ),
                    child: const Text('Reorder', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
