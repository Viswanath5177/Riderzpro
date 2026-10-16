enum PincodeResult { valid, invalid, outOfArea }

class Pincode {
  Pincode._();

  static const _pattern = r'^\d{6}$';
  static const _delhiMin = 110001;
  static const _delhiMax = 110099;

  static PincodeResult validate(String pincode) {
    if (!RegExp(_pattern).hasMatch(pincode)) return PincodeResult.invalid;
    final n = int.tryParse(pincode);
    if (n == null) return PincodeResult.invalid;
    if (n < _delhiMin || n > _delhiMax) return PincodeResult.outOfArea;
    return PincodeResult.valid;
  }

  static String message(PincodeResult r) => switch (r) {
    PincodeResult.invalid   => 'Enter a valid 6-digit pincode.',
    PincodeResult.outOfArea => 'Currently not available to this address. We deliver only within Delhi (pincodes 110001-110099). Please enter a Delhi address.',
    PincodeResult.valid     => 'Serviceable via Delhivery & Bluedart',
  };
}
