"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminProfileForm } from "@/components/AdminProfileForm";
import { DataTable } from "@/components/DataTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Profile } from "@/types/profile";
import { useProfiles } from "@/hooks/useProfile";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function AdminPage() {
  const { 
    profiles, 
    loading, 
    error, 
    mutate 
  } = useProfiles();
  
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Handle profile submission
  const handleProfileSubmit = async (profileData: Partial<Profile>) => {
    setIsSubmitting(true);
    try {
      const endpoint = selectedProfile
        ? `/api/profiles/${selectedProfile.id}`
        : "/api/profiles";

      const method = selectedProfile ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save profile");
      }

      // Show success toast
      toast.success(
        selectedProfile 
          ? "Profile updated successfully" 
          : "Profile created successfully"
      );

      // Refresh the profiles list
      await mutate();

      // Reset states
      setSelectedProfile(null);
      setIsProfileModalOpen(false);
    } catch (error) {
      // Show error toast
      toast.error(
        error instanceof Error 
          ? error.message 
          : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;

    try {
      const response = await fetch(`/api/profiles/${profileToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete profile");
      }

      // Show success toast
      toast.success("Profile deleted successfully");

      // Refresh the profiles list
      await mutate();

      // Reset delete state
      setProfileToDelete(null);
    } catch (error) {
      // Show error toast
      toast.error(
        error instanceof Error 
          ? error.message 
          : "An unexpected error occurred"
      );
    }
  };

  // Open modal for adding/editing profile
  const openProfileModal = (profile?: Profile) => {
    setSelectedProfile(profile || null);
    setIsProfileModalOpen(true);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error.message || "An unexpected error occurred"}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => mutate()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button 
          onClick={() => openProfileModal()}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Profile
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        profiles={profiles}
        onEdit={(profile) => openProfileModal(profile)}
        onDelete={(profileId) => setProfileToDelete(profileId)}
      />

      {/* Profile Modal */}
      <Dialog 
        open={isProfileModalOpen} 
        onOpenChange={setIsProfileModalOpen}
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProfile ? 'Edit Profile' : 'Add New Profile'}
            </DialogTitle>
            <DialogDescription>
              {selectedProfile 
                ? 'Update the details of an existing profile' 
                : 'Create a new profile with comprehensive information'
              }
            </DialogDescription>
          </DialogHeader>
          
          <AdminProfileForm
            key={selectedProfile?.id || 'new'}
            profile={selectedProfile || undefined}
            onSubmit={handleProfileSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <AlertDialog 
        open={!!profileToDelete}
        onOpenChange={() => setProfileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              profile from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProfile}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}