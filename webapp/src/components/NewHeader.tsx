import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="flex items-start bg-indigo-700 p-2 text-white md:p-4 lg:px-6">
      <Link to="/" className="focus-inverted flex items-center gap-2 p-2">
        <img
          width="32"
          height="32"
          src="/apple-touch-icon.png"
          alt=""
          className="block"
        />
        Featmap
      </Link>
    </header>
  );
};
