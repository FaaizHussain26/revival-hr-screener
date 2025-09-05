import { ProfilePage } from "@/components/settings/profile-page";
import useAuth from "@/hooks/useAuth";

export function SettingsPage() {
  const { user } = useAuth();

  const data = {
    id: user?._id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    profileImage: user?.profileImage,
    address: user?.address,
    isActive: user?.isActive,
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <ProfilePage initialData={data} />
    </div>
  );
}
