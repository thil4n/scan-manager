import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchReports,
  fetchReportById,
  createManualReport,
  uploadReportFile,
  deleteReport,
} from '@/services/reportService';
import type { ReportFilter, CreateManualReportPayload } from '@/types/report';

export function useReports(filters?: ReportFilter) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => fetchReports(filters),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => fetchReportById(id),
    enabled: !!id,
  });
}

export function useCreateManualReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateManualReportPayload) => createManualReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUploadReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      versionId,
      file,
    }: {
      productId: string;
      versionId: string;
      file: File;
    }) => uploadReportFile(productId, versionId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
