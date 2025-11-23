import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import { UserDataSync } from "./components/common/UserDataSync";
import { cookies } from "next/headers";
import { decodeJWT } from "@/utils/decodeJWT";

export default async function ClientLayout({ children }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken_user")?.value;
  let userId = null;

  if (accessToken) {
      const decoded = decodeJWT(accessToken);
      userId = decoded?.id;
  }

  return (
    <div>
      <UserDataSync currentUserId={userId} />
      <Header />
        <main>{children}</main>
      <Footer />
    </div>
  );
}
