import styles from "./store.module.css";
import BetrimexStore from "../../../components/projects/betrimex/store/store";

const StorePage = () => {
  return (
    <div className={styles.container}>
      <BetrimexStore></BetrimexStore>
    </div>
  );
};

export default StorePage;
