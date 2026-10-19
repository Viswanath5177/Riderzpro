import 'package:flutter_test/flutter_test.dart';
import 'package:riderzpro/domain/fitment.dart';

void main() {
  group('Fitment Matcher Unit Tests', () {
    test('Universal fits any vehicle', () {
      final res = Fitment.check(fits: 'Universal', modelName: 'Royal Enfield Hunter 350');
      expect(res, FitmentResult.compatible);
    });

    test('Exact and partial token matches', () {
      final res1 = Fitment.check(
        fits: 'Hunter 350, Classic 350, Meteor 350',
        modelName: 'Hunter 350',
      );
      expect(res1, FitmentResult.compatible);

      final res2 = Fitment.check(
        fits: 'Activa 6G / Jupiter 125',
        modelName: 'Honda Activa 6G',
      );
      expect(res2, FitmentResult.compatible);
    });

    test('Incompatible fitment', () {
      final res = Fitment.check(
        fits: 'KTM Duke 390, RC 390',
        modelName: 'Royal Enfield Hunter 350',
      );
      expect(res, FitmentResult.incompatible);
    });

    test('Null or empty fits returns unknown (confirm fitment)', () {
      expect(Fitment.check(fits: null, modelName: 'Ather 450X'), FitmentResult.unknown);
      expect(Fitment.check(fits: '', modelName: 'Ather 450X'), FitmentResult.unknown);
      expect(Fitment.label(FitmentResult.unknown), 'Confirm fitment');
    });

    test('EV part list of bike IDs', () {
      final res = Fitment.check(
        fits: ['ather-450x', 'ola-s1-pro'],
        modelName: 'Ather 450X Gen 3',
      );
      expect(res, FitmentResult.compatible);

      final resIncomp = Fitment.check(
        fits: ['ather-450x'],
        modelName: 'TVS iQube',
      );
      expect(resIncomp, FitmentResult.incompatible);
    });
  });
}
