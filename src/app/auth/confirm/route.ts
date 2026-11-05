import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const next = request.nextUrl.searchParams.get("next");
  const destination = next?.startsWith("/") && !next.startsWith("//")
    ? new URL(next, request.url)
    : new URL("/", request.url);
  if (destination.origin !== request.nextUrl.origin) {
    destination.pathname = "/";
    destination.search = "";
    destination.hash = "";
  }
  const supabase = await createServerSupabaseClient();

  if (supabase && tokenHash && (type === "email" || type === "recovery")) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return NextResponse.redirect(destination);
  }

  const errorUrl = new URL("/login", request.url);
  errorUrl.searchParams.set("authError", "invalid-link");
  return NextResponse.redirect(errorUrl);
}
