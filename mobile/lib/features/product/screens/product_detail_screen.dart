import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../core/money.dart';
import '../../../data/local/catalog_loader.dart';
import '../../../data/models/product_model.dart';
import '../../../domain/fitment.dart';
import '../../../shared/widgets/pill_button.dart';
import '../../../shared/widgets/qty_stepper.dart';
import '../../cart/providers/cart_provider.dart';
import '../../garage/providers/garage_provider.dart';

class ProductDetailScreen extends ConsumerStatefulWidget {
  const ProductDetailScreen({super.key, required this.productId});
  final String productId;
  @override
  ConsumerState<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends ConsumerState<ProductDetailScreen> {
  bool _withInstall = false;
  int _imageIdx = 0;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final all = CatalogLoader.catalog.allProducts;
    final product = all.firstWhere((p) => p.id == widget.productId, orElse: () => all.first);
    final cartNotifier = ref.read(cartProvider.notifier);
    final qty = ref.watch(cartProvider).firstWhere(
      (i) => i.productId == product.id,
      orElse: () => CartItem(productId: '', name: '', unitPricePaise: 0, qty: 0, sellerId: ''),
    ).qty;
    final activeVehicle = ref.read(garageProvider.notifier).activeVehicle;
    final fitment = activeVehicle != null
        ? Fitment.check(fits: product.fits, modelName: activeVehicle.model)
        : FitmentResult.unknown;

    // build image list
    final images = <String>[];
    if (product.localImageAsset != null) images.add(product.localImageAsset!);
    if (product.remoteImageUrl != null) images.add(product.remoteImageUrl!);
    if (images.isEmpty) images.add('');

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: Theme.of(context).colorScheme.background,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                children: [
                  _imageWidget(images.isNotEmpty ? images[_imageIdx] : '', product),
                  // Dots
                  if (images.length > 1)
                    Positioned(
                      bottom: 12, left: 0, right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(images.length, (i) => GestureDetector(
                          onTap: () => setState(() => _imageIdx = i),
                          child: AnimatedContainer(
                            duration: 200.ms,
                            margin: const EdgeInsets.symmetric(horizontal: 3),
                            width: _imageIdx == i ? 16 : 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: _imageIdx == i ? ext.primaryRed : Colors.white54,
                              borderRadius: BorderRadius.circular(100),
                            ),
                          ),
                        )),
                      ),
                    ),
                ],
              ),
            ),
            leading: Container(
              margin: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: Colors.black38, shape: BoxShape.circle),
              child: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => context.pop()),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Brand + name
                  if (product.brand != null)
                    Text(product.brand!.toUpperCase(), style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: ext.primaryRed, letterSpacing: 1.2)),
                  const SizedBox(height: 4),
                  Text(product.name, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800, height: 1.3)),
                  const SizedBox(height: 14),
                  // Price row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      if (product.isStartingFrom)
                        Text('From ', style: TextStyle(fontSize: 14, color: Theme.of(context).colorScheme.onSurfaceVariant)),
                      Text(Money.format(product.pricePaise),
                          style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: ext.primaryRed)),
                      if (product.mrpPaise != null) ...[
                        const SizedBox(width: 10),
                        Text(Money.format(product.mrpPaise!),
                            style: TextStyle(fontSize: 16, decoration: TextDecoration.lineThrough,
                                color: Theme.of(context).colorScheme.onSurfaceVariant)),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(gradient: ext.pillGradient, borderRadius: BorderRadius.circular(100)),
                          child: Text('\${product.discountPercent}% off', style: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w700)),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 6),
                  // Availability chip
                  _AvailabilityChip(availability: product.availability),
                  const SizedBox(height: 16),
                  // Fitment
                  if (activeVehicle != null)
                    _FitmentSection(fitment: fitment, vehicleName: activeVehicle.displayName),
                  const SizedBox(height: 20),
                  // Description
                  if (product.description != null) ...[
                    Text('About this product', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    Text(product.description!, style: const TextStyle(fontSize: 14, height: 1.6)),
                    const SizedBox(height: 16),
                  ],
                  // Features
                  if ((product.features).isNotEmpty) ...[
                    Text('Key Features', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    ...product.features.map((f) => Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Row(
                        children: [
                          Icon(Icons.check_circle, size: 16, color: ext.success),
                          const SizedBox(width: 8),
                          Expanded(child: Text(f.toString(), style: const TextStyle(fontSize: 13))),
                        ],
                      ),
                    )),
                    const SizedBox(height: 16),
                  ],
                  // Specs table
                  if ((product.specifications).isNotEmpty) ...[
                    Text('Specifications', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    _SpecsTable(specs: product.specifications),
                    const SizedBox(height: 16),
                  ],
                  // Installation add-on
                  if (product.hasInstallation) ...[
                    _InstallToggle(
                      enabled: _withInstall,
                      pricePaise: product.installationPricePaise!,
                      time: product.installationTime,
                      onChanged: (v) => setState(() => _withInstall = v),
                    ),
                    const SizedBox(height: 16),
                  ],
                  if (product.warranty != null) ...[
                    Row(children: [
                      Icon(Icons.verified_outlined, size: 16, color: ext.success),
                      const SizedBox(width: 8),
                      Text('Warranty: \${product.warranty}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                    ]),
                    const SizedBox(height: 16),
                  ],
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.fromLTRB(16, 12, 16, MediaQuery.of(context).padding.bottom + 12),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 10, offset: const Offset(0, -4))],
        ),
        child: qty == 0
            ? PillButton(
                label: product.isMadeToOrder ? 'Enquire' : 'Add to Cart',
                onPressed: () => cartNotifier.addItem(CartItem(
                  productId: product.id, name: product.name,
                  imageAsset: product.localImageAsset, remoteImageUrl: product.remoteImageUrl,
                  unitPricePaise: product.pricePaise, qty: 1, sellerId: product.sellerId,
                  withInstallation: _withInstall, installationPricePaise: product.installationPricePaise,
                )),
              )
            : Row(
                children: [
                  Text('In cart:', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: ext.primaryRed)),
                  const SizedBox(width: 12),
                  QtyStepper(
                    qty: qty,
                    onDecrement: () => cartNotifier.decrementQty(product.id),
                    onIncrement: () => cartNotifier.incrementQty(product.id),
                  ),
                  const Spacer(),
                  TextButton(
                    onPressed: () => context.push('/cart'),
                    child: Text('View Cart →', style: TextStyle(color: ext.primaryRed, fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _imageWidget(String src, ProductModel product) {
    if (src.isEmpty) return Container(color: const Color(0xFF1E2028));
    if (src.startsWith('assets/')) {
      return Image.asset(src, fit: BoxFit.cover, width: double.infinity, height: 300,
          errorBuilder: (_, __, ___) => Container(color: const Color(0xFF1E2028)));
    }
    return CachedNetworkImage(imageUrl: src, fit: BoxFit.cover, width: double.infinity, height: 300,
        placeholder: (_, __) => Container(color: const Color(0xFF1E2028)),
        errorWidget: (_, __, ___) => Container(color: const Color(0xFF1E2028)));
  }
}

class _AvailabilityChip extends StatelessWidget {
  const _AvailabilityChip({required this.availability});
  final String availability;

  @override
  Widget build(BuildContext context) {
    final (color, icon) = switch (availability) {
      'In stock'       => (const Color(0xFF1FA45B), Icons.check_circle_outline),
      'Made to order'  => (const Color(0xFFF5A524), Icons.schedule_outlined),
      'Coming soon'    => (Colors.blue, Icons.hourglass_empty_outlined),
      _                => (const Color(0xFF9A9CA4), Icons.info_outline),
    };
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 5),
        Text(availability, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: color)),
      ],
    );
  }
}

class _FitmentSection extends StatelessWidget {
  const _FitmentSection({required this.fitment, required this.vehicleName});
  final FitmentResult fitment;
  final String vehicleName;

  @override
  Widget build(BuildContext context) {
    final (color, icon, label, bg) = switch (fitment) {
      FitmentResult.compatible   => (const Color(0xFF1FA45B), Icons.check_circle, 'Fits your \$vehicleName', const Color(0xFFEAF7EF)),
      FitmentResult.unknown      => (const Color(0xFFF5A524), Icons.help_outline, 'Confirm fitment for \$vehicleName', const Color(0xFFFFF8EA)),
      FitmentResult.incompatible => (const Color(0xFFD92D20), Icons.cancel_outlined, 'May not fit your \$vehicleName', const Color(0xFFFFF0EF)),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
      child: Row(
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(width: 8),
          Expanded(child: Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: color))),
        ],
      ),
    );
  }
}

