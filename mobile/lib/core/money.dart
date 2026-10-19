import 'package:intl/intl.dart';

class Money {
  Money._();

  static final _fmt = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '\u20B9',
    decimalDigits: 0,
  );

  /// Format paise as Rs X (e.g. "₹1,499")
  static String format(int paise) => _fmt.format(paise / 100);

  /// Format paise as Rs X.XX when fractional
  static String formatDecimal(int paise) {
    final rupees = paise / 100;
    if (rupees == rupees.roundToDouble()) return format(paise);
    return NumberFormat.currency(locale: 'en_IN', symbol: '\u20B9', decimalDigits: 2)
        .format(rupees);
  }

  static int rupeeToPane(double rupees) => (rupees * 100).round();

  /// GST split: 18% = 9% CGST + 9% SGST
  static ({int cgstPaise, int sgstPaise, int totalTaxPaise}) gst(int subtotalPaise) {
    final taxPaise = (subtotalPaise * 0.18).round();
    final half = taxPaise ~/ 2;
    return (cgstPaise: half, sgstPaise: taxPaise - half, totalTaxPaise: taxPaise);
  }

  /// Delivery fee per vendor: round(40 + km * 12) rupees => paise
  static int deliveryFeePaise(double km) => ((40 + km * 12).round()) * 100;

  /// ETA minutes: round(prepMins + (km / 22) * 60 + 5)
  static int etaMinutes(int prepMins, double km) =>
      (prepMins + (km / 22) * 60 + 5).round();
}
