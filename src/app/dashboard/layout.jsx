import HeaderTS from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import styles from "./dashboard.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <ToastContainer
        position="top-right"
        autoClose={2000} // Auto close after 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={styles.page}>
        <Sidebar />
        <div className={styles.content}>
          <HeaderTS user="admin"></HeaderTS>
          {children}
        </div>
      </div>
    </div>
  );
};
export default Layout;
