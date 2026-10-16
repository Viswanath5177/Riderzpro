import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../core/haptics.dart';
import '../../../shared/widgets/pill_button.dart';
import '../providers/auth_provider.dart';

class OtpScreen extends ConsumerStatefulWidget {
  const OtpScreen({super.key, required this.identity, required this.isSignUp, this.keepSignedIn = true});
  final String identity;
  final bool isSignUp;
  final bool keepSignedIn;
  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen> {
  final List<TextEditingController> _ctrls = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _nodes = List.generate(6, (_) => FocusNode());
  int _resendSecs = 60;
  Timer? _timer;
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _resendSecs = 60;
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_resendSecs > 0) {
        setState(() => _resendSecs--);
      } else {
        _timer?.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (final c in _ctrls) c.dispose();
    for (final n in _nodes) n.dispose();
    super.dispose();
  }

  String get _otp => _ctrls.map((c) => c.text).join();

  Future<void> _verify() async {
    if (_otp.length < 6) {
      setState(() => _error = 'Enter the 6-digit code');
      return;
    }
    setState(() { _error = null; _loading = true; });
    Haptics.medium();
    await Future.delayed(800.ms);
    if (!mounted) return;
    // Mock: any 6-digit OTP succeeds
    await ref.read(authStateProvider.notifier).login(
      token: 'mock_token_\${widget.identity}',
      userId: 'mock_user_01',
      persist: widget.keepSignedIn,
    );
    if (!mounted) return;
    setState(() => _loading = false);
    context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: BackButton(onPressed: () => context.pop()),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 8),
              Text('Verify Code',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800))
                  .animate().fadeIn(duration: 300.ms),
              const SizedBox(height: 8),
              Text(
                'We sent a 6-digit code to
\${widget.identity}',
                style: TextStyle(fontSize: 14, color: Theme.of(context).colorScheme.onSurfaceVariant, height: 1.4),
              ).animate(delay: 50.ms).fadeIn(duration: 300.ms),
              const SizedBox(height: 40),
              // OTP boxes
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(6, (i) => _OtpBox(
                  controller: _ctrls[i],
                  focusNode: _nodes[i],
                  error: _error != null,
                  onChanged: (v) {
                    if (v.length == 1 && i < 5) _nodes[i + 1].requestFocus();
                    if (v.isEmpty && i > 0) _nodes[i - 1].requestFocus();
                    if (_error != null) setState(() => _error = null);
                    if (i == 5 && v.isNotEmpty) _verify();
                  },
                )),
              ).animate(delay: 100.ms).fadeIn(duration: 300.ms),
              if (_error != null) ...[
                const SizedBox(height: 8),
                Row(children: [
                  Icon(Icons.info_outline, size: 13, color: ext.errorColor),
                  const SizedBox(width: 4),
                  Text(_error!, style: TextStyle(fontSize: 12, color: ext.errorColor)),
                ]),
              ],
              const SizedBox(height: 32),
              // Resend
              Center(
                child: _resendSecs > 0
                    ? Text('Resend code in \${_resendSecs}s',
                        style: TextStyle(fontSize: 13, color: Theme.of(context).colorScheme.onSurfaceVariant))
                    : TextButton(
                        onPressed: () { Haptics.light(); _startTimer(); },
                        child: Text('Resend Code', style: TextStyle(color: ext.primaryRed, fontWeight: FontWeight.w600)),
                      ),
              ),
              const Spacer(),
              PillButton(label: 'Verify', onPressed: _loading ? null : _verify, loading: _loading),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}

class _OtpBox extends StatelessWidget {
  const _OtpBox({required this.controller, required this.focusNode, required this.error, required this.onChanged});
  final TextEditingController controller;
  final FocusNode focusNode;
  final bool error;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return SizedBox(
      width: 46, height: 56,
      child: TextField(
        controller: controller,
        focusNode: focusNode,
        textAlign: TextAlign.center,
        keyboardType: TextInputType.number,
        maxLength: 1,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        onChanged: onChanged,
        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
        decoration: InputDecoration(
          counterText: '',
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide(color: error ? ext.errorColor : Theme.of(context).colorScheme.outline, width: error ? 1.5 : 1),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide(color: error ? ext.errorColor : ext.primaryRed, width: 2),
          ),
          filled: true,
          fillColor: error ? ext.errorColor.withOpacity(0.04) : ext.fieldFill,
        ),
      ),
    );
  }
}
