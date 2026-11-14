import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-marketing px-5 text-center">
      <p className="font-display text-[96px] leading-none font-bold tracking-[-0.04em] text-primary-500">
        404
      </p>
      <h1 className="mt-4 text-h1 text-ink">Page not found</h1>
      <p className="mt-2 max-w-[420px] text-sm text-ink-muted">
        The page you are looking for is not part of this demonstration workspace.
      </p>
      <Button asChild className="mt-6 rounded-full">
        <Link href="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to OpenClinic
        </Link>
      </Button>
    </div>
  );
}
