import AppHeader from "./AppHeader";
import ThemeBackdrop from "./ThemeBackdrop";

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <ThemeBackdrop />
      <div className="app-shell__overlay" />
      <AppHeader />
      <main className="app-shell__content">{children}</main>
    </div>
  );
}
