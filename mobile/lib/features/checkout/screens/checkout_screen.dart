import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../core/money.dart';
import '../../../core/pincode.dart';
import '../../../shared/widgets/pill_button.dart';
import '../../../shared/widgets/rzp_text_field.dart';
import '../../cart/providers/cart_provider.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});
  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  int _step = 0;

  // Contact
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();

  // Address
  final _streetCtrl = TextEditingController();
  final _localityCtrl = TextEditingController();
  final _pincodeCtrl = TextEditingController();
  String? _pincodeMsg;
  bool _pincodeValid = false;

  // Payment
  String _payMethod = 'UPI';
  bool _placing = false;

  @override
  void dispose() {
    _nameCtrl.dispose(); _phoneCtrl.dispose();
    _streetCtrl.dispose(); _localityCtrl.dispose(); _pincodeCtrl.dispose();
    super.dispose();
  }

  void _validatePincode(String v) {
    final result = Pincode.validate(v);
    setState(() {
      _pincodeMsg = result == PincodeResult.valid ? null : Pincode.message(result);
      _pincodeValid = result == PincodeResult.valid;
    });
  }

  Future<void> _placeOrder() async {
    setState(() => _placing = true);
    await Future.delayed(const Duration(milliseconds: 1500));
    if (!mounted) return;
    ref.read(cartProvider.notifier).clear();
    setState(() => _placing = false);
    context.go('/orders/RZ-MOCK-001');
  }

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final cart = ref.watch(cartProvider);
    final subtotal = cart.fold<int>(0, (s, i) => s + i.lineTotalPaise);
    final tax = Money.gst(subtotal);
    final total = subtotal + tax.totalTaxPaise;

    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: Stepper(
        currentStep: _step,
        onStepTapped: (s) => setState(() => _step = s),
        onStepContinue: () {
          if (_step < 2) setState(() => _step++); else _placeOrder();
        },
        onStepCancel: () { if (_step > 0) setState(() => _step--); },
        controlsBuilder: (ctx, details) => Padding(
          padding: const EdgeInsets.only(top: 16),
          child: PillButton(
            label: _step == 2 ? 'Place Order · \${Money.format(total)}' : 'Continue',
            onPressed: _placing ? null : details.onStepContinue,
            loading: _placing && _step == 2,
          ),
        ),
        steps: [
          Step(
            title: const Text('Contact'),
            isActive: _step >= 0,
            content: Column(children: [
              RzpTextField(controller: _nameCtrl, hint: 'Full name', prefixIcon: const Icon(Icons.person_outline)),
              const SizedBox(height: 12),
              RzpTextField(controller: _phoneCtrl, hint: 'Phone number',
                  keyboardType: TextInputType.phone, prefixIcon: const Icon(Icons.phone_outlined)),
            ]),
          ),
          Step(
            title: const Text('Delivery Address'),
            isActive: _step >= 1,
            content: Column(children: [
              RzpTextField(controller: _streetCtrl, hint: 'Street / Flat number', prefixIcon: const Icon(Icons.home_outlined)),
              const SizedBox(height: 12),
              RzpTextField(controller: _localityCtrl, hint: 'Locality / Area', prefixIcon: const Icon(Icons.location_city_outlined)),
              const SizedBox(height: 12),
              RzpTextField(
                controller: _pincodeCtrl, hint: 'Delhi pincode (110001–110099)',
                keyboardType: TextInputType.number, prefixIcon: const Icon(Icons.pin_drop_outlined),
                errorText: _pincodeMsg,
                onChanged: _validatePincode,
              ),
              if (_pincodeValid) ...[
                const SizedBox(height: 8),
                Row(children: [
                  Icon(Icons.check_circle, size: 14, color: ext.success),
                  const SizedBox(width: 6),
                  Text(Pincode.message(PincodeResult.valid), style: TextStyle(fontSize: 12, color: ext.success)),
                ]),
              ],
            ]),
          ),
          Step(
            title: const Text('Payment'),
            isActive: _step >= 2,
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Select payment method', style: Theme.of(context).textTheme.titleSmall),
                const SizedBox(height: 12),
                ...['UPI', 'Card', 'COD'].map((m) => RadioListTile<String>(
                  title: Text(m), value: m, groupValue: _payMethod,
                  activeColor: ext.primaryRed,
                  onChanged: (v) => setState(() => _payMethod = v ?? 'UPI'),
                  contentPadding: EdgeInsets.zero,
                )),
                const SizedBox(height: 12),
                _BillPreview(subtotal: subtotal, tax: tax, total: total),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BillPreview extends StatelessWidget {
  const _BillPreview({required this.subtotal, required this.tax, required this.total});
  final int subtotal, total;
  final ({int cgstPaise, int sgstPaise, int totalTaxPaise}) tax;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant.withOpacity(0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(children: [
        _row('Subtotal', Money.format(subtotal)),
        _row('CGST (9%)', Money.format(tax.cgstPaise)),
        _row('SGST (9%)', Money.format(tax.sgstPaise)),
        const Divider(height: 16),
        _row('Total', Money.format(total), bold: true),
      ]),
    );
  }

  Widget _row(String label, String value, {bool bold = false}) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 3),
    child: Row(
      children: [
        Text(label, style: TextStyle(fontSize: bold ? 15 : 12, fontWeight: bold ? FontWeight.w800 : FontWeight.w400)),
        const Spacer(),
        Text(value, style: TextStyle(fontSize: bold ? 15 : 12, fontWeight: bold ? FontWeight.w800 : FontWeight.w400)),
      ],
    ),
  );
}
