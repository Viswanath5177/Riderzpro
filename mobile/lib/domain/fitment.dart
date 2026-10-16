enum FitmentResult { compatible, unknown, incompatible }

class Fitment {
  Fitment._();

  /// product.fits: null -> Unknown
  ///               'Universal' -> Compatible
  ///               contains normalised model token -> Compatible
  ///               otherwise -> Incompatible
  static FitmentResult check({
    required dynamic fits, // String | List<String> | null
    required String modelName,
  }) {
    if (fits == null) return FitmentResult.unknown;

    final token = _normalize(modelName);

    if (fits is List) {
      // EV parts use a list of bike ids
      final lst = fits.map((e) => _normalize(e.toString())).toList();
      if (lst.any((id) => id.contains(token) || token.contains(id))) {
        return FitmentResult.compatible;
      }
      return FitmentResult.incompatible;
    }

    final fitsStr = fits.toString().trim();
    if (fitsStr.isEmpty) return FitmentResult.unknown;
    if (fitsStr.toLowerCase() == 'universal') return FitmentResult.compatible;

    // Tokenise comma-separated list
    final tokens = fitsStr.split(RegExp(r'[,/]')).map((s) => _normalize(s)).toList();
    if (tokens.any((t) => t.isNotEmpty && (token.contains(t) || t.contains(token)))) {
      return FitmentResult.compatible;
    }
    return FitmentResult.incompatible;
  }

  static String _normalize(String s) =>
      s.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '').trim();

  static String label(FitmentResult r) => switch (r) {
    FitmentResult.compatible   => 'Compatible',
    FitmentResult.unknown      => 'Confirm fitment',
    FitmentResult.incompatible => 'Not compatible',
  };

  static String tooltip(FitmentResult r) => switch (r) {
    FitmentResult.compatible   => 'Fits your vehicle',
    FitmentResult.unknown      => 'Confirm fitment before ordering',
    FitmentResult.incompatible => 'May not fit your vehicle',
  };
}
