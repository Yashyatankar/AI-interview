import { useState, useEffect } from "react";

// Robust import handling: Attempts to use your local file, falls back to a dummy hook if not found.
let useCurrentUser;
try {
  useCurrentUser = require("./useCurrentUser.jsx").default;
} catch (e) {
  useCurrentUser = () => ({
    username: "User",
    email: "user@example.com"
  });
}

const navItems = [
  { section: "Main" },
  { icon: "layout-dashboard", label: "Dashboard", path: "/dashboard" },
  { icon: "microphone", label: "Mock Interviews", path: "/interviews", badge: 3 },
  { icon: "file-text", label: "My Sessions", path: "/sessions" },
  { icon: "chart-bar", label: "Analytics", path: "/analytics" },
  { section: "Prepare" },
  { icon: "brain", label: "Question Bank", path: "/questions" },
  { icon: "book", label: "Study Notes", path: "/notes" },
  { icon: "trophy", label: "Leaderboard", path: "/leaderboard" },
  { section: "Account" },
  { icon: "settings", label: "Settings", path: "/settings" },
  { icon: "help-circle", label: "Help & Support", path: "/help" },
];

const SideBar = ({ activeRoute = "/dashboard", onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useCurrentUser();

  useEffect(() => {
    const linkId = "tabler-icons-cdn";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <aside
      className={`flex flex-col h-screen bg-gray-950 border-r border-gray-800 transition-all duration-300 ease-in-out overflow-hidden relative flex-shrink-0 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center h-20 px-4 border-b border-gray-800 flex-shrink-0 justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#5736c6] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(87,54,198,0.5)]">
            <i className="ti ti-braincircuit text-white text-xl" />
          </div>
          <span
            className={`font-bold text-xl text-white tracking-tight transition-all duration-300 ${
              collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Prep<span className="text-[#a88bff]">iq</span>
          </span>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-900 hover:text-white transition-colors flex-shrink-0"
        >
          <i
            className={`ti ${
              collapsed
                ? "ti-layout-sidebar-left-expand"
                : "ti-layout-sidebar-left-collapse"
            } text-lg`}
          />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden space-y-1">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <p
                key={i}
                className={`text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 pt-4 pb-1.5 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  collapsed ? "opacity-0 h-0 pt-0 pb-0" : "opacity-100"
                }`}
              >
                {item.section}
              </p>
            );
          }

          const isActive = activeRoute === item.path;

          return (
            <div key={i} className="relative group">
              <button
                onClick={() => onNavigate?.(item.path)}
                className={`w-full flex items-center gap-3 px-3 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#5736c6] text-white shadow-[0_0_15px_rgba(87,54,198,0.4)]"
                    : "text-gray-400 hover:bg-gray-900/50 hover:text-white"
                }`}
              >
                <i
                  className={`ti ti-${item.icon} text-lg w-5 flex-shrink-0 text-center ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  }`}
                />
                <span
                  className={`flex-1 text-left whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                    collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-3 flex-shrink-0 bg-gray-950">
        <div className="flex items-center gap-3 p-2 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-[#5736c6] flex items-center justify-center text-white text-sm font-bold shadow-[0_0_10px_rgba(87,54,198,0.3)]">
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className={`flex-1 overflow-hidden transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>
            <p className="text-xs font-semibold text-white truncate">{user?.username || "Loading..."}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email || "..."}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;