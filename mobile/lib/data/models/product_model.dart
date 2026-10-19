class ProductModel {
  const ProductModel({
    required this.id,
    required this.name,
    required this.brand,
    required this.department,
    required this.category,
    required this.vehicleType,
    required this.pricePaise,
    this.mrpPaise,
    required this.priceType,
    required this.availability,
    this.stock,
    this.fits,
    this.options,
    this.installationPricePaise,
    this.installationTime,
    this.warranty,
    this.delivery,
    this.rating,
    this.reviewCount = 0,
    this.bestseller = false,
    this.description,
    this.features = const [],
    this.imageStatus,
    this.localImageAsset,
    this.remoteImageUrl,
    this.specifications = const [],
    required this.sellerId,
    required this.catalogType,
  });

  final String id;
  final String name;
  final String? brand;
  final String? department;
  final String? category;
  final String? vehicleType;
  final int pricePaise;
  final int? mrpPaise;
  final String priceType;
  final String availability;
  final int? stock;
  final dynamic fits;
  final dynamic options;
  final int? installationPricePaise;
  final String? installationTime;
  final String? warranty;
  final String? delivery;
  final double? rating;
  final int reviewCount;
  final bool bestseller;
  final String? description;
  final List<dynamic> features;
  final String? imageStatus;
  final String? localImageAsset;
  final String? remoteImageUrl;
  final List<dynamic> specifications;
  final String sellerId;
  final String catalogType;

  bool get hasLocalImage => localImageAsset != null && localImageAsset!.isNotEmpty;
  bool get hasRemoteImage => remoteImageUrl != null && remoteImageUrl!.isNotEmpty;
  bool get hasInstallation => installationPricePaise != null;
  bool get isMadeToOrder => availability == 'Made to order';
  bool get isInStock => availability == 'In stock' || availability == 'Made to order';
  bool get isStartingFrom => priceType == 'Starting from';
  bool get isOnRequest => priceType == 'On request' || priceType == 'To be confirmed';
  int get discountPaise => mrpPaise != null ? (mrpPaise! - pricePaise).clamp(0, mrpPaise!) : 0;
  int get discountPercent => mrpPaise != null && mrpPaise! > 0 ? ((discountPaise / mrpPaise!) * 100).round() : 0;

  factory ProductModel.fromJson(Map<String, dynamic> json) => ProductModel(
    id: json['id'] as String,
    name: json['name'] as String? ?? '',
    brand: json['brand'] as String?,
    department: json['department'] as String?,
    category: json['category'] as String?,
    vehicleType: json['vehicleType'] as String?,
    pricePaise: (json['pricePaise'] as num?)?.toInt() ?? 0,
    mrpPaise: (json['mrpPaise'] as num?)?.toInt(),
    priceType: json['priceType'] as String? ?? 'Fixed',
    availability: json['availability'] as String? ?? 'In stock',
    stock: (json['stock'] as num?)?.toInt(),
    fits: json['fits'],
    options: json['options'],
    installationPricePaise: (json['installationPricePaise'] as num?)?.toInt(),
    installationTime: json['installationTime'] as String?,
    warranty: json['warranty'] as String?,
    delivery: json['delivery'] as String?,
    rating: (json['rating'] as num?)?.toDouble(),
    reviewCount: (json['reviewCount'] as num?)?.toInt() ?? 0,
    bestseller: json['bestseller'] as bool? ?? false,
    description: json['description'] as String?,
    features: json['features'] as List<dynamic>? ?? const [],
    imageStatus: json['imageStatus'] as String?,
    localImageAsset: json['localImageAsset'] as String?,
    remoteImageUrl: json['remoteImageUrl'] as String?,
    specifications: json['specifications'] as List<dynamic>? ?? const [],
    sellerId: json['sellerId'] as String? ?? 'v1',
    catalogType: json['catalogType'] as String? ?? 'accessory',
  );
}
