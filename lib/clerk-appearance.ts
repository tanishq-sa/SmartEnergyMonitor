/**
 * Shared Clerk appearance for sign-in/sign-up.
 * Fixes social buttons (Google, GitHub, Apple) and form fields on dark background.
 */
export const clerkAppearance = {
  variables: {
    colorBackground: "#000",
    colorInput: "#171717",
    colorInputForeground: "#fff",
    colorForeground: "#e5e7eb",
    colorMutedForeground: "#9ca3af",
    colorPrimary: "#fff",
    colorPrimaryForeground: "#000",
    colorBorder: "#374151",
    // Light neutral so social buttons (GitHub, Google, Apple) get light bg and dark icons are visible
    colorNeutral: "#f3f4f6",
    colorMuted: "#1f2937",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "mx-auto",
    card: "border border-gray-800 bg-black shadow-lg",
    // Social buttons: light background so Google/GitHub/Apple icons are visible
    socialButtonsBlockButton:
      "!bg-gray-100 !text-gray-900 border border-gray-300 hover:!bg-gray-200 [&_svg]:!fill-gray-900 [&_svg]:!text-gray-900",
    socialButtonsBlockButtonText: "!text-gray-900 font-medium",
    socialButtonsIconButton:
      "!bg-gray-100 border border-gray-300 hover:!bg-gray-200 [&_svg]:!fill-gray-900",
    // Form inputs: email, phone – dark field, white text
    formFieldInput:
      "!bg-[#171717] !text-white border border-gray-700 focus:!border-gray-500 placeholder:!text-gray-500",
    formFieldLabel: "!text-gray-300",
    formFieldInputShowPasswordButton: "!text-gray-400 hover:!text-white",
    // Primary button (Continue / Sign in)
    formButtonPrimary:
      "!bg-white !text-black border border-gray-400 hover:!bg-gray-100",
    formFieldAction: "!text-gray-400",
    footerActionLink: "!text-gray-400 hover:!text-white",
    dividerLine: "!bg-gray-700",
    dividerText: "!text-gray-500",
    headerTitle: "!text-white",
    headerSubtitle: "!text-gray-400",
    alert: "!bg-gray-900 border border-gray-700 !text-gray-300",
  },
};
