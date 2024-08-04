import Betrimex from "../components/projects/betrimex/MainUI/betrimex";
import HeaderTS from "../components/header/header";

export default function Home() {
  return (
    <main>
      <div className="content">
        <HeaderTS user="guest"></HeaderTS>
        <Betrimex></Betrimex>
      </div>
    </main>
  );
}
