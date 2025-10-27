import { useLocation, useNavigate } from "react-router-dom";
import { img } from "@/assets/img";

interface NavItem {
  name: string;
  path: string;
  iconActive: string;
  iconInactive: string;
}

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navList: NavItem[] = [
    { name: "홈", path: "/testtitle", iconActive: img.homeB, iconInactive: img.homeW },
    { name: "카드 관리", path: "/card", iconActive: img.cardB, iconInactive: img.cardW },
    { name: "소비내역", path: "/calendar", iconActive: img.calendarB, iconInactive: img.calendarW },
    { name: "더보기", path: "/more", iconActive: img.menuB, iconInactive: img.menuW },
  ];

  return (
    <nav
      className="
        fixed bottom-0 left-1/2 transform -translate-x-1/2
        w-[100vw] max-w-[400px] bg-white border-t border-gray-200
        z-50
        flex justify-around items-center
        py-6
        px-[max(env(safe-area-inset-left),1rem)]
        pb-[calc(env(safe-area-inset-bottom)+1.25rem)]
      "
    >
      {navList.map((item) => {
        // "/" 는 정확히 일치해야만 활성화되도록 처리
        const isActive =
          item.path === "/"
            ? currentPath === "/"
            : currentPath.startsWith(item.path);

        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center gap-1 focus:outline-none"
          >
            <img
              src={isActive ? item.iconActive : item.iconInactive}
              alt={item.name}
              className="w-6 h-6 sm:w-7 sm:h-7 transition-all duration-200"
            />
            <span
              className={`text-xs ${
                isActive ? "text-black font-semibold" : "text-gray-400"
              }`}
            >
              {item.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
