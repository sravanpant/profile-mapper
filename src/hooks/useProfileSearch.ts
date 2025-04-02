import { useState, useMemo } from 'react';
import { Profile } from '@/types/profile';

type SearchField = keyof Pick<Profile, 'name' | 'email' | 'description'>;

export function useProfileSearch(initialProfiles: Profile[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('name');

  const filteredProfiles = useMemo(() => {
    if (!searchTerm) return initialProfiles;

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    return initialProfiles.filter(profile => {
      const fieldValue = String(profile[searchField]).toLowerCase();
      return fieldValue.includes(normalizedSearchTerm);
    });
  }, [initialProfiles, searchTerm, searchField]);

  const resetSearch = () => {
    setSearchTerm('');
    setSearchField('name');
  };

  return {
    profiles: filteredProfiles,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    resetSearch
  };
}