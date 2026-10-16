import React from "react";
import type { DeliveryTrackingData } from "../map/types";
import { DeliveryMap } from "../map/DeliveryMap";

export interface LiveMapProps {
  stops?: number;
  progress?: number;
  className?: string;
  deliveryId?: string | null;
  tracking?: DeliveryTrackingData | null;
  isApproaching?: boolean;
  isArrived?: boolean;
  isDeviating?: boolean;
  deviationDistance?: number | null;
  deviationThreshold?: number;
}

/**
 * LiveMap: Seamlessly delegates to DeliveryMap for real-time Leaflet + OpenStreetMap + OSRM tracking.
 * Eliminates all synthetic browser GPS movement and mock SVG grids.
 */
export function LiveMap({
  className = "",
  deliveryId,
  tracking,
  isApproaching,
  isArrived,
  isDeviating,
  deviationDistance,
  deviationThreshold,
}: LiveMapProps) {
  return (
    <DeliveryMap
      orderId={deliveryId}
      deliveryId={deliveryId}
      tracking={tracking}
      isApproaching={isApproaching}
      isArrived={isArrived}
      isDeviating={isDeviating}
      deviationDistance={deviationDistance}
      deviationThreshold={deviationThreshold}
      className={className}
    />
  );
}
