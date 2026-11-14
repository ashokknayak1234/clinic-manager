import type { Metadata } from "next";
import { ProfileView } from "@/components/portal/profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your account in the OpenClinic demo workspace.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
