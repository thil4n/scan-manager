import { useQuery } from '@tanstack/react-query';
import { fetchReleaseById } from '@/services/releaseService';

export function useRelease(id: string) {
  return useQuery({
    queryKey: ['release', id],
    queryFn: () => fetchReleaseById(id),
    enabled: !!id,
  });
}
