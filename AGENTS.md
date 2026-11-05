<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Real Estate CRM AI Development Rules

## Product scope

Build an Arabic-first CRM for real estate developers and brokerages. The system covers projects and units, leads and sales pipeline, brokers, after-sales requests, and maintenance complaints. Unit statuses include available, reserved, and sold. Keep the product focused on operational and administrative workflows. Do not add accounting, invoicing, payments, or complex financial management unless explicitly requested.

## Existing project and technology

- Preserve the repository's current framework, versions, scripts, and established conventions. Inspect `package.json` and the relevant source files before changing them.
- The current project uses Next.js App Router, TypeScript, Tailwind CSS, Supabase, and `lucide-react`.
- Before writing or changing Next.js code, read the relevant version-specific guide under `node_modules/next/dist/docs/`, as required by the Next.js agent rules above.
- Do not replace the current structure with a generic scaffold or install a new dependency without a concrete need.
- Support Arabic and right-to-left (RTL) layouts throughout the product.

## Required workflow

1. Read this file, inspect the relevant feature code, `package.json`, and current Git changes before editing.
2. Identify the product behavior, affected domain, and relevant version-specific documentation.
3. Reuse existing patterns and list the files to change with each file's responsibility.
4. Implement the smallest complete change in the correct feature/domain.
5. For schema changes, add a Supabase migration and update database types and relevant documentation.
6. Run the applicable lint, type-check, or build scripts after implementation when available. Do not introduce unrelated changes to make a check pass.
7. Summarize changed behavior, files, checks run, and any remaining setup.

## Single-responsibility boundaries

- Each component has one clear UI responsibility. Do not combine unrelated screens, workflows, or domain services in one component.
- Keep pages focused on composing a screen. Extract focused UI pieces when a page grows to contain unrelated sections or independent state flows.
- Keep domain-specific components in their feature area. Keep shared UI components generic and presentation-focused.
- Keep database access out of UI components. Put queries and mutations in focused server-side data-access or feature service modules.
- Split services by domain and purpose. For example, unit operations belong in a units service and lead operations in a leads service; do not create a single service for the whole application.
- Keep validation schemas, permission checks, presentation, and persistence in their appropriate modules. Avoid oversized files and premature abstraction.

## Suggested organization

Follow the repository's existing structure and adapt incrementally. Do not move existing files solely to match this example.

```text
app/                         # App Router routes and layouts
src/
  components/
    ui/                       # Generic reusable UI primitives
    layout/                   # Navigation and application shell
  features/
    projects/
      components/
      schemas/
      services/
      types/
    units/
      components/
      schemas/
      services/
      types/
    leads/
      components/
      schemas/
      services/
      types/
    brokers/
      components/
      schemas/
      services/
      types/
    service-requests/
      components/
      schemas/
      services/
      types/
  lib/
    supabase/                 # Separate browser and server clients
    auth/
    permissions/
    utils/
  types/
    database.ts               # Generated Supabase database types
supabase/
  migrations/
docs/
```

## Supabase, data, and security

- Use separate Supabase browser and server clients. Never expose a service-role key or other secret to client-side code.
- Keep secrets in environment variables. Maintain an `.env.example` with placeholder variable names only; never commit credentials.
- Enable Row Level Security (RLS) for application data and define explicit policies for each required role and company/branch data scope.
- Enforce permissions in server-side operations and RLS. Hiding a button or route in the UI is not authorization.
- Validate all external input on the server. Client-side validation improves usability but does not replace server validation.
- Use appropriate foreign keys, constraints, and indexes. Add `created_at` and `updated_at` to core records where appropriate.
- Record important unit-status transitions with the actor and timestamp when required for operational history.
- Prevent conflicting reservations or sales with server-side checks and database constraints where feasible.
- Do not invent business rules, roles, or data access behavior. Clarify requirements when ambiguity affects records, permissions, or status transitions.

## TypeScript and implementation style

- Keep strict typing. Avoid `any`; use precise types or `unknown` with validation.
- Use clear domain names and small functions with explicit inputs and outputs.
- Keep formatting and lint conventions consistent with the repository.
- Do not silence type or lint errors without a specific, documented reason.
- Add comments only for non-obvious decisions, constraints, or edge cases.
- Do not duplicate business logic across components or routes.

## UI and accessibility

- Use semantic HTML, accessible labels, keyboard navigation, visible focus states, and clear validation feedback.
- Provide loading, empty, success, and error states for data-driven screens.
- Keep labels, status names, and status colors consistent across features.
- Make layouts responsive while prioritizing desktop operational workflows and usable mobile behavior.
- Confirm consequential actions such as deleting records or marking a unit sold.

## Definition of done

A change is complete when the requested behavior is implemented in the appropriate feature, each component and service has a focused responsibility, data access and permissions are enforced at the correct boundaries, relevant checks are run and reported, and necessary migrations/types/docs are updated. Preserve unrelated user changes.
