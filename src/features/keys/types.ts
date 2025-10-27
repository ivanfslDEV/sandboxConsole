export type KeyStatus = "active" | "revoked";

export type ApiKeyRow = {
  id: string;
  label: string;
  createdAt: number;
  updatedAt: number;
  status: KeyStatus;
  masked: string;
};
