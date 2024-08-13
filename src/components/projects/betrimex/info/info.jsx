"use client";
import Link from "next/link";
import styles from "./info.module.css";

const BetrimexInfo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.introduce}>
        <p>
          WEBSITE thuộc quyền sở hữu của TSTech Việt Nam. TSTech Việt Nam là một
          công ty công nghệ hàng đầu trong lĩnh vực xử lý ảnh công nghiệp, robot
          công nghiệp, và giải pháp tự động hóa. Với mục tiêu mang lại sự đổi
          mới và tối ưu hóa quy trình sản xuất, chúng tôi đã không ngừng nỗ lực
          phát triển các công nghệ tiên tiến để đáp ứng nhu cầu ngày càng cao
          của thị trường.
        </p>
      </div>
      <div className={styles.contact}>
        <div className={styles.address}>
          <h3>Thông tin liên hệ</h3>
          <p>
            CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ TSTECH VIỆT NAM <br></br>
            Địa chỉ: 165 Nguyễn Lương Bằng, Quang Trung, Đống Đa, Hà Nội, Việt
            Nam <br></br>
            Điện thoại: 0376321055 <br></br>
            Website: <Link href={"https://tstech.vn/"}>https://tstech.vn/</Link>
            <br></br>
            Facebook:{" "}
            <Link
              href={"https://www.facebook.com/profile.php?id=61564278142077"}
            >
              Facebook/TSTECHVN/
            </Link>
            <br></br>
            Website:{" "}
            <Link href={"https://www.youtube.com/@Tstech-w4f"}>
              YouTube/tstech.vn/
            </Link>
            <br></br>
          </p>
          <div className={styles.mapContainer}>
            <iframe
              title="Betrimex Location"
              width="600"
              height="450"
              style={{ border: 0, width: "100%", height: "400px" }}
              loading="lazy"
              allowFullScreen
              src={
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.445525883147!2d105.82513457400871!3d21.01485218825851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab7f15edb49f%3A0x9c5143c238190be7!2zMTY1IE5ndXnhu4VuIEzGsMahbmcgQuG6sW5nLCBRdWFuZyBUcnVuZywgxJDhu5FuZyDEkGEsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1723520891548!5m2!1svi!2s"
              }
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetrimexInfo;
