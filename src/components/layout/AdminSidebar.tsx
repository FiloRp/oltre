// src/components/layout/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plane, BookOpen, Users, Settings, Star } from "lucide-react"; // Icone per la UI

// Funzione helper per classi condizionali
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/viaggi", label: "Viaggi", icon: Plane },
    { href: "/admin/prenotazioni", label: "Prenotazioni", icon: BookOpen },
    { href: "/admin/team", label: "Team", icon: Users },
    { href: "/admin/reviews", label: "Recensioni", icon: Star },
    { href: "/admin/impostazioni", label: "Impostazioni", icon: Settings }, 

  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-gray-50">
      <div className="p-4">
        <h2 className="text-xl font-bold">Oltre Admin</h2>
      </div>
      <nav className="p-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200",
                  pathname === item.href ? "bg-gray-200 font-semibold" : ""
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}