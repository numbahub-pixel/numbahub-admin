<<<<<<< HEAD
=======
<<<<<<< HEAD
# NumbaHub Landing Page

A responsive marketing landing page built with plain HTML, CSS, and vanilla JavaScript (no React).

## Preview
Open `index.html` in a browser. Google Fonts and Lucide icons load from their CDNs, so an internet connection is needed for those assets.

## Files
- `index.html` — page content and sections
- `styles.css` — responsive layout, visual styling, animations, and reduced-motion support
- `script.js` — mobile menu, reveal-on-scroll, FAQ accordion, and dynamic copyright year

## Integration notes
The login and service links are set to the existing `numbahub-user-dashboard/` project structure. If this landing page is placed at the root beside that folder, the relative links should resolve. Update the login/signup destinations and support contact to match the actual deployed routes before launch. The support email shown in the FAQ is a placeholder and should be replaced with the official support address.
=======
>>>>>>> de6323e540b1214ecee863375b6f6205bc86020c
# NumbaHub Admin Panel (Frontend Preview)

A separate, responsive administration frontend built with readable HTML, Tailwind CSS utilities, custom CSS and vanilla JavaScript. It is designed to sit beside the existing `numbahub-landing` and `numbahub-user-dashboard` folders.

## Included pages

- `login.html` — admin sign-in screen (demo only)
- `index.html` — dashboard
- `pages/users.html` — customer management
- `pages/staff.html` — staff and role management
- `pages/finance.html` — wallet and finance overview
- `pages/services.html` — service catalog
- `pages/orders.html` — orders and transactions
- `pages/providers.html` — provider integrations
- `pages/pricing.html` — pricing and margin overview
- `pages/support.html` — customer support tickets
- `pages/marketing.html` — announcements and referral settings
- `pages/reports.html` — reporting overview
- `pages/audit.html` — audit and security logs
- `pages/settings.html` — platform settings

## Run locally

1. Open the `numbahub-admin` folder in VS Code.
2. Start VS Code Live Server from `login.html` or `index.html`.
3. For the preview sign-in, enter any valid-looking email and a password with at least 6 characters.
4. Use the sidebar to open all pages.

The sidebar is loaded from `components/sidebar.html`, so run through Live Server instead of opening HTML files with `file://`.

## Important: demo frontend, not production security

- All displayed users, orders, amounts, provider records, reports and audit events are fictional sample data.
- The sign-in uses a browser session flag for preview only. It is not secure authentication and does not protect the pages.
- Demo buttons and forms do not change a real database, wallet, payment, provider or customer account.
- Do not deploy this preview as an admin console until it is integrated with the backend and tested.

## Backend integration checklist

Ask the backend developer for:

1. Admin authentication/session endpoints and logout behavior.
2. Admin roles and permissions enforced server-side.
3. API base URL and endpoint documentation, request/response examples and error format.
4. User, staff, service, order, provider, pricing, support and reporting endpoints.
5. Ledger, deposit, refund, adjustment, reconciliation and approval workflows.
6. Audit logging and session security expectations.
7. Provider integration status endpoints; keep all provider credentials server-side.

Use a shared API client in `assets/js/` when the endpoint contracts are available. Never put private API keys in frontend JavaScript. Financial actions must be validated and authorized on the server, use idempotency protection where applicable, and produce audit events.

## Styling and code conventions

- Tailwind CSS CDN is included for rapid local prototyping; it needs internet access.
- `assets/css/admin.css` contains reusable visual styles and responsive breakpoints.
- `assets/js/admin.js` contains shared UI interactions.
- Page-specific content remains in individual HTML files to make edits straightforward.
- Source files are intentionally formatted with indentation and line breaks.

Before production, consider installing Tailwind locally and compiling a production stylesheet instead of relying on the CDN.
<<<<<<< HEAD
=======
>>>>>>> 0e62e05 (Initial commit for NumbaHub Admin)
>>>>>>> de6323e540b1214ecee863375b6f6205bc86020c
