import { useState, useEffect } from "react";

// Fallback user hook to prevent unresolved import compilation errors.
// If you have your custom useCurrentUser hook in your project, you can swap this with:
// import useCurrentUser from "./useCurrentUser";
const useCurrentUser = () => {
  return {
    username: "Yash",
    email: "yash@email.com"
  };
};

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

  // Dynamically inject the Tabler Icons CDN stylesheet.
  // This resolves local path errors while ensuring the icons render perfectly in any environment.
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
      {/* Header with Styled Brand Logo */}
      <div className="flex items-center h-20 px-4 border-b border-gray-800 flex-shrink-0 justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          {/* Logo Icon */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#5736c6] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(87,54,198,0.5)]">
            <i className="ti ti-braincircuit text-white text-xl" />
          </div>
          {/* Brand Name */}
          <span
            className={`font-bold text-xl text-white tracking-tight transition-all duration-300 ${
              collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Prep<span className="text-[#a88bff]">iq</span>
          </span>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-900 hover:text-white transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
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

      {/* Nav Link List */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-gray-800">
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
                  aria-hidden="true"
                />
                <span
                  className={`flex-1 text-left whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                    collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  {item.label}
                </span>
                {item.badge && !collapsed && (
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold rounded-full px-2 py-0.5 min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Collapsed Tooltip Overlay */}
              {collapsed && (
                <div className="absolute left-[72px] top-1/2 -translate-y-1/2 bg-gray-900 border border-gray-800 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer User Profile Section */}
      <div className="border-t border-gray-800 p-3 flex-shrink-0 bg-gray-950">
        <div className="relative group flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-gray-900/50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#5736c6] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-[0_0_10px_rgba(87,54,198,0.3)]">
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div
            className={`flex-1 overflow-hidden transition-opacity duration-300 ${
              collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <p className="text-xs font-semibold text-white truncate">
              {user?.username || "Guest Developer"}
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              {user?.email || "guest@prepiq.ai"}
            </p>
          </div>
          {!collapsed && (
            <i className="ti ti-dots text-gray-500 text-sm flex-shrink-0 hover:text-white" aria-hidden="true" />
          )}

          {/* Collapsed Footer Profile Tooltip */}
          {collapsed && (
            <div className="absolute left-[72px] top-1/2 -translate-y-1/2 bg-gray-900 border border-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-xl">
              <div className="font-semibold">{user?.username || "Guest Developer"}</div>
              <div className="text-[10px] text-gray-500">{user?.email || "guest@prepiq.ai"}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;