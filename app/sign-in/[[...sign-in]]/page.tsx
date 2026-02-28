import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center clerk-auth-page">
      <SignIn appearance={clerkAppearance} />
    </div>
  );
}
