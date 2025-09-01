import React from "react"; 
import logo from "../../assets/Footerlogo.svg";
import github from "../../assets/github.svg"; // GitHub icon
import code from "../../assets/code.svg"; // Code icon
import linkedin from "../../assets/linkedin.svg"; // LinkedIn icon

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
          <a href="https://github.com/omku415" target="_blank" rel="noopener noreferrer">
            <img src={github} alt="GitHub" width={24} height={24} />
          </a>
          <a href="https://leetcode.com/u/omku45/" target="_blank" rel="noopener noreferrer">
            <img src={code} alt="Code" width={24} height={24} />
          </a>
          <a href="https://www.linkedin.com/in/kumar-om45/" target="_blank" rel="noopener noreferrer">
            <img src={linkedin} alt="LinkedIn" width={24} height={24} />
          </a>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
