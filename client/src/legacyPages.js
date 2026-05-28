export const legacyPages = {
  "/": { file: "home.html", title: "PIPH-Home" },
  "/login": { file: "log-in.html", title: "PIPH-Login" },
  "/signup": { file: "sign-up.html", title: "PIPH-Sign Up" },
  "/firstPage": { file: "firstPage.html", title: "PIPH" },
  "/map": { file: "map.html", title: "PIPH-Hospitals" },
  "/request": { file: "request.html", title: "PIPH-Resources" },
  "/admin": { file: "manageRequest.html", title: "PIPH-Admin" },
  "/pandamic": { file: "pandamic.html", title: "PIPH-Pandemic Hub" },
  "/alerts": { file: "alert.html", title: "PIPH-Alerts" },
  "/hospital-dashboard": {
    file: "hospital-dashboard.html",
    title: "PIPH-Hospital Dashboard",
  },
  "/organizations": { file: "organizations.html", title: "PIPH-Organizations" },
  "/org-dashboard": { file: "org-dashboard.html", title: "PIPH-Org Dashboard" },
  "/stats": { file: "stats.html", title: "PIPH-Stats" },
  "/profile": { file: "updateProfile.html", title: "PIPH-Profile" },
  "/user-dashboard": { file: "user-dashboard.html", title: "PIPH-User Dashboard" },
};

export function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}
