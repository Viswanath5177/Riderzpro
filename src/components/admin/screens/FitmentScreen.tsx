import React, { useState } from "react";
import {
  Wrench,
  Bike,
  Zap,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Search,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { useAdminStore } from "@/mocks/admin/adminStore";

export function FitmentScreen() {
  const { bikes, products, updateProduct } = useAdminStore();
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [searchProduct, setSearchProduct] = useState("");

  const brands = ["ALL", ...Array.from(new Set(bikes.map((b) => b.brand)))];

  const filteredBikes = bikes.filter((b) => (selectedBrand === "ALL" ? true : b.brand === selectedBrand));
  const filteredProducts = products.filter((p) =>
    searchProduct ? p.title.toLowerCase().includes(searchProduct.toLowerCase()) : true
  );

  const handleToggleFitment = (productId: string, bikeId: string, currentChecked: boolean) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    let nextBikes: string[];
    if (currentChecked) {
      nextBikes = product.compatibleBikes.filter((id) => id !== bikeId);
    } else {
      nextBikes = [...product.compatibleBikes, bikeId];
    }

    updateProduct(productId, { compatibleBikes: nextBikes });
    toast.info("Fitment Matrix Updated", {
      description: `${currentChecked ? "Removed" : "Linked"} compatibility for ${product.title.slice(0, 25)}...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Bikes & VIN Fitment Compatibility Matrix
        </h1>
        <p className="text-sm text-[#4B5563] font-medium mt-1">
          Precision matching matrix between verified EV models, voltages, connector types and catalog spare parts.
        </p>
      </div>

      {/* EV Bike Fleet Specs Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-[#111111] flex items-center gap-2">
            <Bike className="h-4 w-4 text-[#E31E24]" />
            <span>Supported Two-Wheeler Architectures ({filteredBikes.length})</span>
          </h2>

          {/* Brand Filter */}
          <div className="flex rounded-2xl border border-[#E5E7EB] bg-gray-50/80 p-1 text-xs">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`rounded-xl px-3 py-1 font-bold transition cursor-pointer ${
                  selectedBrand === brand ? "bg-[#E31E24] text-white shadow-xs" : "text-[#4B5563] hover:text-[#111111] hover:bg-gray-200/60"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBikes.map((bike) => (
            <div key={bike.id} className="rounded-3xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E31E24]">
                    {bike.brand}
                  </span>
                  <h4 className="font-bold text-[#111111] text-base mt-0.5">{bike.model}</h4>
                  <p className="text-xs text-[#4B5563] font-medium">{bike.yearRange}</p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50 text-[#E31E24] border border-red-200">
                  <Zap className="h-4.5 w-4.5" />
                </div>
              </div>

              <div className="pt-2 border-t border-[#F3F4F6] space-y-1.5 text-xs text-[#374151]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280] font-medium">System Voltage:</span>
                  <span className="font-bold text-[#111111] font-mono">{bike.voltage}V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280] font-medium">Battery Pack:</span>
                  <span className="font-bold text-[#111111]">{bike.batteryCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280] font-medium">Motor Power:</span>
                  <span className="font-bold text-[#111111]">{bike.powerKw} kW Peak</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280] font-medium">Connector Port:</span>
                  <span className="font-semibold text-[#111111] truncate max-w-[140px]" title={bike.connectorType}>
                    {bike.connectorType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Parts-vs-Bikes Matrix Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-[#111111] flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#E31E24]" />
              <span>Interactive Parts-vs-Bikes Compatibility Matrix</span>
            </h3>
            <p className="text-xs text-[#4B5563] font-medium">
              Click any cell to toggle instant VIN fitment guarantee for that bike model.
            </p>
          </div>

          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search part name..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="h-9 w-full rounded-2xl border border-[#E5E7EB] bg-white pl-9 pr-3 text-xs text-[#111111] font-medium placeholder:text-[#9CA3AF] shadow-2xs outline-none focus:border-[#E31E24]"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-gray-50/80 text-[#374151] uppercase font-bold">
                <th className="p-3.5 pl-5 min-w-[220px]">Product / Component</th>
                <th className="p-3.5">Category</th>
                {bikes.map((bike) => (
                  <th key={bike.id} className="p-3 text-center min-w-[110px]">
                    <div className="text-[10px] font-bold text-[#111111] truncate max-w-[100px]" title={bike.model}>
                      {bike.model.split(" ")[0]}
                    </div>
                    <span className="text-[9px] text-[#6B7280] font-mono font-bold">{bike.voltage}V</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-[#111111]">
              {filteredProducts.slice(0, 15).map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/80 transition">
                  <td className="p-3.5 pl-5">
                    <p className="font-bold text-[#111111] truncate max-w-xs">{prod.title}</p>
                    <p className="text-[10px] text-[#4B5563] font-mono mt-0.5">SKU: {prod.sku}</p>
                  </td>
                  <td className="p-3 text-[#4B5563] font-medium">{prod.category}</td>
                  {bikes.map((bike) => {
                    const isLinked = prod.compatibleBikes.includes(bike.id);
                    return (
                      <td key={bike.id} className="p-3 text-center">
                        <button
                          onClick={() => handleToggleFitment(prod.id, bike.id, isLinked)}
                          className={`h-7 w-7 rounded-xl flex items-center justify-center mx-auto transition cursor-pointer ${
                            isLinked
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-400 border border-gray-200 hover:bg-gray-200 hover:text-gray-600"
                          }`}
                          title={`${isLinked ? "Compatible" : "Incompatible"} with ${bike.model}`}
                        >
                          {isLinked ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-3.5 w-3.5" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
