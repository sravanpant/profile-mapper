import React from 'react';
import { Profile } from '@/types/profile';
import { ProfileCard } from './ProfileCard';
import { AnimatePresence, motion } from 'framer-motion';

interface ProfileGridProps {
  profiles: Profile[];
  onProfileSelect?: (profile: Profile) => void;
  onShowMap?: (profile: Profile) => void;
  emptyStateMessage?: string;
}

export function ProfileGrid({ 
  profiles, 
  onProfileSelect, 
  onShowMap,
  emptyStateMessage = "No profiles found" 
}: ProfileGridProps) {
  // Empty state component
  if (profiles.length === 0) {
    return (
      <div className="flex items-center justify-center w-full py-12 text-gray-500">
        <p className="text-xl">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              delayChildren: 0.2,
              staggerChildren: 0.1
            }
          }
        }}
      >
        {profiles.map((profile) => (
          <motion.div
            key={profile.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.5
                }
              }
            }}
          >
            <ProfileCard 
              profile={profile} 
              onSelect={onProfileSelect 
                ? () => onProfileSelect(profile) 
                : undefined
              }
              onShowMap={onShowMap 
                ? () => onShowMap(profile) 
                : undefined
              }
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}