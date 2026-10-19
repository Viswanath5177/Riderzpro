import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../app/theme/brand_colors.dart';
import '../../../core/money.dart';
import '../../../data/local/catalog_loader.dart';
import '../../../data/models/product_model.dart';
import '../../../domain/fitment.dart';
import '../../../shared/widgets/product_card.dart';
import '../../../shared/widgets/skeleton_loader.dart';
import '../../cart/providers/cart_provider.dart';
import '../../garage/providers/garage_provider.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});
  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final _scrollCtrl = ScrollController();
  final _searchHints = ['Search speakers...', 'Search seat covers...', 'Search floor mats...', 'Search dash cams...', 'Search tyre inflators...'];
  int _hintIdx = 0;
  late final List<ProductModel> _bestsellers;
  late final List<ProductModel> _fastDelivery;
  bool _ready = false;

  @override
  void initState() {
    super.initState();
    _initData();
    _cycleHints();
  }

  void _initData() {
    final all = CatalogLoader.catalog.allProducts;
    _bestsellers = all.where((p) => p.bestseller).take(10).toList();
    _fastDelivery = all.where((p) => p.isInStock && !p.isMadeToOrder).take(10).toList();
    setState(() => _ready = true);
  }

  void _cycleHints() {
    Future.delayed(2.5.seconds, () {
      if (!mounted) return;
      setState(() => _hintIdx = (_hintIdx + 1) % _searchHints.length);
      _cycleHints();
    });
  }

  @override
  void dispose() { _scrollCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final cart = ref.watch(cartProvider);
    final garage = ref.watch(garageProvider);
    final activeVehicle = ref.read(garageProvider.notifier).activeVehicle;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: CustomScrollView(
        controller: _scrollCtrl,
        slivers: [
          // Header
          SliverToBoxAdapter(
            child: _HomeHeader(
              searchHint: _searchHints[_hintIdx],
              onSearchTap: () => context.go('/search'),
              activeVehicle: activeVehicle,
              onVehicleTap: () => context.go('/garage'),
            ),
          ),
          // Banner carousel
          SliverToBoxAdapter(child: _BannerCarousel()),
          // Category grid
          SliverToBoxAdapter(
            child: _SectionHeader(title: 'Shop by Category', onViewAll: () => context.go('/search')),
          ),
          SliverToBoxAdapter(child: _CategoryGrid()),
          // Bestsellers rail
          if (_ready && _bestsellers.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: _SectionHeader(title: 'Best Sellers 🔥', onViewAll: () => context.go('/search')),
            ),
            SliverToBoxAdapter(
              child: _ProductRail(
                products: _bestsellers,
                cartNotifier: ref.read(cartProvider.notifier),
                getQty: (id) => ref.read(cartProvider.notifier).qtyFor(id),
                activeVehicleModel: activeVehicle?.model,
              ),
            ),
          ],
          // Fast delivery rail
          if (_ready && _fastDelivery.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: _SectionHeader(title: 'Fast Delivery ⚡', onViewAll: () => context.go('/search')),
            ),
            SliverToBoxAdapter(
              child: _ProductRail(
                products: _fastDelivery,
                cartNotifier: ref.read(cartProvider.notifier),
                getQty: (id) => ref.read(cartProvider.notifier).qtyFor(id),
                activeVehicleModel: activeVehicle?.model,
              ),
            ),
          ],
          // EV browse rail
          SliverToBoxAdapter(
            child: _SectionHeader(title: 'Explore EVs 🛵', onViewAll: () => context.go('/ev-browse')),
          ),
          SliverToBoxAdapter(child: _EvRail()),
          // Installation banner
          SliverToBoxAdapter(child: _InstallationBanner()),
          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
      ),
    );
  }
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader({required this.searchHint, required this.onSearchTap, this.activeVehicle, this.onVehicleTap});
  final String searchHint;
  final VoidCallback onSearchTap;
  final dynamic activeVehicle;
  final VoidCallback? onVehicleTap;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final top = MediaQuery.of(context).padding.top;
    return Container(
      padding: EdgeInsets.fromLTRB(16, top + 16, 16, 16),
      decoration: BoxDecoration(gradient: ext.heroGradient),
      child: Column(
        children: [
          Row(
            children: [
              ColorFiltered(
                colorFilter: const ColorFilter.mode(Colors.white, BlendMode.srcIn),
                child: Image.asset('assets/brand/logo.png', height: 28,
                    errorBuilder: (_, __, ___) => const Text('RIDERZPRO',
                        style: TextStyle(fontFamily: 'BarlowCondensed', fontSize: 22, color: Colors.white, fontWeight: FontWeight.w700))),
              ),
              const Spacer(),
              // Location chip
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(100)),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.location_on, size: 13, color: Colors.white),
                    const SizedBox(width: 3),
                    const Text('Delhi', style: TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.w600)),
                    const SizedBox(width: 3),
                    // ETA chip
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(100)),
                      child: Text('~30 min', style: TextStyle(fontSize: 10, color: ext.primaryRed, fontWeight: FontWeight.w700)),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.notifications_outlined, color: Colors.white),
                onPressed: () {},
              ),
            ],
          ),
          const SizedBox(height: 14),
          // Search bar
          GestureDetector(
            onTap: onSearchTap,
            child: Container(
              height: 48,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
              child: Row(
                children: [
                  Icon(Icons.search, color: ext.primaryRed, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: AnimatedSwitcher(
                      duration: 350.ms,
                      transitionBuilder: (child, anim) => FadeTransition(opacity: anim, child: SlideTransition(
                        position: Tween<Offset>(begin: const Offset(0, 0.2), end: Offset.zero).animate(anim), child: child)),
                      child: Text(searchHint, key: ValueKey(searchHint),
                          style: TextStyle(color: const Color(0xFFAAAAAA), fontSize: 14)),
                    ),
                  ),
                  if (activeVehicle != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(color: ext.primaryRed.withOpacity(0.1), borderRadius: BorderRadius.circular(100)),
                      child: Text(activeVehicle.model ?? '', style: TextStyle(fontSize: 11, color: ext.primaryRed, fontWeight: FontWeight.w600)),
                    ),
                ],
              ),
            ),
          ),
          if (activeVehicle != null) ...[
            const SizedBox(height: 10),
            GestureDetector(
              onTap: onVehicleTap,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white.withOpacity(0.2)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.directions_car_outlined, color: Colors.white70, size: 16),
                    const SizedBox(width: 8),
                    Text('Shopping for: ', style: TextStyle(fontSize: 12, color: Colors.white70)),
                    Text(activeVehicle.displayName, style: const TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.w700)),
                    const Spacer(),
                    const Icon(Icons.edit_outlined, color: Colors.white60, size: 14),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _BannerCarousel extends StatefulWidget {
  @override
  State<_BannerCarousel> createState() => _BannerCarouselState();
}

