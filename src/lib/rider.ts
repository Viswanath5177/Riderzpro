import { createServerFn } from "@tanstack/react-start";
import {
  getRiderApplicationServer,
  listRiderApplicationsForAdminServer,
  reviewRiderApplicationServer,
  submitRiderApplicationServer,
  type RiderVehicleType,
} from "./rider.server";
import { normalizeIndiaPhone, RIDER_LAUNCH_STATES } from "./rider.validation";

const readApplication = createServerFn({ method: "GET" })
  .handler(() => getRiderApplicationServer());

const submitApplication = createServerFn({ method: "POST" })
  .validator((data: {
    legalName: string;
    phone: string;
    city: string;
    serviceState: string;
    vehicleType: RiderVehicleType;
    vehicleRegistration: string;
    accuracyConfirmed: boolean;
    eligibilityConfirmed: boolean;
    privacyNoticeAcknowledged: boolean;
  }) => {
    const legalName = data.legalName.trim().replace(/\s+/g, " ");
    const phone = normalizeIndiaPhone(data.phone);
    const city = data.city.trim().replace(/\s+/g, " ");
    const serviceState = data.serviceState.trim().replace(/\s+/g, " ");
    const vehicleRegistration = data.vehicleType === "bicycle" ? "Not applicable - bicycle" : data.vehicleRegistration.trim().toUpperCase();
    if (legalName.length < 2 || legalName.length > 120) throw new Error("Enter your full legal name.");
    if (city.length < 2 || city.length > 100) throw new Error("Enter your city or service area.");
    if (!(RIDER_LAUNCH_STATES as readonly string[]).includes(serviceState)) {
      throw new Error("Rider applications are currently open only in Andhra Pradesh and Telangana.");
    }
    if (!["motorcycle", "scooter", "bicycle"].includes(data.vehicleType)) throw new Error("Choose a delivery vehicle.");
    if (data.vehicleType !== "bicycle" && (vehicleRegistration.length < 4 || vehicleRegistration.length > 24)) {
      throw new Error("Enter a valid vehicle registration number.");
    }
    if (data.accuracyConfirmed !== true || data.eligibilityConfirmed !== true || data.privacyNoticeAcknowledged !== true) {
      throw new Error("Confirm the details and eligibility and acknowledge the privacy notice before submitting.");
    }
    return {
      legalName, phone, city, serviceState, vehicleType: data.vehicleType, vehicleRegistration,
      accuracyConfirmed: data.accuracyConfirmed,
      eligibilityConfirmed: data.eligibilityConfirmed,
      privacyNoticeAcknowledged: data.privacyNoticeAcknowledged,
    };
  })
  .handler(({ data }) => submitRiderApplicationServer(data));

const readAdminApplications = createServerFn({ method: "GET" })
  .handler(() => listRiderApplicationsForAdminServer());

const reviewApplication = createServerFn({ method: "POST" })
  .validator((data: {
    applicationId: string;
    status: "approved" | "needs_correction" | "rejected";
    note: string;
    verificationConfirmed: boolean;
  }) => {
    if (typeof data.applicationId !== "string" || typeof data.note !== "string") throw new Error("Invalid review details.");
    if (!["approved", "needs_correction", "rejected"].includes(data.status)) throw new Error("Choose a valid review decision.");
    if (typeof data.verificationConfirmed !== "boolean") throw new Error("Confirm verification status.");
    return data;
  })
  .handler(({ data }) => reviewRiderApplicationServer(data));

export function getRiderApplication() {
  return readApplication();
}

export function submitRiderApplication(data: Parameters<typeof submitApplication>[0]["data"]) {
  return submitApplication({ data });
}

export function getRiderApplicationsForAdmin() {
  return readAdminApplications();
}

export function reviewRiderApplication(data: Parameters<typeof reviewApplication>[0]["data"]) {
  return reviewApplication({ data });
}
