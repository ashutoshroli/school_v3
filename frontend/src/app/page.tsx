import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login page for now
  // In production, check if user is authenticated
  redirect('/login');
}
