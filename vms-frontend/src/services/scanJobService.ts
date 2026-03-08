import api from './api';
import type { ScanJob, CreateScanJobPayload } from '@/types/scanJob';

export async function fetchScanJobs(params?: {
  productId?: string;
  versionId?: string;
  status?: string;
}): Promise<ScanJob[]> {
  const { data } = await api.get<ScanJob[]>('/scan/jobs', { params });
  return data;
}

export async function fetchScanJobById(id: string): Promise<ScanJob> {
  const { data } = await api.get<ScanJob>(`/scan/jobs/${id}`);
  return data;
}

export async function createScanJob(payload: CreateScanJobPayload): Promise<ScanJob> {
  const { data } = await api.post<ScanJob>('/scan/jobs', payload);
  return data;
}

export async function cancelScanJob(id: string): Promise<ScanJob> {
  const { data } = await api.post<ScanJob>(`/scan/jobs/${id}/cancel`);
  return data;
}

export async function retriggerScanJob(id: string): Promise<ScanJob> {
  const { data } = await api.post<ScanJob>(`/scan/jobs/${id}/retrigger`);
  return data;
}
