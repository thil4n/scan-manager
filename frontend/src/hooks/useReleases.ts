import { useQuery } from '@tanstack/react-query';
import { fetchReleases } from '@/services/releaseService';

export function useReleases() {
  return useQuery({
    queryKey: ['releases'],
    queryFn: fetchReleases,
  });
}
