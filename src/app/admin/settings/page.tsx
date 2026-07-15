import SettingsManager from "@/components/admin/SettingsManager";

export const metadata = {
  title: "Console Settings | LS Collections Admin",
  description: "Configure system options, APIs, and credentials.",
};

export default function AdminSettingsPage() {
  return <SettingsManager />;
}
