import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./SubNavbar.scss";
import { useSelector } from "react-redux";

const SubNavbar = ({title, links}) => {
  const {isInstructor} = useSelector(state => state.auth.currentUser)
  const [filteredLinks, setFilteredLinks] = useState([])

  useEffect(() => {
    if(isInstructor) {
      setFilteredLinks([...links])
    }
    else{
      const temp = links.filter(link => link.link !== '/account/instructor')
      setFilteredLinks([...temp]);
    }
  }, [isInstructor])

  return (
    <div className="sub-navbar">
      <h1>{title}</h1>
      <nav className="subnav-links">
        {filteredLinks?.map((link, i) => (
          <NavLink key={i} to={link.link} className={(navData) => (navData.isActive ? "active" : "")}>
            {link.text}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SubNavbar;
