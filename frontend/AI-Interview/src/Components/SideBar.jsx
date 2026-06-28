import { useState } from "react";
import '@tabler/icons-webfont/dist/tabler-icons.css';
import axios from "axios";
import useCurrentUser from "./useCurrentUser";


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

  return (
    <aside
      className={`flex flex-col h-full bg-white border-r border-zinc-200 shadow-sm transition-all duration-250 ease-in-out overflow-hidden relative ${
        collapsed ? "w-14" : "w-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-center h-12 px-2 border-b border-zinc-200 flex-shrink-0">
        <span
          className={`flex-1 pl-2 font-medium text-sm text-zinc-900 whitespace-nowrap overflow-hidden transition-opacity duration-250 ${
            collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          Prepiq
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors flex-shrink-0"
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

      {/* Nav */}
      <nav className="flex-1 px-1.5 py-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <p
                key={i}
                className={`text-[11px] font-medium text-zinc-400 uppercase tracking-widest px-2.5 pt-3 pb-1 whitespace-nowrap overflow-hidden transition-all duration-250 ${
                  collapsed ? "opacity-0 h-0 pt-0 pb-0" : "opacity-100"
                }`}
              >
                {item.section}
              </p>
            );
          }

          const isActive = activeRoute === item.path;

          return (
            <div key={i} className="relative group mb-0.5">
              <button
                onClick={() => onNavigate?.(item.path)}
                className={`w-full flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#5736c6] text-[#ffffff]"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <i
                  className={`ti ti-${item.icon} text-[18px] w-5 flex-shrink-0 text-center`}
                  aria-hidden="true"
                />
                <span
                  className={`flex-1 text-left whitespace-nowrap overflow-hidden transition-opacity duration-250 ${
                    collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  {item.label}
                </span>
                {item.badge && !collapsed && (
                  <span className="bg-[#e63946] text-white text-[10px] font-medium rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Tooltip — only shows when collapsed */}
              {collapsed && (
                <div className="absolute left-[52px] top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / User */}
      <div className="border-t border-zinc-200 p-2 flex-shrink-0">
        <div className="relative group flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-zinc-100 transition-colors">
          <div className="w-7 h-7 rounded-full bg-[#e63946] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            Y
          </div>
          <div
            className={`flex-1 overflow-hidden transition-opacity duration-250 ${
              collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <p className="text-[13px] font-medium text-zinc-900 truncate">{user?.username}</p>
            <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
          </div>
          {!collapsed && (
            <i className="ti ti-dots text-zinc-400 text-base flex-shrink-0" aria-hidden="true" />
          )}

          {collapsed && (
            <div className="absolute left-[52px] top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md">
              Yash • yash@email.com
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;