import React, { useContext, useEffect, useState } from "react";
import "./navbar.css";
import { AuthContext } from "../../../user/context/authContext/AuthContext";
import { logout } from "../../../user/context/authContext/AuthActions";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUserData(user.user);
  }, [user]);

  return (
    <div className="navbar">
      <div className="topMenu">
        <div className="avatar">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
            alt="Admin Avatar"
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        </div>
        <div className="name">{userData?.full_name}</div>
        <ul className="menu">
          <li className="menu-item">
            <Link to="blogs" className="menu-link">
              Bloglar
            </Link>
          </li>
          <li className="menu-item">
            <Link to="events" className="menu-link">
              Etkinlikler
            </Link>
          </li>
          <li className="menu-item">
            <Link to="announcements" className="menu-link">
              Duyurular
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-action">
        <a href="/" className="menu-item">
          Siteye Git
        </a>
        <a className="menu-item" onClick={() => dispatch(logout())}>
          Çıkış Yap
        </a>
      </div>
    </div>
  );
};

export default Navbar;
