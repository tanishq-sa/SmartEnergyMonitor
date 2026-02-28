/**
 * Premium Clerk appearance for sign-in and sign-up.
 * Matches the SmartEnergy Monitor theme: dark #0f172a, neon green #00ff88, electric blue #00c3ff
 */

export const clerkAppearance = {
  variables: {
    colorBackground: "transparent",
    colorInput: "rgba(15, 23, 42, 0.9)",
    colorInputForeground: "#f8fafc",
    colorForeground: "#f8fafc",
    colorMutedForeground: "#94a3b8",
    colorPrimary: "#00ff88",
    colorPrimaryForeground: "#0f172a",
    colorBorder: "rgba(0, 255, 136, 0.25)",
    colorNeutral: "rgba(15, 23, 42, 0.9)",
    colorMuted: "rgba(51, 65, 85, 0.5)",
    borderRadius: "1rem",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent shadow-none border-none p-0",
    cardBox: "w-full",
    headerTitle: "!text-slate-50 !font-semibold !text-xl",
    headerSubtitle: "!text-slate-400 !text-sm",
    dividerLine: "!bg-slate-700",
    dividerText: "!text-slate-500 !text-sm",
    formFieldLabel: "!text-slate-300 !font-medium",
    formFieldInput:
      "!bg-slate-900/80 !text-slate-50 border border-slate-600/50 focus:!border-[#00ff88] focus:!ring-2 focus:!ring-[#00ff88]/20 !rounded-xl !h-12",
    formFieldInputShowPasswordButton:
      "!text-slate-400 hover:!text-[#00ff88] transition-colors",
    formFieldAction: "!text-slate-400 hover:!text-[#00ff88] transition-colors",
    formButtonPrimary:
      "!bg-[#00ff88] !text-[#0f172a] hover:!bg-[#00ff88]/90 hover:!shadow-[0_0_30px_rgba(0,255,136,0.4)] !rounded-xl !font-semibold !h-12 transition-all duration-300",
    footerActionLink:
      "!text-[#00ff88] hover:!text-[#00ff88]/80 transition-colors",
    footerAction: "!text-slate-400",
    footerActionText: "!text-slate-400",
    alert: "!bg-slate-900/80 border border-slate-600/50 !text-slate-300 !rounded-xl",
    identityPreviewEditButton:
      "!text-[#00ff88] hover:!text-[#00ff88]/80",
    // Social buttons: subtle glass style, icons visible
    socialButtonsBlockButton:
      "!bg-slate-800/60 !text-slate-200 border border-slate-600/50 hover:!border-[#00ff88]/30 hover:!bg-slate-800/80 !rounded-xl transition-all [&_svg]:!fill-current",
    socialButtonsBlockButtonText: "!text-slate-200 font-medium",
    socialButtonsIconButton:
      "!bg-slate-800/60 border border-slate-600/50 hover:!border-[#00ff88]/30 !rounded-xl [&_svg]:!fill-current",
  },
};
