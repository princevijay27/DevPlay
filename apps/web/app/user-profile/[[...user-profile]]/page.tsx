import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <UserProfile />
    </main>
  );
}
