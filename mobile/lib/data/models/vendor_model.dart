class VendorModel {
  const VendorModel({
    required this.id,
    required this.name,
    required this.area,
    required this.lat,
    required this.lng,
    required this.rating,
    required this.prepMins,
    this.isVerified = false,
  });

  final String id;
  final String name;
  final String area;
  final double lat;
  final double lng;
  final double rating;
  final int prepMins;
  final bool isVerified;

  factory VendorModel.fromJson(Map<String, dynamic> json) => VendorModel(
    id: json['id'] as String,
    name: json['name'] as String,
    area: json['area'] as String,
    lat: (json['lat'] as num).toDouble(),
    lng: (json['lng'] as num).toDouble(),
    rating: (json['rating'] as num).toDouble(),
    prepMins: (json['prepMins'] as num).toInt(),
    isVerified: json['isVerified'] as bool? ?? false,
  );
}
