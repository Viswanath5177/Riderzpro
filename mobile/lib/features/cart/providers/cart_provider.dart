import 'package:flutter_riverpod/flutter_riverpod.dart';

class CartItem {
  const CartItem({
    required this.productId,
    required this.name,
    this.imageAsset,
    this.remoteImageUrl,
    required this.unitPricePaise,
    required this.qty,
    required this.sellerId,
    this.withInstallation = false,
    this.installationPricePaise,
  });

  final String productId;
  final String name;
  final String? imageAsset;
  final String? remoteImageUrl;
  final int unitPricePaise;
  final int qty;
  final String sellerId;
  final bool withInstallation;
  final int? installationPricePaise;

  int get lineTotalPaise => (unitPricePaise + (withInstallation ? (installationPricePaise ?? 0) : 0)) * qty;

  CartItem copyWith({int? qty, bool? withInstallation}) => CartItem(
    productId: productId, name: name, imageAsset: imageAsset,
    remoteImageUrl: remoteImageUrl, unitPricePaise: unitPricePaise,
    qty: qty ?? this.qty, sellerId: sellerId,
    withInstallation: withInstallation ?? this.withInstallation,
    installationPricePaise: installationPricePaise,
  );
}

class CartNotifier extends StateNotifier<List<CartItem>> {
  CartNotifier() : super(const []);

  void addItem(CartItem item) {
    final idx = state.indexWhere((i) => i.productId == item.productId);
    if (idx >= 0) {
      final updated = [...state];
      updated[idx] = updated[idx].copyWith(qty: updated[idx].qty + 1);
      state = updated;
    } else {
      state = [...state, item];
    }
  }

  void incrementQty(String productId) {
    state = state.map((i) => i.productId == productId ? i.copyWith(qty: i.qty + 1) : i).toList();
  }

  void decrementQty(String productId) {
    final idx = state.indexWhere((i) => i.productId == productId);
    if (idx < 0) return;
    if (state[idx].qty <= 1) {
      removeItem(productId);
    } else {
      state = state.map((i) => i.productId == productId ? i.copyWith(qty: i.qty - 1) : i).toList();
    }
  }

  void removeItem(String productId) => state = state.where((i) => i.productId != productId).toList();

  void toggleInstallation(String productId) {
    state = state.map((i) => i.productId == productId ? i.copyWith(withInstallation: !i.withInstallation) : i).toList();
  }

  void clear() => state = const [];

  int qtyFor(String productId) => state.firstWhere((i) => i.productId == productId, orElse: () => CartItem(
    productId: '', name: '', unitPricePaise: 0, qty: 0, sellerId: '',
  )).qty;
}

final cartProvider = StateNotifierProvider<CartNotifier, List<CartItem>>((_) => CartNotifier());
