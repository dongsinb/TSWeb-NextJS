import styles from "./store.module.css";
import AFCStore from "../../../components/projects/AFC/store/store";

const StorePage = () => {
  const datas = [
    {
      _id: "6690a14e7fda34bff6b56f0c",
      PlateNumber: "20C19248",
      DateTimeIn: "2024-06-12T00:00:00+07:00",
      status: "Waitting",
      Orders: [
        {
          Order1: [
            { ProductCode: "212G-25", ProductCount: 25, CurrentQuantity: 0 },
            { ProductCode: "211G-25", ProductCount: 55, CurrentQuantity: 0 },
            { ProductCode: "302S-25", ProductCount: 35, CurrentQuantity: 0 },
            { ProductCode: "G200-25", ProductCount: 45, CurrentQuantity: 0 },
          ],
        },
        {
          Order2: [
            { ProductCode: "VV1-25", ProductCount: 20, CurrentQuantity: 0 },
            { ProductCode: "211G-25", ProductCount: 50, CurrentQuantity: 0 },
          ],
        },
      ],
    },
    {
      _id: "6695e58e196888685dac2aad",
      PlateNumber: "30C12345",
      DateTimeIn: "2024-06-12T00:00:00+07:00",
      status: "Waitting",
      Orders: [
        {
          "0061478858": [
            { ProductCode: "VV1-25", ProductCount: 20, CurrentQuantity: 0 },
            { ProductCode: "211G-25", ProductCount: 50, CurrentQuantity: 0 },
          ],
        },
      ],
    },
  ];

  const datasOld = [
    {
      _id: "6690a14e7fda34bff6b56f0c",
      date: "27-06-2024",
      license_plate: "80B-33333",
      status: "Waitting",
      orderslist: {
        order_1: { "1040-25": 5, "1020-25": 40 },
        order_2: { "VV1-25": 10, "CA01-25-40": 10 },
        order_10: { "301SP-25": 20, "CE22-25-40": 10 },
        order_19: { "302SP-25": 40, "CA44-25-40": 50 },
        order_99: { "302SP-25": 450, "CA01-25-30": 150 },
      },
    },
  ];
  return (
    <div className={styles.container}>
      <AFCStore datas={datas}></AFCStore>
    </div>
  );
};

export default StorePage;
