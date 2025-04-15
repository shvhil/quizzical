import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <p>
        &copy; {new Date().getFullYear()} Quizzical App. Powered by OpenAPI.
      </p>
      <div className="footer-links">
        <p>
          Developed by Shahil Mohammed (shvhil) as part of React + Vite
          exploration and study :)
        </p>
        <br />
        <a
          href="https://github.com/shvhil"
          target="_blank"
          rel="noopener noreferrer"
        >
          My GitHub Profile - @shvhil
        </a>
      </div>
    </footer>
  );
}

export default Footer;
