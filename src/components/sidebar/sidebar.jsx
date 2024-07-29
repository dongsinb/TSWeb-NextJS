"use client";
import Image from "next/image";
import { AiOutlineHome } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { TiContacts } from "react-icons/ti";
import { FiMail } from "react-icons/fi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
// import { SidebarContext } from "@/app/context/SidebarContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./sidebar.module.css";

const sidebarItems = [
  {
    name: "Home",
    href: "/",
    icon: AiOutlineHome,
  },
  {
    name: "About",
    href: "/about",
    icon: BsPeople,
  },
  {
    name: "Mails",
    href: "/mails",
    icon: FiMail,
  },
  {
    name: "Contact",
    href: "/contact",
    icon: TiContacts,
  },
];

const Sidebar = () => {
  const router = useRouter();
  // const { isCollapsed, toggleSidebarcollapse } = useContext(SidebarContext);

  // console.log("toggleSidebarcollapse: ", toggleSidebarcollapse)
  const [isCollapsed, setCollapse] = useState(true);

  // Log the current state to the console
  console.log("isCollapsed: ", isCollapsed);

  // Toggle the collapse state of the sidebar
  const handleToggleSidebarcollapse = () => {
    setCollapse(!isCollapsed); // Toggle the state
  };
  return (
    <div className={styles.sidebar__wrapper}>
      <button
        className={styles.btn}
        onClick={() => handleToggleSidebarcollapse()}
      >
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </button>
      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
        data-collapse={isCollapsed}
      >
        <div className={styles.sidebar__top}>
          <Image
            width={80}
            height={80}
            className={styles.sidebar__logo}
            src="/tstech.ico"
            alt="logo"
          />
          <p className={styles.sidebar__logo_name}>TS Tech</p>
        </div>
        <ul className={styles.sidebar__list}>
          {sidebarItems.map(({ name, href, icon: Icon }) => {
            return (
              <li className={styles.sidebar__item} key={name}>
                <Link
                  className={`${styles.sidebar__link} ${
                    router.pathname === href ? styles.sidebar__link_active : ""
                  }`}
                  href={href}
                >
                  <span className={styles.sidebar__icon}>
                    <Icon />
                  </span>
                  <span className={styles.sidebar__name}>{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
