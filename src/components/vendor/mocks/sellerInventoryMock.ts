/**
 * Isolated Mock Data and Store for Seller Inventory
 * Loaded dynamically ONLY when USE_MOCK is active in development.
 * Tree-shaken completely in production builds.
 */

import type { SellerInventoryProduct } from "../sellerInventoryApi";

export const initialMockInventory: SellerInventoryProduct[] = [
  {
    id: "prod_noida_01",
    name: "Ather 450X Ceramic Brake Pad Set",
    category: "Brakes & Discs",
    sku: "ATH-BRK-450X",
    price: 1450,
    mrp: 1750,
    gstPercent: 18,
    stock: 8,
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&q=80",
    condition: "New",
    partType: "OEM",
    status: "live",
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "prod_noida_02",
    name: "Fast Charger Cable 15A (Type 2)",
    category: "Smart Chargers",
    sku: "CHG-CBL-15A",
    price: 2899,
    mrp: 3499,
    gstPercent: 18,
    stock: 4, // Low stock (<= 5)
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&q=80",
    condition: "New",
    partType: "OEM",
    status: "live",
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "prod_noida_03",
    name: "Ola S1 Pro Heavy Duty Belt Drive",
    category: "Drivetrain & Belts",
    sku: "OLA-BLT-S1P",
    price: 3200,
    mrp: 3800,
    gstPercent: 18,
    stock: 12,
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&q=80",
    condition: "New",
    partType: "OEM",
    status: "live",
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "prod_noida_04",
    name: "High-Visibility LED Handlebar Indicators",
    category: "Lighting & Electricals",
    sku: "LGT-IND-LED2",
    price: 950,
    mrp: 1200,
    gstPercent: 18,
    stock: 15,
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&q=80",
    condition: "New",
    partType: "Aftermarket",
    status: "live",
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "prod_noida_05",
    name: "Chetak Smart Key Fob Replacement",
    category: "Electronics",
    sku: "BAJ-FOB-CHT",
    price: 1850,
    mrp: 2200,
    gstPercent: 18,
    stock: 3, // Low stock
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&q=80",
    condition: "New",
    partType: "OEM",
    status: "live",
    updatedAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: "prod_noida_06",
    name: "TVS iQube Throttle Position Sensor (TPS)",
    category: "Sensors & Switches",
    sku: "TVS-TPS-IQB",
    price: 2100,
    mrp: 2600,
    gstPercent: 18,
    stock: 0, // Out of stock
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=300&q=80",
    condition: "New",
    partType: "OES",
    status: "out_of_stock",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "prod_noida_07",
    name: "Lithium Pack Thermal Insulation Wrap",
    category: "Battery & Thermal",
    sku: "BAT-THM-WRP",
    price: 799,
    mrp: 999,
    gstPercent: 18,
    stock: 24,
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&q=80",
    condition: "New",
    partType: "Aftermarket",
    status: "live",
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "prod_noida_08",
    name: "Ather 450X Idler Tension Pulley",
    category: "Drivetrain & Belts",
    sku: "ATH-PLY-TEN",
    price: 1100,
    mrp: 1400,
    gstPercent: 18,
    stock: 5, // Exactly 5 = Low stock
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&q=80",
    condition: "New",
    partType: "OEM",
    status: "live",
    updatedAt: new Date(Date.now() - 25000000).toISOString(),
  },
];

// In-memory mutable state for mock session
const mockInventoryState: SellerInventoryProduct[] = [...initialMockInventory];

// Listeners for mock state changes
type InventoryListener = () => void;
const inventoryListeners = new Set<InventoryListener>();

export function notifyInventoryListeners() {
  inventoryListeners.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error("Inventory listener error:", err);
    }
  });
}

export function subscribeInventoryUpdates(listener: InventoryListener) {
  inventoryListeners.add(listener);
  return () => {
    inventoryListeners.delete(listener);
  };
}

/**
 * Reduce mock stock by items in an accepted order
 */
export function reduceMockStockByOrderItems(items: Array<{ name: string; qty: number }>) {
  let changed = false;
  items.forEach((item) => {
    const idx = mockInventoryState.findIndex(
      (p) =>
        p.name.toLowerCase() === item.name.toLowerCase() ||
        item.name.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(item.name.toLowerCase()),
    );

    if (idx !== -1) {
      const current = mockInventoryState[idx];
      const newStock = Math.max(0, current.stock - item.qty);
      mockInventoryState[idx] = {
        ...current,
        stock: newStock,
        status: newStock === 0 ? "out_of_stock" : current.status,
        updatedAt: new Date().toISOString(),
      };
      changed = true;
    }
  });

  if (changed) {
    notifyInventoryListeners();
  }
}

export async function getMockInventory(): Promise<SellerInventoryProduct[]> {
  // Artificial 250ms network delay
  await new Promise((r) => setTimeout(r, 250));
  return [...mockInventoryState];
}
