import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../shared/widgets/pill_button.dart';
import '../providers/garage_provider.dart';

class GarageScreen extends ConsumerStatefulWidget {
  const GarageScreen({super.key});
  @override
  ConsumerState<GarageScreen> createState() => _GarageScreenState();
}

class _GarageScreenState extends ConsumerState<GarageScreen> {
  final _carMakes = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'MG'];
  final _carModels = {
    'Maruti Suzuki': ['Swift', 'Baleno', 'Ertiga', 'Brezza', 'XL6'],
    'Hyundai': ['Creta', 'i20', 'Venue', 'Alcazar', 'Tucson'],
    'Tata': ['Nexon', 'Harrier', 'Safari', 'Tiago', 'Punch'],
    'Mahindra': ['XUV700', 'Scorpio N', 'Thar', 'XUV300', 'Bolero'],
    'Honda': ['Amaze', 'City', 'WR-V', 'Jazz'],
    'Toyota': ['Fortuner', 'Innova Crysta', 'Glanza', 'Hyryder'],
    'Kia': ['Seltos', 'Carens', 'Sonet', 'EV6'],
    'MG': ['Hector', 'ZS EV', 'Gloster'],
  };

  String? _make;
  String? _model;
  int? _year;
  String _type = 'car';

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final vehicles = ref.watch(garageProvider);
    final notifier = ref.read(garageProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('My Garage'), centerTitle: false),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (vehicles.isNotEmpty) ...[
              Text('My Vehicles', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),
              ...vehicles.map((v) {
                final isActive = notifier.activeId == v.id;
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardTheme.color,
                    borderRadius: BorderRadius.circular(16),
                    border: isActive ? Border.all(color: ext.primaryRed, width: 1.5) : null,
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8)],
                  ),
                  child: Row(
                    children: [
                      Icon(v.type == 'car' ? Icons.directions_car : Icons.electric_scooter,
                          color: isActive ? ext.primaryRed : Colors.grey, size: 28),
                      const SizedBox(width: 14),
                      Expanded(child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(v.displayName, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14,
                              color: isActive ? ext.primaryRed : null)),
                          if (isActive) Text('Active', style: TextStyle(fontSize: 11, color: ext.success)),
                        ],
                      )),
                      if (!isActive)
                        TextButton(onPressed: () => notifier.setActive(v.id),
                            child: Text('Set active', style: TextStyle(fontSize: 12, color: ext.primaryRed))),
                      IconButton(onPressed: () => notifier.removeVehicle(v.id),
                          icon: const Icon(Icons.delete_outline, size: 20, color: Colors.grey)),
                    ],
                  ),
                );
              }),
              const SizedBox(height: 20),
            ],
            Text('Add a Vehicle', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 16),
            // Car / Bike toggle
            SegmentedButton<String>(
              segments: const [ButtonSegment(value: 'car', label: Text('Car'), icon: Icon(Icons.directions_car)),
                               ButtonSegment(value: 'bike', label: Text('Bike / EV'), icon: Icon(Icons.electric_scooter))],
              selected: {_type},
              onSelectionChanged: (s) => setState(() { _type = s.first; _make = null; _model = null; }),
              style: ButtonStyle(iconColor: MaterialStateProperty.all(ext.primaryRed)),
            ),
            const SizedBox(height: 16),
            if (_type == 'car') ...[
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: 'Make'),
                value: _make,
                items: _carMakes.map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                onChanged: (v) => setState(() { _make = v; _model = null; }),
              ),
              const SizedBox(height: 12),
              if (_make != null)
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(labelText: 'Model'),
                  value: _model,
                  items: (_carModels[_make] ?? []).map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                  onChanged: (v) => setState(() => _model = v),
                ),
            ] else ...[
              const TextField(decoration: InputDecoration(labelText: 'Bike / EV model (e.g. Ather 450X)')),
            ],
            const SizedBox(height: 12),
            DropdownButtonFormField<int>(
              decoration: const InputDecoration(labelText: 'Year'),
              value: _year,
              items: List.generate(12, (i) => 2024 - i).map((y) => DropdownMenuItem(value: y, child: Text('$y'))).toList(),
              onChanged: (v) => setState(() => _year = v),
            ),
            const SizedBox(height: 24),
            PillButton(
              label: 'Add to Garage',
              onPressed: (_model != null || _type == 'bike') && _year != null
                  ? () async {
                      final v = GarageVehicle(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        type: _type, make: _make ?? 'Unknown', model: _model ?? 'My Bike', year: _year,
                      );
                      await notifier.addVehicle(v);
                      setState(() { _make = null; _model = null; _year = null; });
                    }
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}
