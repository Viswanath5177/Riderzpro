import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../app/theme/app_theme_extension.dart';
import '../../core/money.dart';
import '../../data/models/product_model.dart';
import '../../domain/fitment.dart';
import 'qty_stepper.dart';
import 'skeleton_loader.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.product,
    required this.qty,
    required this.onAdd,
    required this.onDecrement,
    required this.onIncrement,
    required this.onTap,
    this.activeVehicleModel,
    this.delay = Duration.zero,
  });

  final ProductModel product;
  final int qty;
  final VoidCallback onAdd;
  final VoidCallback onDecrement;
  final VoidCallback onIncrement;
  final VoidCallback onTap;
  final String? activeVehicleModel;
  final Duration delay;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final cs = Theme.of(context).colorScheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final fitment = activeVehicleModel != null
        ? Fitment.check(fits: product.fits, modelName: activeVehicleModel!)
        : FitmentResult.unknown;

    final discPct = product.discountPercent;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1A1C24) : Colors.white,
          borderRadius: BorderRadius.circular(ext.cardRadius),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(isDark ? 0.3 : 0.07),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image area
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  child: AspectRatio(
                    aspectRatio: 1,
                    child: _ProductImage(product: product),
                  ),
                ),
                if (discPct > 0)
                  Positioned(
                    top: 8, left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        gradient: ext.pillGradient,
                        borderRadius: BorderRadius.circular(100),
                      ),
                      child: Text(
                        '-\$discPct%',
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                    ),
                  ),
                // Bestseller badge
                if (product.bestseller)
                  Positioned(
                    top: 8, right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: ext.warning,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'BESTSELLER',
                        style: TextStyle(fontSize: 8, fontWeight: FontWeight.w800, color: Colors.white),
                      ),
                    ),
                  ),
              ],
            ),
            // Details
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Fitment badge
                  if (activeVehicleModel != null)
                    _FitmentBadge(result: fitment),
                  const SizedBox(height: 4),
                  Text(
                    product.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, height: 1.3),
                  ),
                  const SizedBox(height: 4),
                  // Price row
                  Row(
                    children: [
                      if (product.isStartingFrom)
                        Text('From ', style: TextStyle(fontSize: 10, color: cs.onSurfaceVariant)),
                      Text(
                        Money.format(product.pricePaise),
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: ext.primaryRed),
                      ),
                      if (product.mrpPaise != null) ...[
                        const SizedBox(width: 4),
                        Text(
                          Money.format(product.mrpPaise!),
                          style: TextStyle(
                            fontSize: 10, decoration: TextDecoration.lineThrough,
                            color: cs.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 8),
                  // Add / Stepper
                  if (product.isMadeToOrder)
                    Text('Made to order', style: TextStyle(fontSize: 10, color: ext.warning, fontWeight: FontWeight.w600))
                  else if (qty == 0)
                    _AddBtn(onAdd: onAdd, ext: ext)
                  else
                    QtyStepper(qty: qty, onDecrement: onDecrement, onIncrement: onIncrement, small: true),
                ],
              ),
            ),
          ],
        ),
      ).animate(delay: delay).fadeIn(duration: 300.ms).slideY(begin: 0.06, duration: 300.ms),
    );
  }
}

class _ProductImage extends StatelessWidget {
  const _ProductImage({required this.product});
  final ProductModel product;

  @override
  Widget build(BuildContext context) {
    if (product.hasLocalImage) {
      return Image.asset(
        product.localImageAsset!,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => const _PlaceholderImg(),
      );
    }
    if (product.hasRemoteImage) {
      return CachedNetworkImage(
        imageUrl: product.remoteImageUrl!,
        fit: BoxFit.cover,
        placeholder: (_, __) => const _ShimmerPlaceholder(),
        errorWidget: (_, __, ___) => const _PlaceholderImg(),
      );
    }
    return const _PlaceholderImg();
  }
}

class _ShimmerPlaceholder extends StatelessWidget {
  const _ShimmerPlaceholder();
  @override
  Widget build(BuildContext context) => SkeletonLoader(child: Container(color: Colors.white));
}

class _PlaceholderImg extends StatelessWidget {
  const _PlaceholderImg();
  @override
  Widget build(BuildContext context) => Image.asset(
    'assets/photos/scooter-fallback.png',
    fit: BoxFit.cover,
    errorBuilder: (_, __, ___) => Container(
      color: const Color(0xFF1E2028),
      child: const Icon(Icons.directions_car, size: 40, color: Color(0xFF3A3C44)),
    ),
  );
}

class _FitmentBadge extends StatelessWidget {
  const _FitmentBadge({required this.result});
  final FitmentResult result;

  @override
  Widget build(BuildContext context) {
    final (color, icon, label) = switch (result) {
      FitmentResult.compatible   => (const Color(0xFF1FA45B), Icons.check_circle_outline, 'Fits'),
      FitmentResult.unknown      => (const Color(0xFFF5A524), Icons.help_outline, 'Confirm'),
      FitmentResult.incompatible => (const Color(0xFFD92D20), Icons.cancel_outlined, "Doesn't fit"),
    };
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 10, color: color),
        const SizedBox(width: 3),
        Text(label, style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: color)),
      ],
    );
  }
}

class _AddBtn extends StatelessWidget {
  const _AddBtn({required this.onAdd, required this.ext});
  final VoidCallback onAdd;
  final AppThemeExtension ext;

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onAdd,
    child: Container(
      height: 28,
      decoration: BoxDecoration(
        gradient: ext.pillGradient,
        borderRadius: BorderRadius.circular(100),
      ),
      alignment: Alignment.center,
      child: const Text('ADD', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
    ),
  );
}
