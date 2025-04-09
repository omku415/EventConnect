import React from "react";
import logo from "../../assets/Footerlogo.svg";
import x from "../../assets/x.svg";
import youtube from "../../assets/youtube.svg";
import facebook from "../../assets/facebook.svg";

function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <aside>
        <img
          src={logo}
          alt="Logo"
          width={50}
          height={50}
          className="fill-current"
        />
        <p>
          Event Connect
          <br />
          All event solution is here
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Social</h6>
        <div className="grid grid-flow-col gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={x} alt="Twitter / X" width={24} height={24} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <img src={youtube} alt="YouTube" width={24} height={24} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebook} alt="Facebook" width={24} height={24} />
          </a>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
