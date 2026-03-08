import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchVersionsByProduct,
  fetchVersionById,
  createVersion,
  updateVersion,
  deleteVersion,
} from '@/services/versionService';
import type { CreateVersionPayload, UpdateVersionPayload } from '@/types/version';

export function useVersions(productId: string) {
  return useQuery({
    queryKey: ['versions', productId],
    queryFn: () => fetchVersionsByProduct(productId),
    enabled: !!productId,
  });
}

export function useVersion(productId: string, versionId: string) {
  return useQuery({
    queryKey: ['versions', productId, versionId],
    queryFn: () => fetchVersionById(productId, versionId),
    enabled: !!productId && !!versionId,
  });
}

export function useCreateVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVersionPayload) => createVersion(payload),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['versions', vars.productId] });
    },
  });
}

export function useUpdateVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateVersionPayload & { productId: string }) => updateVersion(payload),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['versions', vars.productId] });
    },
  });
}

export function useDeleteVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, versionId }: { productId: string; versionId: string }) =>
      deleteVersion(productId, versionId),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['versions', vars.productId] });
    },
  });
}
