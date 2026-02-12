import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { LogOut } from "lucide-react";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="navbar bg-base-100 px-7 py-3 shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="font-algomates text-xl md:text-3xl font-bold tracking-wide hover:opacity-90 transition"
        >
          AlgoMates ⭐
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-6">

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden md:flex gap-6 text-base font-medium">
            {[
              { name: "Explore", to: "/" },
              { name: "Connections", to: "/connections" },
              { name: "Requests", to: "/requests" },
              { name: "Premium", to: "/premium" },
            ].map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `relative pb-1 transition-all duration-300
                  ${
                    isActive
                      ? "text-primary font-semibold after:w-full"
                      : "hover:text-primary after:w-0"
                  }
                  after:content-[''] after:absolute after:left-0 after:-bottom-1
                  after:h-[2px] after:bg-primary after:transition-all`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* ========== DESKTOP PROFILE + LOGOUT ========== */}
          <div className="hidden md:flex items-center gap-4">
            {/* Profile Pill */}
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full bg-base-200 px-3.5 py-1.5
                         hover:bg-base-300 transition"
            >
              <div className="avatar">
                <div className="w-9 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img src={user.photoUrl} alt="profile" />
                </div>
              </div>
              <span className="text-sm font-medium">
                {user.firstName}
              </span>
            </Link>

            {/* Logout (animated, layout-aware) */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 text-error opacity-70
                         hover:opacity-100 transition"
            >
              <LogOut
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              <span
                className="max-w-0 overflow-hidden whitespace-nowrap
                           opacity-0 transition-all duration-300 ease-out
                           group-hover:max-w-[70px]
                           group-hover:opacity-100 text-sm"
              >
                Logout
              </span>
            </button>
          </div>

          {/* ================= MOBILE AVATAR MENU ================= */}
          <div className="md:hidden dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-9 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                <img src={user.photoUrl} alt="profile" />
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow
                         bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile">My Profile</Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <Link to="/premium">Premium</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>

        </div>
      )}
    </div>
  );
};

export default NavBar;
