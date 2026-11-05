-- The project-level event trigger invokes this function internally. It does
-- not need to be exposed as an RPC endpoint to anonymous or signed-in users.
revoke all on function public.rls_auto_enable() from public;
