import { AuthHeader, AuthVisual } from "@/components/auth/auth-visual";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-surface min-[820px]:grid-cols-[48%_52%]">
      <div className="flex min-h-screen flex-col bg-surface p-6 md:p-10 min-[820px]:min-w-[520px]">
        <AuthHeader />
        <main className="flex flex-1 items-center py-8">
          <div className="mx-auto w-full max-w-[440px]">{children}</div>
        </main>
        <p className="text-center text-[12px] text-ink-faint">
          © 2026 OpenClinic · Frontend demonstration
        </p>
      </div>
      <AuthVisual />
    </div>
  );
}
