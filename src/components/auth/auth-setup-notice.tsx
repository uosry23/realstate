import { SetupNotice } from "@/components/ui/setup-notice";
import { readSupabasePublicEnv } from "@/lib/supabase/env";

export function AuthSetupNotice() {
  return readSupabasePublicEnv() ? null : <div className="mb-4"><SetupNotice /></div>;
}
