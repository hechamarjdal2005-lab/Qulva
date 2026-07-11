import { supabase } from "@/lib/supabase";

export interface DbSiteSetting {
  key: string;
  value: unknown;
}

export async function getSiteSettings(): Promise<Record<string, unknown>> {
  const { data } = await supabase.from("site_settings").select("*");

  if (!data) return {};

  const settings: Record<string, unknown> = {};
  for (const row of data) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function getSiteSetting(key: string): Promise<unknown> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  return data?.value ?? null;
}
