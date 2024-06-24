import http from "./httpService";
//import settings from "../config";
//import authService from "./authService";

const environmentName = import.meta.env.VITE_ENVIRONMENT_NAME; // assuming VITE_ENVIRONMENT_NAME holds your environment name

export function getStatsRequest() {
  return http.get(environmentName === "local"?import.meta.env.VITE_BASE_URL:import.meta.env.VITE_BASE_URL_SERVER + `/stat/requests`);
}

export function getStatsTrips() {
  return http.get(environmentName === "local"?import.meta.env.VITE_BASE_URL:import.meta.env.VITE_BASE_URL_SERVER + `/stat/trips`);
}
