import 'package:flutter_test/flutter_test.dart';
import 'package:riderzpro/domain/pricing.dart';

void main() {
  group('Pricing Unit Tests', () {
    test('deliveryFeePerVendor: 40 + km * 12 formula', () {
      // 0 km: round(40 + 0) = 40 Rs -> 4000 paise
      expect(Pricing.deliveryFeePerVendorPaise(0), 4000);

      // 5 km: round(40 + 60) = 100 Rs -> 10000 paise
      expect(Pricing.deliveryFeePerVendorPaise(5), 10000);

      // 3.5 km: round(40 + 42) = 82 Rs -> 8200 paise
      expect(Pricing.deliveryFeePerVendorPaise(3.5), 8200);

      // 7.2 km: 40 + 7.2 * 12 = 40 + 86.4 = 126.4 -> 126 Rs -> 12600 paise
      expect(Pricing.deliveryFeePerVendorPaise(7.2), 12600);
    });

    test('calculateEtaMinutes: round(prepMins + (km / 22) * 60 + 5)', () {
      // 0 km: 15 + 0 + 5 = 20 mins
      expect(Pricing.calculateEtaMinutes(km: 0, prepMins: 15), 20);

      // 22 km: 15 + 60 + 5 = 80 mins
      expect(Pricing.calculateEtaMinutes(km: 22, prepMins: 15), 80);

      // 5.5 km (quarter of 22): 15 + 15 + 5 = 35 mins
      expect(Pricing.calculateEtaMinutes(km: 5.5, prepMins: 15), 35);
    });

    test('calculateGst: 18% split into CGST and SGST', () {
      // 10000 paise (Rs 100) -> 1800 paise tax (900 CGST + 900 SGST)
      final gst = Pricing.calculateGst(10000);
      expect(gst.totalTaxPaise, 1800);
      expect(gst.cgstPaise, 900);
      expect(gst.sgstPaise, 900);
      expect(gst.cgstPaise + gst.sgstPaise, gst.totalTaxPaise);
    });

    test('computeOrder: multi-vendor calculation and breakdown', () {
      final breakdown = Pricing.computeOrder(
        itemsSubtotalPaise: 50000, // Rs 500
        vendorDistancesKm: {
          'v1': 3.0, // 40 + 36 = 76 Rs -> 7600 paise
          'v2': 5.0, // 40 + 60 = 100 Rs -> 10000 paise
        },
        discountPaise: 5000, // Rs 50 coupon
      );

      expect(breakdown.subtotalPaise, 50000);
      expect(breakdown.discountPaise, 5000);
      expect(breakdown.deliveryPaise, 17600); // 7600 + 10000
      expect(breakdown.vendorDeliveryFees['v1'], 7600);
      expect(breakdown.vendorDeliveryFees['v2'], 10000);

      // Tax on (50000 - 5000) = 45000 * 0.18 = 8100 paise
      expect(breakdown.taxPaise, 8100);
      // Total = 45000 + 17600 + 8100 = 70700 paise (Rs 707)
      expect(breakdown.totalPaise, 70700);
    });
  });
}
