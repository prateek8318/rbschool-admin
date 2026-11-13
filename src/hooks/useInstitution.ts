import { useQuery } from '@tanstack/react-query';
import { academicsApi, institutionApi } from '../api';
import { useAuthStore } from '../store/authStore';
import type { Terminology } from '../types';

const FALLBACK: Terminology = {
  program: 'Class',
  batch: 'Section',
  session: 'Academic Year',
  student: 'Student',
  guardian: 'Parent',
  teacher: 'Teacher',
  enrollmentNo: 'Admission No.',
};

/** The active institution plus the words to use for "Class", "Section", etc. */
export const useInstitution = () => {
  const institutionId = useAuthStore((state) => state.active?.institution.id);
  const query = useQuery({
    queryKey: ['institution', institutionId],
    queryFn: institutionApi.get,
    enabled: Boolean(institutionId),
    staleTime: 5 * 60_000,
  });
  return { ...query, institution: query.data, terms: query.data?.settings.terminology ?? FALLBACK };
};

/** Batches of the current session, used by most pages' filters. */
export const useBatches = () =>
  useQuery({ queryKey: ['batches'], queryFn: () => academicsApi.batches(), staleTime: 60_000 });

export const useSubjects = () => useQuery({ queryKey: ['subjects'], queryFn: academicsApi.subjects, staleTime: 60_000 });

export const usePrograms = () => useQuery({ queryKey: ['programs'], queryFn: academicsApi.programs, staleTime: 60_000 });
