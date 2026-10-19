import 'dart:math' as math;

class PricingBreakdown {
  const PricingBreakdown({
    required this.subtotalPaise,
    required this.deliveryPaise,
    required this.discountPaise,
    required this.taxPaise,
    required this.cgstPaise,
    required this.sgstPaise,
    required this.totalPaise,
    required this.vendorDeliveryFees,
  });

  final int subtotalPaise;
  final int deliveryPaise;
  final int discountPaise;
  final int taxPaise;
  final int cgstPaise;
  final int sgstPaise;
  final int totalPaise;
  final Map<String, int> vendorDeliveryFees; // vendorId -> paise
}

class Pricing {
  Pricing._();

  /// Standard GST rate for auto/bike accessories (18%)
  static const double gstRate = 0.18;

  /// Delivery fee per vendor = round(40 + km * 12) rupees
  /// Returns amount in paise (1 rupee = 100 paise)
  static int deliveryFeePerVendorPaise(double km) {
    final feeRupees = (40.0 + km * 12.0).round();
    return feeRupees * 100;
  }

  /// ETA minutes = round(prepMins + (km / 22) * 60 + 5)
  static int calculateEtaMinutes({required double km, int prepMins = 15}) {
    final eta = prepMins + (km / 22.0) * 60.0 + 5.0;
    return eta.round();
  }

  /// Calculates 18% GST split into 9% CGST + 9% SGST
  static ({int totalTaxPaise, int cgstPaise, int sgstPaise}) calculateGst(int taxableAmountPaise) {
    final totalTax = (taxableAmountPaise * gstRate).round();
    final half = (totalTax / 2.0).round();
    return (
      totalTaxPaise: totalTax,
      cgstPaise: half,
      sgstPaise: totalTax - half,
    );
  }

  /// Compute full order pricing breakdown with multi-vendor fees
  static PricingBreakdown computeOrder({
    required int itemsSubtotalPaise,
    required Map<String, double> vendorDistancesKm, // vendorId -> km
    int discountPaise = 0,
    int installationSubtotalPaise = 0,
  }) {
    final subtotal = itemsSubtotalPaise + installationSubtotalPaise;
    final vendorFees = <String, int>{};
    int totalDelivery = 0;

    for (final entry in vendorDistancesKm.entries) {
      final fee = deliveryFeePerVendorPaise(entry.value);
      vendorFees[entry.key] = fee;
      totalDelivery += fee;
    }

    // Default to at least one vendor delivery fee if empty
    if (vendorFees.isEmpty) {
      totalDelivery = deliveryFeePerVendorPaise(3.5); // ~3.5km typical Delhi trip
      vendorFees['default'] = totalDelivery;
    }

    final taxableAmount = math.max(0, subtotal - discountPaise);
    final gst = calculateGst(taxableAmount);
    final total = taxableAmount + totalDelivery + gst.totalTaxPaise;

    return PricingBreakdown(
      subtotalPaise: subtotal,
      deliveryPaise: totalDelivery,
      discountPaise: discountPaise,
      taxPaise: gst.totalTaxPaise,
      cgstPaise: gst.cgstPaise,
      sgstPaise: gst.sgstPaise,
      totalPaise: total,
      vendorDeliveryFees: vendorFees,
    );
  }
}
