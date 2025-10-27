export type UsageRow = {
  date: string; // YYYY-MM-DD
  keyId: string; // e.g. 'server'
  requests: number;
  status2xx: number;
  status4xx: number;
  status5xx: number;
};
