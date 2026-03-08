import api from './api';
import type { Report, ReportFilter, CreateManualReportPayload } from '@/types/report';

export async function fetchReports(filters?: ReportFilter): Promise<Report[]> {
  const { data } = await api.get<Report[]>('/reports', { params: filters });
  return data;
}

export async function fetchReportById(id: string): Promise<Report> {
  const { data } = await api.get<Report>(`/reports/${id}`);
  return data;
}

export async function createManualReport(payload: CreateManualReportPayload): Promise<Report> {
  const { data } = await api.post<Report>('/reports/manual', payload);
  return data;
}

export async function uploadReportFile(
  productId: string,
  versionId: string,
  file: File,
): Promise<Report> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('productId', productId);
  formData.append('versionId', versionId);

  const { data } = await api.post<Report>('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteReport(id: string): Promise<void> {
  await api.delete(`/reports/${id}`);
}
