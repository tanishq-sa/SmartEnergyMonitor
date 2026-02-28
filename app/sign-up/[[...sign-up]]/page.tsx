import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center clerk-auth-page">
      <SignUp appearance={clerkAppearance} />
    </div>
  );
}
