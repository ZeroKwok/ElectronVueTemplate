import os from "node:os"

export const environment = process.env.NODE_ENV;
export const isDevelopment = environment === "development";
export const releaseChannel = isDevelopment ? "development" : "stable"; // "development" | "beta" | "alpha" | "stable"
export const isMacOS = process.platform === "darwin";
export const isWindows = process.platform === "win32";
export const isLinux = process.platform === "linux";
export const isElectron = Boolean(process.versions.electron);

export default {
  environment,
  isDevelopment,
  releaseChannel,
  isMacOS,
  isWindows,
  isLinux,
  isElectron
};