class EvModel {
  const EvModel({
    required this.id,
    required this.brand,
    required this.model,
    this.variant,
    this.vehicleType,
    this.pricePaise,
    this.priceType,
    this.topSpeedKmh,
    this.claimedRangeKm,
    this.chargingTimeText,
    this.batteryCapacityKwh,
    this.imageUrl,
    this.availability,
  });

  final String id;
  final String brand;
  final String model;
  final String? variant;
  final String? vehicleType;
  final int? pricePaise;
  final String? priceType;
  final double? topSpeedKmh;
  final double? claimedRangeKm;
  final String? chargingTimeText;
  final double? batteryCapacityKwh;
  final String? imageUrl;
  final String? availability;

  String get displayName => variant != null ? '\$brand \$model \$variant' : '\$brand \$model';

  factory EvModel.fromJson(Map<String, dynamic> json) => EvModel(
    id: json['id'] as String,
    brand: json['brand'] as String? ?? '',
    model: json['model'] as String? ?? '',
    variant: json['variant'] as String?,
    vehicleType: json['vehicleType'] as String?,
    pricePaise: (json['pricePaise'] as num?)?.toInt(),
    priceType: json['priceType'] as String?,
    topSpeedKmh: (json['topSpeedKmh'] as num?)?.toDouble(),
    claimedRangeKm: (json['claimedRangeKm'] as num?)?.toDouble(),
    chargingTimeText: json['chargingTimeText'] as String?,
    batteryCapacityKwh: (json['batteryCapacityKwh'] as num?)?.toDouble(),
    imageUrl: json['imageUrl'] as String?,
    availability: json['availability'] as String?,
  );
}
