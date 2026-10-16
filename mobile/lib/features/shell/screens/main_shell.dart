import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../core/haptics.dart';
import '../../cart/providers/cart_provider.dart';
import '../../../core/money.dart';

class MainShell extends ConsumerWidget {
  const MainShell({super.key, required this.shell});
  final StatefulNavigationShell shell;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);
    final total = cart.fold<int>(0, (sum, item) => sum + item.lineTotalPaise);
    final count = cart.fold<int>(0, (sum, item) => sum + item.qty);

    return Scaffold(
      body: shell,
      floatingActionButton: count > 0
          ? _CartBar(count: count, total: total).animate().slideY(begin: 1.0, duration: 300.ms, curve: Curves.easeOut)
          : null,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: _BottomNav(
        currentIndex: shell.currentIndex,
        onTap: (i) { Haptics.select(); shell.goBranch(i, initialLocation: i == shell.currentIndex); },
        hasCart: count > 0,
      ),
    );
  }
}

class _CartBar extends ConsumerWidget {
  const _CartBar({required this.count, required this.total});
  final int count;
  final int total;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ext = AppThemeExtension.of(context);
    return GestureDetector(
      onTap: () { Haptics.medium(); context.push('/cart'); },
      child: Container(
        margin: const EdgeInsets.only(bottom: 72),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          gradient: ext.pillGradient,
          borderRadius: BorderRadius.circular(100),
          boxShadow: [BoxShadow(color: ext.primaryRed.withOpacity(0.4), blurRadius: 16, offset: const Offset(0, 6))],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 22, height: 22,
              decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
              child: Center(
                child: Text('\$count', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: ext.primaryRed)),
              ),
            ),
            const SizedBox(width: 10),
            Text('\$count item\${count != 1 ? "s" : ""} · \${Money.format(total)}',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
            const SizedBox(width: 10),
            const Text('View cart →',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white70)),
          ],
        ),
      ),
    );
  }
}

class _BottomNav extends StatelessWidget {
  const _BottomNav({required this.currentIndex, required this.onTap, required this.hasCart});
  final int currentIndex;
  final ValueChanged<int> onTap;
  final bool hasCart;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      items: [
        const BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
        const BottomNavigationBarItem(icon: Icon(Icons.search_outlined), activeIcon: Icon(Icons.search), label: 'Search'),
        BottomNavigationBarItem(
          icon: const Icon(Icons.receipt_long_outlined),
          activeIcon: const Icon(Icons.receipt_long),
          label: 'Orders',
        ),
        const BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
      ],
    );
  }
}
