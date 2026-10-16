import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../features/onboarding/screens/onboarding_screen.dart';
import '../features/auth/screens/auth_screen.dart';
import '../features/auth/screens/otp_screen.dart';
import '../features/shell/screens/main_shell.dart';
import '../features/home/screens/home_screen.dart';
import '../features/search/screens/search_screen.dart';
import '../features/product/screens/product_detail_screen.dart';
import '../features/cart/screens/cart_screen.dart';
import '../features/checkout/screens/checkout_screen.dart';
import '../features/orders/screens/orders_screen.dart';
import '../features/orders/screens/order_detail_screen.dart';
import '../features/tracking/screens/tracking_screen.dart';
import '../features/assistant/screens/assistant_screen.dart';
import '../features/profile/screens/profile_screen.dart';
import '../features/garage/screens/garage_screen.dart';
import '../features/ev_browse/screens/ev_browse_screen.dart';
import '../features/auth/providers/auth_provider.dart';
import '../shared/screens/location_permission_screen.dart';

part 'router.g.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

@riverpod
GoRouter router(RouterRef ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/onboarding',
    redirect: (context, state) {
      final isLoggedIn = authState.value?.isLoggedIn ?? false;
      final loc = state.uri.path;
      final onAuthPages = loc.startsWith('/auth') || loc.startsWith('/onboarding') || loc.startsWith('/location');

      if (!isLoggedIn && !onAuthPages) return '/auth';
      if (isLoggedIn && onAuthPages) return '/';
      return null;
    },
    routes: [
      GoRoute(path: '/onboarding', builder: (c, s) => const OnboardingScreen()),
      GoRoute(path: '/location', builder: (c, s) => const LocationPermissionScreen()),
      GoRoute(
        path: '/auth',
        builder: (c, s) => const AuthScreen(),
        routes: [
          GoRoute(
            path: 'otp',
            builder: (c, s) {
              final extra = s.extra as Map<String, dynamic>? ?? {};
              return OtpScreen(
                identity: extra['identity'] as String? ?? '',
                isSignUp: extra['isSignUp'] as bool? ?? false,
              );
            },
          ),
        ],
      ),
      StatefulShellRoute.indexedStack(
        parentNavigatorKey: _rootNavigatorKey,
        builder: (ctx, state, shell) => MainShell(shell: shell),
        branches: [
          StatefulShellBranch(
            navigatorKey: _shellNavigatorKey,
            routes: [
              GoRoute(
                path: '/',
                builder: (c, s) => const HomeScreen(),
                routes: [
                  GoRoute(path: 'product/:id', builder: (c, s) => ProductDetailScreen(productId: s.pathParameters['id']!)),
                  GoRoute(path: 'garage', builder: (c, s) => const GarageScreen()),
                  GoRoute(path: 'ev-browse', builder: (c, s) => const EvBrowseScreen()),
                ],
              ),
            ],
          ),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/search',
              builder: (c, s) => const SearchScreen(),
              routes: [
                GoRoute(path: 'product/:id', builder: (c, s) => ProductDetailScreen(productId: s.pathParameters['id']!)),
              ],
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/orders',
              builder: (c, s) => const OrdersScreen(),
              routes: [
                GoRoute(
                  path: ':id',
                  builder: (c, s) => OrderDetailScreen(orderId: s.pathParameters['id']!),
                  routes: [
                    GoRoute(
                      path: 'track',
                      builder: (c, s) => TrackingScreen(orderId: s.pathParameters['id']!),
                    ),
                  ],
                ),
              ],
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/profile', builder: (c, s) => const ProfileScreen()),
          ]),
        ],
      ),
      GoRoute(path: '/cart', builder: (c, s) => const CartScreen()),
      GoRoute(path: '/checkout', builder: (c, s) => const CheckoutScreen()),
      GoRoute(path: '/assistant', builder: (c, s) => const AssistantScreen()),
    ],
  );
}
