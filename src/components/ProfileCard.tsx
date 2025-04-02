import React from 'react';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from 'lucide-react';
import { Profile } from "@/types/profile";

interface ProfileCardProps {
  profile: Profile;
  onSelect?: () => void;
  onShowMap?: () => void;
}

export function ProfileCard({ 
  profile, 
  onSelect, 
  onShowMap 
}: ProfileCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {profile.name}
          {onSelect && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onSelect}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Image
          src={profile.imageUrl}
          alt={profile.name}
          width={200}
          height={200}
          className="rounded-full mb-4 object-cover aspect-square"
        />
        <p className="text-center mb-4 text-muted-foreground line-clamp-3">
          {profile.description}
        </p>
        <div className="flex space-x-2 w-full">
          {onShowMap && (
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onShowMap}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Show Location
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}