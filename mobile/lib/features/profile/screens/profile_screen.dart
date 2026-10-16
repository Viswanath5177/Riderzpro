import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../providers/theme_provider.dart';
import '../../auth/providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ext = AppThemeExtension.of(context);
    final themeMode = ref.watch(themeModeProvider);
    final auth = ref.watch(authStateProvider).value;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(gradient: ext.heroGradient),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    CircleAvatar(radius: 38, backgroundColor: Colors.white.withOpacity(0.15),
                        child: const Icon(Icons.person, size: 38, color: Colors.white)),
                    const SizedBox(height: 10),
                    Text(auth?.phone ?? auth?.email ?? 'Guest',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16)),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildListDelegate([
              _ProfileTile(icon: Icons.directions_car_outlined, label: 'My Garage', onTap: () => context.go('/garage')),
              _ProfileTile(icon: Icons.receipt_long_outlined, label: 'My Orders', onTap: () => context.go('/orders')),
              _ProfileTile(icon: Icons.location_on_outlined, label: 'Saved Addresses', onTap: () {}),
              _ProfileTile(icon: Icons.favorite_outline, label: 'Wishlist', onTap: () {}),
              _ProfileTile(icon: Icons.local_offer_outlined, label: 'Offers & Coupons', onTap: () {}),
              _ProfileTile(icon: Icons.notifications_outlined, label: 'Notifications', onTap: () {}),
              _ProfileTile(icon: Icons.help_outline, label: 'Help & Support', onTap: () {}),
              const Divider(height: 24),
              // Theme toggle
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: Row(
                  children: [
                    Icon(Icons.dark_mode_outlined, color: ext.primaryRed, size: 22),
                    const SizedBox(width: 14),
                    const Text('Dark Mode', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
                    const Spacer(),
                    Switch(
                      value: themeMode == ThemeMode.dark,
                      onChanged: (_) => ref.read(themeModeProvider.notifier).toggle(),
                      activeColor: ext.primaryRed,
                    ),
                  ],
                ),
              ),
              _ProfileTile(icon: Icons.privacy_tip_outlined, label: 'Privacy Policy', onTap: () {}),
              _ProfileTile(icon: Icons.description_outlined, label: 'Terms of Service', onTap: () {}),
              const Divider(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.logout, color: Colors.red),
                  label: const Text('Sign Out', style: TextStyle(color: Colors.red, fontWeight: FontWeight.w600, fontSize: 15)),
                  onPressed: () async {
                    await ref.read(authStateProvider.notifier).logout();
                    if (context.mounted) context.go('/auth');
                  },
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                    side: const BorderSide(color: Colors.red),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ]),
          ),
        ],
      ),
    );
  }
}

class _ProfileTile extends StatelessWidget {
  const _ProfileTile({required this.icon, required this.label, required this.onTap});
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => ListTile(
    leading: Icon(icon, color: AppThemeExtension.of(context).primaryRed, size: 22),
    title: Text(label, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
    trailing: const Icon(Icons.chevron_right, size: 18, color: Colors.grey),
    onTap: onTap,
    minLeadingWidth: 20,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
  );
}
