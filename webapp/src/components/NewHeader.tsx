import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-indigo-700 p-4 text-white md:p-6 lg:px-8">
      <Link to="/" className="flex items-center gap-2">
        <img width="32" height="32" src="/apple-touch-icon.png" alt="" />
        Featmap
      </Link>
    </header>
  );
};