class _SpecsTable extends StatelessWidget {
  const _SpecsTable({required this.specs});
  final List<dynamic> specs;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).colorScheme.outline),
      ),
      child: Column(
        children: List.generate(specs.length, (i) {
          final spec = specs[i] as Map<String, dynamic>;
          final isLast = i == specs.length - 1;
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
            decoration: BoxDecoration(
              border: isLast ? null : Border(bottom: BorderSide(color: Theme.of(context).colorScheme.outline)),
            ),
            child: Row(
              children: [
                Expanded(flex: 2, child: Text(spec['label']?.toString() ?? '', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500))),
                Expanded(flex: 3, child: Text(spec['value']?.toString() ?? '', style: TextStyle(fontSize: 13, color: Theme.of(context).colorScheme.onSurfaceVariant))),
              ],
            ),
          );
        }),
      ),
    );
  }
}

class _InstallToggle extends StatelessWidget {
  const _InstallToggle({required this.enabled, required this.pricePaise, this.time, required this.onChanged});
  final bool enabled;
  final int pricePaise;
  final String? time;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        border: Border.all(color: enabled ? ext.primaryRed : Theme.of(context).colorScheme.outline, width: enabled ? 1.5 : 1),
        borderRadius: BorderRadius.circular(12),
        color: enabled ? ext.primaryRed.withOpacity(0.04) : null,
      ),
      child: Row(
        children: [
          Checkbox(value: enabled, onChanged: (v) => onChanged(v ?? false), activeColor: ext.primaryRed),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Add certified installation', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
                Text(
                  '+\${Money.format(pricePaise)}\${time != null ? " · \$time" : ""}',
                  style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.onSurfaceVariant),
                ),
              ],
            ),
          ),
          Icon(Icons.build_outlined, size: 20, color: enabled ? ext.primaryRed : Theme.of(context).colorScheme.onSurfaceVariant),
        ],
      ),
    );
  }
}
