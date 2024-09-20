"use client";
import Image from "next/image";
import { AiOutlineHome } from "react-icons/ai";
import { FaRegWindowRestore } from "react-icons/fa6";
import { TiContacts } from "react-icons/ti";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TiPlus  } from "react-icons/ti";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const sidebarItems = [
  {
    name: "Màn Hình Đếm",
    href: "/home",
    icon: AiOutlineHome,
  },
  {
    name: "Quản Lý Đơn Hàng",
    href: "/home/store",
    icon: FaRegWindowRestore,
  },
  {
    name: "Xử Lý Đơn Lỗi",
    href: "/home/handlingError",
    icon: TiContacts,
  },
  {
    name: "Thêm Đơn Hàng",
    href: "/home/addOrder",
    icon: TiPlus,
  },
  {
    name: "Thông Tin",
    href: "/home/info",
    icon: IoMdInformationCircleOutline,
  },
];

const Sidebar = () => {
  const [isCollapsed, setCollapse] = useState(true);
  const pathname = usePathname();

  // Toggle the collapse state of the sidebar
  const handleToggleSidebarCollapse = () => {
    setCollapse(!isCollapsed);
  };

  return (
    <div className={styles.sidebar__wrapper}>
      <button className={styles.btn} onClick={handleToggleSidebarCollapse}>
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </button>
      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
        data-collapse={isCollapsed}
      >
        <div className={styles.sidebar__top}>
          <Image
            width={100}
            height={100}
            className={styles.sidebar__logo}
            src="/tstech.ico"
            alt="logo"
            priority
          />
          <h1 className={styles.sidebar__logo_name}>TS Tech</h1>
        </div>
        <ul className={styles.sidebar__list}>
          {sidebarItems.map(({ name, href, icon: Icon }) => (
            <li className={styles.sidebar__item} key={name}>
              {isCollapsed ? (
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip id={`tooltip-${name}`}>{name}</Tooltip>}
                >
                  <Link
                    className={`${styles.sidebar__link} ${
                      pathname === href && styles.sidebar__link_active
                    }`}
                    href={href}
                  >
                    <span className={styles.sidebar__icon}>
                      <Icon />
                    </span>
                  </Link>
                </OverlayTrigger>
              ) : (
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
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
