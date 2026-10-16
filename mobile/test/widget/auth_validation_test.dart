import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:riderzpro/app/theme/app_theme.dart';
import 'package:riderzpro/features/auth/screens/auth_screen.dart';

void main() {
  testWidgets('Auth screen displays visual elements & validates email/phone', (tester) async {
    // Set screen size to typical mobile viewport
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.625;
    addTearDown(tester.view.resetPhysicalSize);

    final router = GoRouter(
      initialLocation: '/auth',
      routes: [
        GoRoute(
          path: '/auth',
          builder: (context, state) => const AuthScreen(),
        ),
        GoRoute(
          path: '/auth/otp',
          builder: (context, state) => const Scaffold(body: Text('OTP Screen')),
        ),
      ],
    );

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp.router(
          theme: AppTheme.light(),
          routerConfig: router,
        ),
      ),
    );

    // Pump past entry animations
    await tester.pump(const Duration(milliseconds: 600));

    // Verify visual headings & buttons
    expect(find.text('Welcome Back'), findsOneWidget);
    expect(find.text('Keep me signed in'), findsOneWidget);
    expect(find.text('Send Code'), findsOneWidget);

    // Verify social sign-in buttons exist
    expect(find.text('Google'), findsOneWidget);
    expect(find.text('Apple'), findsOneWidget);

    // Tap Send Code with empty field -> triggers validation error
    await tester.tap(find.text('Send Code'));
    await tester.pump(const Duration(milliseconds: 100));

    // Field should display inline validation
    expect(find.text("That email or phone doesn't look right"), findsOneWidget);

    // Enter valid email
    final inputField = find.byType(TextField);
    await tester.enterText(inputField, 'rider@example.com');
    await tester.pump(const Duration(milliseconds: 100));

    // Tap Send Code again
    await tester.tap(find.text('Send Code'));
    // Pump past the 600ms loading delay into navigation
    await tester.pump(const Duration(milliseconds: 700));
    await tester.pump(const Duration(milliseconds: 200));

    // Error should be cleared and OTP route navigated to
    expect(find.text("That email or phone doesn't look right"), findsNothing);
    expect(find.text('OTP Screen'), findsOneWidget);
  });
}
