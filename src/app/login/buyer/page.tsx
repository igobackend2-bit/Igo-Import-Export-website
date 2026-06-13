import LoginForm from "@/components/auth/LoginForm";
import LoginLayout from "@/components/auth/LoginLayout";

export default function BuyerLoginPage() {
  return (
    <LoginLayout>
      <LoginForm role="buyer" />
    </LoginLayout>
  );
}
