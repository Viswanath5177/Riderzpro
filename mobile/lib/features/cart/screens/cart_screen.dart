import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../core/money.dart';
import '../../../shared/widgets/pill_button.dart';
import '../../../shared/widgets/qty_stepper.dart';
import '../providers/cart_provider.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ext = AppThemeExtension.of(context);
    final cart = ref.watch(cartProvider);
    final notifier = ref.read(cartProvider.notifier);

    if (cart.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Cart')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.shopping_cart_outlined, size: 64, color: ext.primaryRed.withOpacity(0.3)),
              const SizedBox(height: 16),
              Text('Your cart is empty', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              TextButton(onPressed: () => context.go('/'), child: Text('Start Shopping', style: TextStyle(color: ext.primaryRed))),
            ],
          ),
        ),
      );
    }

    final subtotal = cart.fold<int>(0, (s, i) => s + i.lineTotalPaise);
    final tax = Money.gst(subtotal);
    final total = subtotal + tax.totalTaxPaise;

    return Scaffold(
      appBar: AppBar(title: const Text('Cart'), actions: [
        TextButton(onPressed: () => notifier.clear(), child: const Text('Clear', style: TextStyle(color: Colors.red))),
      ]),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: cart.length,
              itemBuilder: (_, i) {
                final item = cart[i];
                return _CartItemCard(item: item, notifier: notifier);
              },
            ),
          ),
          // Bill
          _BillSection(subtotal: subtotal, tax: tax, total: total),
          // CTA
          Padding(
            padding: EdgeInsets.fromLTRB(16, 12, 16, MediaQuery.of(context).padding.bottom + 12),
            child: PillButton(label: 'Proceed to Checkout · \${Money.format(total)}', onPressed: () => context.push('/checkout')),
          ),
        ],
      ),
    );
  }
}

class _CartItemCard extends StatelessWidget {
  const _CartItemCard({required this.item, required this.notifier});
  final CartItem item;
  final CartNotifier notifier;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(ext.cardRadius),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)],
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: SizedBox(
              width: 70, height: 70,
              child: item.imageAsset != null
                  ? Image.asset(item.imageAsset!, fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(color: const Color(0xFF1E2028)))
                  : item.remoteImageUrl != null
                      ? Image.network(item.remoteImageUrl!, fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(color: const Color(0xFF1E2028)))
                      : Container(color: const Color(0xFF1E2028)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.name, maxLines: 2, overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text(Money.format(item.unitPricePaise), style: TextStyle(fontSize: 14, color: ext.primaryRed, fontWeight: FontWeight.w700)),
                if (item.withInstallation && item.installationPricePaise != null)
                  Text('+\${Money.format(item.installationPricePaise!)} install',
                      style: TextStyle(fontSize: 11, color: ext.warning)),
              ],
            ),
          ),
          const SizedBox(width: 8),
          QtyStepper(
            qty: item.qty,
            small: true,
            onDecrement: () => notifier.decrementQty(item.productId),
            onIncrement: () => notifier.incrementQty(item.productId),
          ),
        ],
      ),
    );
  }
}

class _BillSection extends StatelessWidget {
  const _BillSection({required this.subtotal, required this.tax, required this.total});
  final int subtotal;
  final ({int cgstPaise, int sgstPaise, int totalTaxPaise}) tax;
  final int total;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)],
      ),
      child: Column(
        children: [
          _BillRow(label: 'Subtotal', amount: subtotal),
          _BillRow(label: 'CGST (9%)', amount: tax.cgstPaise),
          _BillRow(label: 'SGST (9%)', amount: tax.sgstPaise),
          const Divider(height: 20),
          _BillRow(label: 'Total', amount: total, bold: true),
        ],
      ),
    );
  }
}

class _BillRow extends StatelessWidget {
  const _BillRow({required this.label, required this.amount, this.bold = false, this.discount = false});
  final String label;
  final int amount;
  final bool bold;
  final bool discount;

  @override
  Widget build(BuildContext context) {
    final style = TextStyle(
      fontSize: bold ? 16 : 13,
      fontWeight: bold ? FontWeight.w800 : FontWeight.w500,
      color: discount ? const Color(0xFF1FA45B) : null,
    );
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Text(label, style: style),
          const Spacer(),
          Text(discount ? '-\${Money.format(amount)}' : Money.format(amount), style: style),
        ],
      ),
    );
  }
}
