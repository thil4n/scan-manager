import api from './api';
import type { Version, CreateVersionPayload, UpdateVersionPayload } from '@/types/version';

export async function fetchVersionsByProduct(productId: string): Promise<Version[]> {
  const { data } = await api.get<Version[]>(`/products/${productId}/versions`);
  return data;
}

export async function fetchVersionById(productId: string, versionId: string): Promise<Version> {
  const { data } = await api.get<Version>(`/products/${productId}/versions/${versionId}`);
  return data;
}

export async function createVersion(payload: CreateVersionPayload): Promise<Version> {
  const { productId, ...rest } = payload;
  const { data } = await api.post<Version>(`/products/${productId}/versions`, rest);
  return data;
}

export async function updateVersion(payload: UpdateVersionPayload & { productId: string }): Promise<Version> {
  const { id, productId, ...rest } = payload;
  const { data } = await api.put<Version>(`/products/${productId}/versions/${id}`, rest);
  return data;
}

export async function deleteVersion(productId: string, versionId: string): Promise<void> {
  await api.delete(`/products/${productId}/versions/${versionId}`);
}