class _BannerCarouselState extends State<_BannerCarousel> {
  int _page = 0;
  final _ctrl = PageController(viewportFraction: 0.92);

  static const _banners = [
    ('assets/photos/hero-bike.jpg', 'Up to 40% off
EV Accessories', 'Shop Now'),
    ('assets/photos/hero-scooter.jpg', 'Fast Delhi Delivery
In 30–90 min', 'Explore'),
    ('assets/photos/workshop.jpg', 'Expert Installation
At Your Doorstep', 'Book Now'),
  ];

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return Column(
      children: [
        const SizedBox(height: 16),
        SizedBox(
          height: 160,
          child: PageView.builder(
            controller: _ctrl,
            onPageChanged: (i) => setState(() => _page = i),
            itemCount: _banners.length,
            itemBuilder: (_, i) {
              final (img, title, cta) = _banners[i];
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(borderRadius: BorderRadius.circular(16)),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.asset(img, fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(color: ext.graphite)),
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.black.withOpacity(0.6), Colors.transparent],
                            begin: Alignment.centerLeft, end: Alignment.centerRight,
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(title, style: const TextStyle(
                              fontFamily: 'BarlowCondensed', fontSize: 24, fontWeight: FontWeight.w700,
                              color: Colors.white, height: 1.2,
                            )),
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(
                                gradient: ext.pillGradient,
                                borderRadius: BorderRadius.circular(100),
                              ),
                              child: Text(cta, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_banners.length, (i) => AnimatedContainer(
            duration: 250.ms,
            margin: const EdgeInsets.symmetric(horizontal: 3),
            width: _page == i ? 16 : 6,
            height: 6,
            decoration: BoxDecoration(
              color: _page == i ? ext.primaryRed : ext.primaryRed.withOpacity(0.25),
              borderRadius: BorderRadius.circular(100),
            ),
          )),
        ),
      ],
    );
  }
}

class _CategoryGrid extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final depts = CatalogLoader.catalog.departments.take(8).toList();

    final icons = [
      Icons.speaker, Icons.weekend, Icons.layers, Icons.surround_sound,
      Icons.amp_stories, Icons.equalizer, Icons.bathroom, Icons.tv,
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4, childAspectRatio: 0.85,
          crossAxisSpacing: 10, mainAxisSpacing: 10,
        ),
        itemCount: depts.length,
        itemBuilder: (_, i) {
          final dept = depts[i];
          return GestureDetector(
            onTap: () => context.go('/search'),
            child: Column(
              children: [
                Container(
                  width: 60, height: 60,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [ext.primaryRed.withOpacity(0.12), ext.deepRed.withOpacity(0.06)],
                    ),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(icons[i % icons.length], color: ext.primaryRed, size: 26),
                ).animate(delay: (i * 40).ms).fadeIn(duration: 300.ms).scale(begin: const Offset(0.8, 0.8)),
                const SizedBox(height: 6),
                Text(
                  dept['name'] as String,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title, this.onViewAll});
  final String title;
  final VoidCallback? onViewAll;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
    child: Row(
      children: [
        Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
        const Spacer(),
        if (onViewAll != null)
          TextButton(
            onPressed: onViewAll,
            style: TextButton.styleFrom(
              padding: EdgeInsets.zero, minimumSize: const Size(0, 0),
              foregroundColor: AppThemeExtension.of(context).primaryRed,
            ),
            child: const Text('View all →', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
          ),
      ],
    ),
  );
}

class _ProductRail extends ConsumerWidget {
  const _ProductRail({required this.products, required this.cartNotifier, required this.getQty, this.activeVehicleModel});
  final List<ProductModel> products;
  final CartNotifier cartNotifier;
  final int Function(String) getQty;
  final String? activeVehicleModel;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SizedBox(
      height: 240,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: products.length,
        itemBuilder: (_, i) {
          final p = products[i];
          final qty = ref.watch(cartProvider).firstWhere((item) => item.productId == p.id,
              orElse: () => CartItem(productId: '', name: '', unitPricePaise: 0, qty: 0, sellerId: '')).qty;
          return SizedBox(
            width: 160,
            child: Padding(
              padding: const EdgeInsets.only(right: 12),
              child: ProductCard(
                product: p,
                qty: qty,
                activeVehicleModel: activeVehicleModel,
                onTap: () => context.go('/product/\${p.id}'),
                onAdd: () => cartNotifier.addItem(CartItem(
                  productId: p.id, name: p.name, localImageAsset: p.localImageAsset, // field name fix
                  remoteImageUrl: p.remoteImageUrl, unitPricePaise: p.pricePaise,
                  qty: 1, sellerId: p.sellerId,
                  installationPricePaise: p.installationPricePaise,
                  imageAsset: p.localImageAsset,
                )),
                onDecrement: () => cartNotifier.decrementQty(p.id),
                onIncrement: () => cartNotifier.incrementQty(p.id),
                delay: (i * 40).ms,
              ),
            ),
          );
        },
      ),
    );
  }
}

class _EvRail extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final evs = CatalogLoader.catalog.evTwoWheelers.take(8).toList();
    return SizedBox(
      height: 170,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: evs.length,
        itemBuilder: (_, i) {
          final ev = evs[i];
          return GestureDetector(
            onTap: () => context.go('/ev-browse'),
            child: Container(
              width: 150,
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                color: Theme.of(context).cardTheme.color,
                borderRadius: BorderRadius.circular(ext.cardRadius),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.07), blurRadius: 10)],
              ),
              child: Column(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                    child: SizedBox(
                      height: 90,
                      child: ev.imageUrl != null
                          ? Image.network(ev.imageUrl!, fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(color: ext.graphite.withOpacity(0.1)))
                          : Container(color: ext.graphite.withOpacity(0.1)),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(ev.displayName, maxLines: 1, overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 4),
                        if (ev.pricePaise != null)
                          Text('From \${Money.format(ev.pricePaise!)}',
                              style: TextStyle(fontSize: 11, color: ext.primaryRed, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 4),
                        Text('ex-showroom', style: TextStyle(fontSize: 9, color: Theme.of(context).colorScheme.onSurfaceVariant)),
                      ],
                    ),
                  ),
                ],
              ),
            ).animate(delay: (i * 40).ms).fadeIn(duration: 300.ms),
          );
        },
      ),
    );
  }
}

class _InstallationBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          children: [
            SizedBox(
              height: 130,
              width: double.infinity,
              child: Image.asset('assets/photos/workshop.jpg', fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(color: ext.graphite)),
            ),
            Container(
              height: 130,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [ext.graphite.withOpacity(0.85), Colors.transparent],
                ),
              ),
            ),
            Positioned.fill(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Certified Installation', style: TextStyle(
                      fontFamily: 'BarlowCondensed', fontSize: 22, fontWeight: FontWeight.w700, color: Colors.white,
                    )),
                    const SizedBox(height: 4),
                    const Text('Expert fitment at your doorstep', style: TextStyle(fontSize: 12, color: Colors.white70)),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(100),
                      ),
                      child: Text('Book Now', style: TextStyle(fontSize: 12, color: ext.primaryRed, fontWeight: FontWeight.w700)),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
