"use client";
import Image from "next/image";
import { AiOutlineHome } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { TiContacts } from "react-icons/ti";
import { FiMail } from "react-icons/fi";
import { TiEye } from "react-icons/ti";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
// import { SidebarContext } from "@/app/context/SidebarContext";
import { useState } from "react";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";

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
  {
    name: "AFC",
    href: "/afc",
    icon: TiEye,
  },
];

const Sidebar = () => {
  const [isCollapsed, setCollapse] = useState(true);
  const pathname = usePathname();
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
          <h1 className={styles.sidebar__logo_name}>TS Tech</h1>
        </div>
        <ul className={styles.sidebar__list}>
          {sidebarItems.map(({ name, href, icon: Icon }) => {
            return (
              <li className={styles.sidebar__item} key={name}>
                <Link
                  className={`${styles.sidebar__link} ${
                    pathname === href && styles.sidebar__link_active
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
