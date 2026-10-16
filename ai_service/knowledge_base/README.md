# 📚 Riderzpro Knowledge Base Directory

Place additional catalog files, vehicle specifications, parts listings, or support documentation here.

### Supported File Formats:
1. **JSON Catalogs** (`*.json`):
   - Vehicle listings with `products` or `vehicles` array.
   - Keys supported: `brand`/`make`, `model`, `variant`, `price_inr`, `claimed_range_km`, `top_speed_kmh`, `battery_capacity_kwh`, `nominal_voltage`, etc.
2. **CSV Catalogs** (`*.csv`):
   - Tabular vehicle or parts catalogs.
3. **Markdown Knowledge Guides** (`*.md`):
   - Technical support guides, troubleshooting articles, or warranty policies.

The `CatalogDatabase` automatically indexes and hot-reloads all files in this directory and `scratch/`.
