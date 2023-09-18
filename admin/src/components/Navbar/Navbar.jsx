"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import "./Navbar.scss";
import { BiLogOut } from "react-icons/bi";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav>
      <div className="logo">
        <h3>Admin Panel</h3>
      </div>

      {session && (
        <div className="menus">
          <div className="menu">
            <Image
              src={session?.user?.image}
              alt="avatar"
              height={40}
              width={40}
              style={{ borderRadius: "50%" }}
            />
            <h4>Hi, {session?.user?.name?.split(" ")[0]}</h4>
            <BiLogOut className="logout" onClick={() => signOut()} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
