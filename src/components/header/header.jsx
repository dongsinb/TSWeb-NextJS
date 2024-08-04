"use client";
import { usePathname, useRouter } from "next/navigation";
import UserDropdown from "../../components/userDropdown/userDropdown";
import styles from "./header.module.css";
import { Image } from "react-bootstrap";

const HeaderTS = ({ user }) => {
  const pathname = usePathname();
  const pagename = pathname.split("/").pop();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {pagename === "" ? "Betrimex" : pagename}
      </div>

      {user === "admin" ? (
        <UserDropdown />
      ) : (
        <div className={styles.user} onClick={handleLogin}>
          <Image
            src="/login.png"
            alt=""
            width={40}
            height={40}
            className={styles.userImage}
          />
          Login
        </div>
      )}
    </div>
  );
};

export default HeaderTS;
