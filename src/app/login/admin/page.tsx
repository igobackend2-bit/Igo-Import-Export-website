import LoginForm from "@/components/auth/LoginForm";
import LoginLayout from "@/components/auth/LoginLayout";

export default function AdminLoginPage() {
  return (
    <LoginLayout>
      <LoginForm role="admin" />
    </LoginLayout>
  );
}
