import { createServerFn } from "@tanstack/react-start";
import {
  createRiderDeliveryJobServer,
  getRiderEarningsServer,
  getRiderNotificationsServer,
  listAllRiderDeliveriesServer,
  listApprovedRidersForDispatchServer,
  listRiderDeliveriesServer,
  updateRiderDeliveryStatusServer,
  type RiderDeliveryStatus,
} from "./rider-operations.server";

const readMyDeliveries = createServerFn({ method: "GET" }).handler(() => listRiderDeliveriesServer());
const readAdminDeliveries = createServerFn({ method: "GET" }).handler(() => listAllRiderDeliveriesServer());
const readApprovedRiders = createServerFn({ method: "GET" }).handler(() => listApprovedRidersForDispatchServer());
const readMyEarnings = createServerFn({ method: "GET" }).handler(() => getRiderEarningsServer());
const readMyNotifications = createServerFn({ method: "GET" }).handler(() => getRiderNotificationsServer());

const createDelivery = createServerFn({ method: "POST" })
  .validator((data: {
    riderUserId: string; externalOrderId: string; pickupLabel: string; dropoffLabel: string;
    city: string; serviceState: string; earningPaise: number;
  }) => {
    if (!data || typeof data !== "object") throw new Error("Enter delivery details.");
    const textFields = [data.riderUserId, data.externalOrderId, data.pickupLabel, data.dropoffLabel, data.city, data.serviceState];
    if (textFields.some((value) => typeof value !== "string")) throw new Error("Enter valid delivery details.");
    if (typeof data.earningPaise !== "number") throw new Error("Enter the rider earnings amount in paise.");
    return data;
  })
  .handler(({ data }) => createRiderDeliveryJobServer(data));

const transitionDelivery = createServerFn({ method: "POST" })
  .validator((data: { deliveryId: string; status: RiderDeliveryStatus }) => {
    if (!data || typeof data.deliveryId !== "string" || !["accepted", "picked_up", "delivered", "cancelled"].includes(data.status)) {
      throw new Error("Choose a valid delivery update.");
    }
    return data;
  })
  .handler(({ data }) => updateRiderDeliveryStatusServer(data));

export const getRiderDeliveries = () => readMyDeliveries();
export const getAdminRiderDeliveries = () => readAdminDeliveries();
export const getApprovedRidersForDispatch = () => readApprovedRiders();
export const getRiderEarnings = () => readMyEarnings();
export const getRiderNotifications = () => readMyNotifications();
export const createRiderDelivery = (data: Parameters<typeof createDelivery>[0]["data"]) => createDelivery({ data });
export const updateRiderDelivery = (data: Parameters<typeof transitionDelivery>[0]["data"]) => transitionDelivery({ data });
