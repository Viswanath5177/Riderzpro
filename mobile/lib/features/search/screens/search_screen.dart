import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../data/local/catalog_loader.dart';
import '../../../data/models/product_model.dart';
import '../../../shared/widgets/product_card.dart';
import '../../../shared/widgets/skeleton_loader.dart';
import '../../cart/providers/cart_provider.dart';
import '../../garage/providers/garage_provider.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});
  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _ctrl = TextEditingController();
  String _query = '';
  String? _filterDept;
  String? _filterVehicle;
  bool _inStock = false;
  bool _hasInstall = false;

  List<ProductModel> get _results {
    final all = CatalogLoader.catalog.allProducts;
    return all.where((p) {
      final q = _query.toLowerCase();
      if (q.isNotEmpty) {
        final match = (p.name.toLowerCase().contains(q) ||
            (p.brand?.toLowerCase().contains(q) ?? false) ||
            (p.category?.toLowerCase().contains(q) ?? false) ||
            (p.description?.toLowerCase().contains(q) ?? false));
        if (!match) return false;
      }
      if (_filterDept != null && p.department != _filterDept) return false;
      if (_filterVehicle != null && p.vehicleType != _filterVehicle && p.vehicleType != 'both') return false;
      if (_inStock && !p.isInStock) return false;
      if (_hasInstall && !p.hasInstallation) return false;
      return true;
    }).toList();
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final cart = ref.watch(cartProvider);
    final cartNotifier = ref.read(cartProvider.notifier);
    final activeVehicle = ref.read(garageProvider.notifier).activeVehicle;
    final results = _results;

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _ctrl,
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'Search accessories, EVs...',
            border: InputBorder.none,
            contentPadding: EdgeInsets.zero,
            prefixIcon: Icon(Icons.search, color: ext.primaryRed),
          ),
          onChanged: (v) => setState(() => _query = v),
        ),
        actions: [
          if (_query.isNotEmpty)
            IconButton(icon: const Icon(Icons.clear), onPressed: () {
              _ctrl.clear(); setState(() => _query = '');
            }),
          IconButton(
            icon: const Icon(Icons.tune),
            onPressed: _showFilters,
          ),
        ],
      ),
      body: results.isEmpty && _query.isEmpty
          ? _EmptySearchState()
          : results.isEmpty
              ? Center(child: Text('No results for "\$_query"', style: const TextStyle(fontSize: 15)))
              : GridView.builder(
                  padding: const EdgeInsets.all(12),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2, childAspectRatio: 0.65,
                    crossAxisSpacing: 10, mainAxisSpacing: 10,
                  ),
                  itemCount: results.length,
                  itemBuilder: (_, i) {
                    final p = results[i];
                    final qty = cart.firstWhere((item) => item.productId == p.id,
                        orElse: () => CartItem(productId: '', name: '', unitPricePaise: 0, qty: 0, sellerId: '')).qty;
                    return ProductCard(
                      product: p,
                      qty: qty,
                      activeVehicleModel: activeVehicle?.model,
                      onTap: () => context.go('/search/product/\${p.id}'),
                      onAdd: () => cartNotifier.addItem(CartItem(
                        productId: p.id, name: p.name, imageAsset: p.localImageAsset,
                        remoteImageUrl: p.remoteImageUrl, unitPricePaise: p.pricePaise,
                        qty: 1, sellerId: p.sellerId,
                        installationPricePaise: p.installationPricePaise,
                      )),
                      onDecrement: () => cartNotifier.decrementQty(p.id),
                      onIncrement: () => cartNotifier.incrementQty(p.id),
                    );
                  },
                ),
    );
  }

  void _showFilters() {
    final depts = CatalogLoader.catalog.departments.map((d) => d['name'] as String).toList();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (_) => StatefulBuilder(
        builder: (ctx, setModal) => Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Filters', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 16),
              Text('Department', style: Theme.of(context).textTheme.titleSmall),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8, runSpacing: 8,
                children: [
                  FilterChip(label: const Text('All'), selected: _filterDept == null,
                      onSelected: (_) { setState(() => _filterDept = null); setModal(() {}); }),
                  ...depts.map((d) => FilterChip(
                    label: Text(d), selected: _filterDept == d,
                    onSelected: (_) { setState(() => _filterDept = _filterDept == d ? null : d); setModal(() {}); },
                  )),
                ],
              ),
              const SizedBox(height: 16),
              Text('Vehicle Type', style: Theme.of(context).textTheme.titleSmall),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: [
                  FilterChip(label: const Text('All'), selected: _filterVehicle == null,
                      onSelected: (_) { setState(() => _filterVehicle = null); setModal(() {}); }),
                  FilterChip(label: const Text('Car'), selected: _filterVehicle == 'car',
                      onSelected: (_) { setState(() => _filterVehicle = _filterVehicle == 'car' ? null : 'car'); setModal(() {}); }),
                  FilterChip(label: const Text('Bike'), selected: _filterVehicle == 'bike',
                      onSelected: (_) { setState(() => _filterVehicle = _filterVehicle == 'bike' ? null : 'bike'); setModal(() {}); }),
                ],
              ),
              const SizedBox(height: 16),
              CheckboxListTile(
                title: const Text('In stock only'), value: _inStock,
                onChanged: (v) { setState(() => _inStock = v ?? false); setModal(() {}); },
                contentPadding: EdgeInsets.zero,
              ),
              CheckboxListTile(
                title: const Text('Installation available'), value: _hasInstall,
                onChanged: (v) { setState(() => _hasInstall = v ?? false); setModal(() {}); },
                contentPadding: EdgeInsets.zero,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptySearchState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    const trending = ['Seat Covers', 'Dash Cam', 'Floor Mats', 'Speaker', 'Amplifier', 'Subwoofer', 'Head Unit', 'Tyre Inflator'];
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Trending', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8, runSpacing: 8,
            children: trending.map((t) => GestureDetector(
              onTap: () {},
              child: Chip(
                label: Text(t, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                avatar: Icon(Icons.trending_up, size: 14, color: ext.primaryRed),
              ),
            )).toList(),
          ),
        ],
      ),
    );
  }
}
