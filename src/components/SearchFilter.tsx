'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Profile } from '@/types/profile';

interface SearchFilterProps {
  onSearch: (term: string) => void;
  onFilter?: (field: keyof Pick<Profile, 'name' | 'email' | 'description'>) => void;
}

export function SearchFilter({ 
  onSearch, 
  onFilter 
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<keyof Pick<Profile, 'name' | 'email' | 'description'>>('name');

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  const handleFieldChange = (field: keyof Pick<Profile, 'name' | 'email' | 'description'>) => {
    setSearchField(field);
    onFilter?.(field);
  };

  return (
    <div className="flex space-x-4">
      <div className="flex-grow">
        <Input 
          type="text"
          placeholder={`Search by ${searchField}`}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <Select 
        value={searchField} 
        onValueChange={handleFieldChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Search By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="description">Description</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}