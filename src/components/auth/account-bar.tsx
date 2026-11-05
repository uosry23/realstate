import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth-actions";

export async function AccountBar() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;

  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="truncate text-sm text-slate-700">{data.claims.email}</p>
      <form action={signOut}>
        <button className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-600">تسجيل الخروج</button>
      </form>
    </div>
  );
}
