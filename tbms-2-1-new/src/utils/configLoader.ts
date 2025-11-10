export interface AppConfig {
  BASE_URL: string;
}

let config: AppConfig;

export const loadConfig = async (): Promise<AppConfig> => {
  if (!config) {
    const response = await fetch("/config.json");
    config = await response.json();
  }
  return config;
};

export const getConfig = (): AppConfig => {
  if (!config) {
    throw new Error("Config not loaded yet. Call loadConfig() first.");
  }
  return config;
};
