import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchScanJobs,
  fetchScanJobById,
  createScanJob,
  cancelScanJob,
  retriggerScanJob,
} from '@/services/scanJobService';
import type { CreateScanJobPayload } from '@/types/scanJob';

export function useScanJobs(params?: { productId?: string; versionId?: string; status?: string }) {
  return useQuery({
    queryKey: ['scanJobs', params],
    queryFn: () => fetchScanJobs(params),
    refetchInterval: (query) => {
      const jobs = query.state.data;
      const hasActive = jobs?.some((j) => j.status === 'QUEUED' || j.status === 'RUNNING');
      return hasActive ? 5000 : false;
    },
  });
}

export function useScanJob(id: string) {
  return useQuery({
    queryKey: ['scanJobs', id],
    queryFn: () => fetchScanJobById(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const job = query.state.data;
      return job?.status === 'QUEUED' || job?.status === 'RUNNING' ? 3000 : false;
    },
  });
}

export function useCreateScanJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateScanJobPayload) => createScanJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanJobs'] });
    },
  });
}

export function useCancelScanJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelScanJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanJobs'] });
    },
  });
}

export function useRetriggerScanJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => retriggerScanJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanJobs'] });
    },
  });
}
