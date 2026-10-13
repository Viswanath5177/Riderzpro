import { createServerFn } from "@tanstack/react-start";
import {
  getCurrentUserServer,
  getCurrentRoleServer,
  requestSignInCodeServer,
  signOutServer,
  verifySignInCodeServer,
  linkVerifiedPhoneServer,
} from "./auth.server";

const requestSignInCode = createServerFn({ method: "POST" })
  .validator((data: { identity: string }) => {
    if (typeof data.identity !== "string" || data.identity.length > 320) throw new Error("Enter a valid email address or phone number.");
    return { identity: data.identity };
  })
  .handler(({ data }) => requestSignInCodeServer(data.identity));

const verifyCode = createServerFn({ method: "POST" })
  .validator((data: { identity: string; code: string }) => {
    if (typeof data.identity !== "string" || typeof data.code !== "string") throw new Error("Enter your sign-in details.");
    return { identity: data.identity, code: data.code };
  })
  .handler(({ data }) => verifySignInCodeServer(data.identity, data.code));

const readRole = createServerFn({ method: "GET" }).handler(() => getCurrentRoleServer());
const readCurrentUser = createServerFn({ method: "GET" }).handler(() => getCurrentUserServer());
const endSession = createServerFn({ method: "POST" }).handler(() => signOutServer());

const linkPhone = createServerFn({ method: "POST" })
  .validator((data: { phone: string; code: string }) => {
    if (typeof data.phone !== "string" || typeof data.code !== "string") throw new Error("Enter your mobile number and verification code.");
    return { phone: data.phone, code: data.code };
  })
  .handler(({ data }) => linkVerifiedPhoneServer(data.phone, data.code));

export function sendSignInCode(identity: string) {
  return requestSignInCode({ data: { identity } });
}

export function verifySignInCode(identity: string, code: string) {
  return verifyCode({ data: { identity, code } });
}

export function getCurrentRole() {
  return readRole();
}

export function getCurrentUser() {
  return readCurrentUser();
}

export function signOut() {
  return endSession();
}

export function linkVerifiedPhone(phone: string, code: string) {
  return linkPhone({ data: { phone, code } });
}
