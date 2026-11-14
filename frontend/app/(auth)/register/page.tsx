import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Register as a patient in the OpenClinic demo workspace.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
