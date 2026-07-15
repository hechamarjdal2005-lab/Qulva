import { createClient } from "@/lib/supabase-server";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "show_waitlist_section")
    .single();

  const showWaitlist = data?.value !== false;

  return <HomePageClient showWaitlist={showWaitlist} />;
}
