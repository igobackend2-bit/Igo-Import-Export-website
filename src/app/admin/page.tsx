import { redirect } from 'next/navigation';

// Secret admin entry point — not linked in the public navbar.
// Visiting /admin redirects directly to the admin login.
export default function AdminEntryPage() {
  redirect('/login/admin');
}
