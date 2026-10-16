import 'package:flutter_test/flutter_test.dart';
import 'package:riderzpro/core/pincode.dart';

void main() {
  group('Pincode Unit Tests', () {
    test('Valid Delhi pincodes in range 110001-110099', () {
      expect(Pincode.validate('110001'), PincodeResult.valid);
      expect(Pincode.validate('110055'), PincodeResult.valid);
      expect(Pincode.validate('110099'), PincodeResult.valid);
      expect(
        Pincode.message(Pincode.validate('110001')),
        'Serviceable via Delhivery & Bluedart',
      );
    });

    test('Out of area pincodes', () {
      expect(Pincode.validate('110100'), PincodeResult.outOfArea);
      expect(Pincode.validate('122001'), PincodeResult.outOfArea); // Gurgaon
      expect(Pincode.validate('201301'), PincodeResult.outOfArea); // Noida
      expect(Pincode.validate('400001'), PincodeResult.outOfArea); // Mumbai

      expect(
        Pincode.message(Pincode.validate('122001')),
        'Currently not available to this address. We deliver only within Delhi (pincodes 110001-110099). Please enter a Delhi address.',
      );
    });

    test('Invalid format pincodes', () {
      expect(Pincode.validate(''), PincodeResult.invalid);
      expect(Pincode.validate('11000'), PincodeResult.invalid);
      expect(Pincode.validate('1100001'), PincodeResult.invalid);
      expect(Pincode.validate('11000A'), PincodeResult.invalid);
      expect(Pincode.validate('abcdef'), PincodeResult.invalid);

      expect(
        Pincode.message(Pincode.validate('12345')),
        'Enter a valid 6-digit pincode.',
      );
    });
  });
}
