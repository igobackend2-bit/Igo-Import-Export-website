import LoginForm from "@/components/auth/LoginForm";
import LoginLayout from "@/components/auth/LoginLayout";

export default function SellerLoginPage() {
  return (
    <LoginLayout>
      <LoginForm role="seller" />
    </LoginLayout>
  );
}
