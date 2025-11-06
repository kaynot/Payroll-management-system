// src/components/Auth/AuthLogo.tsx
import logo from "../../assets/icon.ico";

export default function AuthLogo() {
  return (
    <div className="relative mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-xl opacity-50 animate-pulse"></div>
      <div className="relative w-20 h-20 bg-gradient-to-br from-primary via-primary to-secondary rounded-3xl flex items-center justify-center shadow-xl transform transition-transform hover:scale-105">
        <img src={logo} alt="innorik-logo" className="w-8" />
      </div>
    </div>
  );
}
