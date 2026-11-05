import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { Database } from "@/types/database";

type QueryResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

export async function runServerQuery<T>(
  query: (client: SupabaseClient<Database>) => PromiseLike<QueryResponse<T>>,
): Promise<QueryResult<T>> {
  const client = await createServerSupabaseClient();
  if (!client) {
    return { status: "unconfigured" };
  }

  const { data, error } = await query(client);
  if (error) {
    return {
      status: "error",
      message: "تعذر تحميل البيانات. أعد المحاولة، وإذا استمرت المشكلة فتواصل مع مدير النظام.",
    };
  }

  if (data === null) {
    return { status: "error", message: "تعذر تحميل البيانات." };
  }

  return { status: "ok", data };
}
