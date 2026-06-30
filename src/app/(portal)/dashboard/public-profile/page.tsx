import Heading from "@/components/portal/heading";
import PublicProfileSettings from "@/components/portal/settings/PublicProfileSettings";

export default function PublicProfilePage() {
  return (
    <>
      <Heading
        headingText="Public Profile"
        subHeadingText="Customize your public directory landing page and select what information you want to share."
      />
      <section className="mx-auto max-w-4xl pb-12">
        <PublicProfileSettings />
      </section>
    </>
  );
}
