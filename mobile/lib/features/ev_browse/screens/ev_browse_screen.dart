import 'package:flutter/material.dart';

import '../../../app/theme/app_theme_extension.dart';
import '../../../core/money.dart';
import '../../../data/local/catalog_loader.dart';
import '../../../data/models/ev_model.dart';

class EvBrowseScreen extends StatelessWidget {
  const EvBrowseScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final evs = CatalogLoader.catalog.evTwoWheelers;

    return Scaffold(
      appBar: AppBar(title: const Text('Explore EVs')),
      body: GridView.builder(
        padding: const EdgeInsets.all(12),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2, childAspectRatio: 0.8, crossAxisSpacing: 10, mainAxisSpacing: 10,
        ),
        itemCount: evs.length,
        itemBuilder: (_, i) {
          final ev = evs[i];
          return _EvCard(ev: ev, ext: ext);
        },
      ),
    );
  }
}

class _EvCard extends StatelessWidget {
  const _EvCard({required this.ev, required this.ext});
  final EvModel ev;
  final AppThemeExtension ext;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(ext.cardRadius),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.07), blurRadius: 10)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: AspectRatio(
              aspectRatio: 16/10,
              child: ev.imageUrl != null
                  ? Image.network(ev.imageUrl!, fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(color: ext.fieldFill))
                  : Container(color: ext.fieldFill),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(ev.brand, style: TextStyle(fontSize: 10, color: ext.primaryRed, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                Text(ev.model, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                if (ev.pricePaise != null) ...[
                  const SizedBox(height: 4),
                  Text('From \${Money.format(ev.pricePaise!)}',
                      style: TextStyle(fontSize: 13, color: ext.primaryRed, fontWeight: FontWeight.w700)),
                  Text('ex-showroom', style: TextStyle(fontSize: 9, color: Theme.of(context).colorScheme.onSurfaceVariant)),
                ],
                if (ev.claimedRangeKm != null) ...[
                  const SizedBox(height: 4),
                  Row(children: [
                    Icon(Icons.bolt, size: 12, color: ext.warning),
                    const SizedBox(width: 3),
                    Text('\${ev.claimedRangeKm!.toInt()} km range', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w500)),
                  ]),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
