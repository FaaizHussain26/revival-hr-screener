import { useMutation } from "@tanstack/react-query";
import { ProfileFormData } from "@/components/settings/profile-page";
import { updateProfile } from "../requests/update-settings-api";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: ProfileFormData) => updateProfile(data),
  });
};
