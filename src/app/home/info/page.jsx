import styles from "./info.module.css";
import BetrimexInfo from "../../../components/projects/betrimex/info/info";

const Info = () => {
  return (
    <div className={styles.container}>
      <BetrimexInfo></BetrimexInfo>
    </div>
  );
};

export default Info;
