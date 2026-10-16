import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../app/theme/brand_colors.dart';
import '../../../core/env/config.dart';
import '../../../core/haptics.dart';
import '../../../shared/widgets/pill_button.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key, this.isSignUp = false});
  final bool isSignUp;
  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _identityCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _keepSignedIn = true;
  bool _passVisible = false;
  String? _identityError;
  String? _passError;
  bool _loading = false;
  bool _isSignUp = false;

  @override
  void initState() { super.initState(); _isSignUp = widget.isSignUp; }

  @override
  void dispose() { _identityCtrl.dispose(); _passCtrl.dispose(); super.dispose(); }

  bool _validateIdentity(String val) {
    final emailRe = RegExp(r'^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$');
    final phoneRe = RegExp(r'^[+]?[0-9]{10,14}$');
    return emailRe.hasMatch(val) || phoneRe.hasMatch(val.replaceAll(' ', ''));
  }

  Future<void> _sendCode() async {
    final id = _identityCtrl.text.trim();
    if (!_validateIdentity(id)) {
      setState(() => _identityError = "That email or phone doesn't look right");
      return;
    }
    setState(() { _identityError = null; _loading = true; });
    Haptics.medium();
    await Future.delayed(600.ms);
    if (!mounted) return;
    setState(() => _loading = false);
    context.go('/auth/otp', extra: {'identity': id, 'isSignUp': _isSignUp, 'keepSignedIn': _keepSignedIn});
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final heroH = size.height * 0.35;
    final ext = AppThemeExtension.of(context);
    final cfg = AppConfig.instance;

    return Scaffold(
      backgroundColor: const Color(0xFF14161A),
      body: SingleChildScrollView(
        child: SizedBox(
          height: size.height,
          child: Stack(
            children: [
              // Hero background
              SizedBox(
                height: heroH + 40,
                width: double.infinity,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.asset('assets/photos/ev-login-showcase.jpg', fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container()),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [ext.graphite.withOpacity(0.7), ext.primaryRed.withOpacity(0.8)],
                          begin: Alignment.topCenter, end: Alignment.bottomCenter,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Wordmark
              Positioned(
                top: MediaQuery.of(context).padding.top + 20,
                left: 24,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ColorFiltered(
                      colorFilter: const ColorFilter.mode(Colors.white, BlendMode.srcIn),
                      child: Image.asset('assets/brand/logo.png', height: 36,
                          errorBuilder: (_, __, ___) => const Text('RIDERZPRO',
                              style: TextStyle(fontFamily: 'BarlowCondensed', fontSize: 28,
                                  fontWeight: FontWeight.w700, color: Colors.white))),
                    ),
                    const SizedBox(height: 4),
                    Text('Parts that fit. Delivered fast.',
                        style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.85),
                            fontWeight: FontWeight.w500)),
                  ],
                ).animate().fadeIn(duration: 500.ms),
              ),
              // Sheet
              Positioned(
                top: heroH,
                left: 0, right: 0, bottom: 0,
                child: Container(
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.background,
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 20, offset: const Offset(0, -4))],
                  ),
                  child: SingleChildScrollView(
                    padding: EdgeInsets.fromLTRB(24, 28, 24, MediaQuery.of(context).padding.bottom + 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _isSignUp ? 'Create Account' : 'Welcome Back',
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800),
                        ).animate().fadeIn(duration: 350.ms).slideY(begin: 0.05),
                        const SizedBox(height: 6),
                        Text(
                          _isSignUp ? 'Enter your email or phone to get started.' : 'Sign in to your Riderzpro account.',
                          style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14),
                        ).animate(delay: 50.ms).fadeIn(duration: 300.ms),
                        const SizedBox(height: 28),
                        // Identity field
                        _IdentityField(
                          controller: _identityCtrl,
                          error: _identityError,
                          onChanged: (v) { if (_identityError != null) setState(() => _identityError = null); },
                        ).animate(delay: 100.ms).fadeIn(duration: 300.ms),
                        // Password field (feature-flagged)
                        if (cfg.authPasswordEnabled) ...[
                          const SizedBox(height: 14),
                          _PasswordField(
                            controller: _passCtrl,
                            visible: _passVisible,
                            error: _passError,
                            onToggle: () => setState(() => _passVisible = !_passVisible),
                          ).animate(delay: 150.ms).fadeIn(duration: 300.ms),
                        ],
                        const SizedBox(height: 16),
                        // Keep signed in + Forgot password row
                        Row(
                          children: [
                            Checkbox(
                              value: _keepSignedIn,
                              onChanged: (v) { Haptics.select(); setState(() => _keepSignedIn = v ?? true); },
                              activeColor: ext.primaryRed,
                              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            const Text('Keep me signed in', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                            const Spacer(),
                            if (cfg.authPasswordEnabled)
                              TextButton(
                                onPressed: () {},
                                style: TextButton.styleFrom(padding: EdgeInsets.zero, minimumSize: const Size(0, 0)),
                                child: Text('Forgot Password?', style: TextStyle(fontSize: 13, color: ext.primaryRed, fontWeight: FontWeight.w600)),
                              ),
                          ],
                        ).animate(delay: 200.ms).fadeIn(duration: 300.ms),
                        const SizedBox(height: 24),
                        // Primary CTA
                        PillButton(
                          label: 'Send Code',
                          onPressed: _loading ? null : _sendCode,
                          loading: _loading,
                        ).animate(delay: 250.ms).fadeIn(duration: 300.ms).slideY(begin: 0.05),
                        const SizedBox(height: 24),
                        // Divider
                        Row(children: [
                          const Expanded(child: Divider()),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            child: Text('Or continue with', style: TextStyle(fontSize: 13, color: Theme.of(context).colorScheme.onSurfaceVariant)),
                          ),
                          const Expanded(child: Divider()),
                        ]).animate(delay: 300.ms).fadeIn(duration: 300.ms),
                        const SizedBox(height: 16),
                        // Social buttons
                        if (cfg.authSocialEnabled)
                          Row(
                            children: [
                              Expanded(child: _SocialBtn(label: 'Google', icon: Icons.g_mobiledata, onTap: () {})),
                              const SizedBox(width: 12),
                              Expanded(child: _SocialBtn(label: 'Apple', icon: Icons.apple, onTap: () {})),
                            ],
                          ).animate(delay: 350.ms).fadeIn(duration: 300.ms),
                        const SizedBox(height: 28),
                        // Sign up / Sign in toggle
                        Center(
                          child: GestureDetector(
                            onTap: () => setState(() => _isSignUp = !_isSignUp),
                            child: RichText(
                              text: TextSpan(
                                style: TextStyle(fontSize: 14, color: Theme.of(context).colorScheme.onSurfaceVariant),
                                children: [
                                  TextSpan(text: _isSignUp ? 'Already have an account? ' : 'New here? '),
                                  TextSpan(
                                    text: _isSignUp ? 'Sign In' : 'Create account',
                                    style: TextStyle(color: ext.primaryRed, fontWeight: FontWeight.w700),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ).animate(delay: 400.ms).fadeIn(duration: 300.ms),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _IdentityField extends StatelessWidget {
  const _IdentityField({required this.controller, this.error, this.onChanged});
  final TextEditingController controller;
  final String? error;
  final ValueChanged<String>? onChanged;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final hasErr = error != null && error!.isNotEmpty;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          decoration: hasErr
              ? BoxDecoration(
                  color: ext.errorColor.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: ext.errorColor, width: 1.5),
                )
              : null,
          child: TextField(
            controller: controller,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.done,
            autofillHints: const [AutofillHints.email, AutofillHints.telephoneNumber],
            onChanged: onChanged,
            decoration: InputDecoration(
              hintText: 'Email or phone number',
              prefixIcon: const Icon(Icons.person_outline),
              border: hasErr ? InputBorder.none : null,
            ),
          ),
        ),
        if (hasErr) ...[
          const SizedBox(height: 4),
          Row(children: [
            Icon(Icons.info_outline, size: 13, color: ext.errorColor),
            const SizedBox(width: 4),
            Flexible(child: Text(error!, style: TextStyle(fontSize: 12, color: ext.errorColor))),
          ]),
        ],
      ],
    );
  }
}

class _PasswordField extends StatelessWidget {
  const _PasswordField({required this.controller, required this.visible, this.error, required this.onToggle});
  final TextEditingController controller;
  final bool visible;
  final String? error;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final hasErr = error != null && error!.isNotEmpty;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          decoration: hasErr
              ? BoxDecoration(
                  color: ext.errorColor.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: ext.errorColor, width: 1.5),
                )
              : null,
          child: TextField(
            controller: controller,
            obscureText: !visible,
            textInputAction: TextInputAction.done,
            decoration: InputDecoration(
              hintText: 'Password',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(visible ? Icons.visibility_off_outlined : Icons.visibility_outlined),
                onPressed: onToggle,
              ),
              border: hasErr ? InputBorder.none : null,
            ),
          ),
        ),
        if (hasErr) ...[
          const SizedBox(height: 4),
          Row(children: [
            Icon(Icons.info_outline, size: 13, color: ext.errorColor),
            const SizedBox(width: 4),
            Flexible(child: Text(error!, style: TextStyle(fontSize: 12, color: ext.errorColor))),
          ]),
        ],
      ],
    );
  }
}

class _SocialBtn extends StatelessWidget {
  const _SocialBtn({required this.label, required this.icon, required this.onTap});
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 20),
      label: Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(0, 52),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
        side: BorderSide(color: Theme.of(context).colorScheme.outline),
      ),
    );
  }
}
