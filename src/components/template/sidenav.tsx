import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Menu,
  X,
  LogOut,
  Wallet,
  BellDot,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Settings,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/icon.ico";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "HR Management", href: "/dashboard/hr", icon: Users },
  {
    name: "Attendance",
    href: "/dashboard/attendance",
    icon: Calendar,
    children: [
      { name: "View Attendance", href: "/dashboard/attendance", icon: Eye },
      { name: "Manual Attendance", href: "/dashboard/attendance/manual", icon: Edit },
    ],
  },
  { name: "Payroll", href: "/dashboard/payroll", icon: DollarSign },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];


export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActiveItem = (item: typeof navigation[0]) =>
    location.pathname === item.href || item.children?.some((child) => child.href === location.pathname);

  return (
    <div className="flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo wrapper */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border transition-all duration-300">
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <img
                src={logo}
                alt="logo"
                className="w-6 h-6 transition-transform duration-300 ease-out"
              />
              {(!sidebarCollapsed || !isDesktop) && (
                <h1
                  className={cn(
                    "font-heading font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-1 transition-all duration-300 ease-out",
                    sidebarCollapsed && isDesktop
                      ? "opacity-0 w-0 overflow-hidden"
                      : "opacity-100 w-auto"
                  )}
                >
                  Innorik
                </h1>
              )}
            </div>

            {!isDesktop && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const active = isActiveItem(item);
              const expanded = expandedMenus[item.name] || active;
              const submenuRef = useRef<HTMLDivElement>(null);

              return (
                <div key={item.name} className="flex flex-col">
                  <Button
                    variant={active ? "default" : "ghost"}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 font-medium transition-all duration-300",
                      active && "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                    onClick={() => {
                      if (item.children) {
                        toggleMenu(item.name);
                      } else {
                        navigate(item.href);
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-300" />
                      <span
                        className={cn(
                          "inline-block transition-all duration-300 ease-out",
                          sidebarCollapsed && isDesktop ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-full"
                        )}
                      >
                        {item.name}
                      </span>
                    </div>

                    {item.children && !sidebarCollapsed && (
                      <span>
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    )}
                  </Button>

                  {/* Animated submenu */}
                  {item.children && (
                    <div
                      ref={submenuRef}
                      className={cn(
                        "ml-8 flex flex-col gap-1 overflow-hidden transition-all duration-300",
                        expanded ? "max-h-96 mt-1" : "max-h-0 mt-0"
                      )}
                    >
                      {item.children.map((child) => (
                        <Button
                          key={child.name}
                          variant={location.pathname === child.href ? "default" : "ghost"}
                          className="w-full justify-start text-sm pl-6 flex items-center gap-2"
                          onClick={() => {
                            navigate(child.href);
                            setSidebarOpen(false);
                          }}
                        >
                          {child.icon && <child.icon className="w-4 h-4 flex-shrink-0" />}
                          {child.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Info */}
          {isDesktop && sidebarCollapsed ? (
            <div className="flex justify-center p-4 border-t border-border">
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="h-10 w-10 border-2 border-primary/20 rounded-full bg-primary cursor-pointer flex justify-center items-center">
                    <AvatarFallback className="bg-primary text-primary-foreground font-heading">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 rounded-full bg-primary flex justify-center items-center">
                      <AvatarFallback className="bg-primary text-primary-foreground font-heading">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">Admin User</p>
                      <p className="text-xs text-muted-foreground truncate">admin@innorik.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ) : !sidebarCollapsed || !isDesktop ? (
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20 rounded-full bg-primary flex justify-center items-center">
                  <AvatarFallback className="bg-primary text-primary-foreground font-heading">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@innorik.com</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          ) : null}
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <header className="sticky top-0 z-30 h-16 border-b border-border backdrop-blur-sm bg-card/95 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-heading font-semibold hidden lg:block">
              Payroll, HR & Attendance System
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <BellDot className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-3 border-b flex justify-between items-center">
                  <h3 className="font-semibold">Notifications</h3>
                  <button className="text-xs text-blue-500">Mark all as read</button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y">
                  <div className="flex items-start gap-3 p-3 hover:bg-gray-50">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Wallet className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payroll for October processed successfully</p>
                      <span className="text-xs text-gray-400">5 mins ago</span>
                    </div>
                  </div>
                </div>
                <div className="border-t p-3 text-center">
                  <Button variant="outline" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
