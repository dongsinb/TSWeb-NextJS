import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./userDropdown.module.css";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message);
      window.location.href = "/login";
    } else {
      console.error("Logout failed:", data.message);
    }
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.user} onClick={toggleDropdown}>
        <Image
          src="/noavatar.png"
          alt=""
          width={40}
          height={40}
          className={styles.userImage}
        />
        Hi, Admin
      </div>
      {isOpen && (
        <div className={styles.dropdownContent}>
          <Link href="/user_profile" className={styles.dropdownItem}>
            Profile
          </Link>
          <Link href="/settings" className={styles.dropdownItem}>
            Settings
          </Link>
          <Link
            href="/login"
            className={styles.dropdownItem}
            onClick={handleLogout}
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
