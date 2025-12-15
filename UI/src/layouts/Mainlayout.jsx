import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* pt-16 = header height so content doesn't hide under sticky header */}
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
