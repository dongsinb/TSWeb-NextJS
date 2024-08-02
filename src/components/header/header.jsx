"use client";
import { usePathname } from "next/navigation";
import UserDropdown from "../../components/userDropdown/userDropdown";
import styles from "./header.module.css";

const HeaderTS = () => {
  const pathname = usePathname();
  const pagename = pathname.split("/").pop();

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {pagename === "" ? "Betrimex" : pagename}
      </div>
      <UserDropdown />
    </div>
  );
};

export default HeaderTS;
