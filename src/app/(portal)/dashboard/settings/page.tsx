import Heading from "@/components/portal/heading";
import ChangePassword from "@/components/portal/settings/ChangePassword";
import EditProfile from "@/components/portal/settings/EditProfile";
import UpdateProfilePhoto from "@/components/portal/settings/UpdateProfilePhoto";
import TwoFactorSettings from "@/components/portal/settings/TwoFactorSettings";

export default function Settings() {
  return (
    <>
      <Heading
        headingText="Settings"
        subHeadingText="Manage your official identity and personal preferences."
      />
      <section className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
          <div className="lg:col-span-2 space-y-8">
            <EditProfile />
          </div>
          <div className="space-y-8">
            <UpdateProfilePhoto />
            <ChangePassword />
            <TwoFactorSettings />
          </div>
        </div>
      </section>
    </>
  );
}
