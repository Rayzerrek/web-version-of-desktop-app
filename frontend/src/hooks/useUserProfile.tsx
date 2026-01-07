import { useState, useEffect } from "react";
import type { UserProfile } from "../services/UserProfileService";
import { userProfileService } from "../services/UserProfileService";
import { useAuth } from "./useAuth";

export function useUserProfile() {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { isGuestMode } = await import("../utils/auth");
      
      // Goście mają podstawowy profil
      if (isGuestMode()) {
        setProfile({
          id: "guest",
          username: "Gość",
          email: "guest@localhost",
          level: 1,
          total_xp: 0,
          achievements: [],
          courses_completed: 0,
          lessons_completed: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setLoading(false);
        return;
      }
      
      if (isAuthenticated) {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          setError("User ID not found");
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          const userProfile = await userProfileService.getUserProfile(userId);

          setProfile({
            ...userProfile,
          });
          setError(null);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred",
          );
          console.error("Failed to fetch user profile:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isAuthenticated]);

  return { profile, loading, error };
}
