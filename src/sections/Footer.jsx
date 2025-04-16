import { socialImgs } from "../constants";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col justify-center mb-4 md:mb-0">
          <p>Terms & Conditions</p>
        </div>
        <div className="socials mb-4 md:mb-0">
          {socialImgs.map((socialImg, index) => (
            <div key={index} className="icon">
              <img src={socialImg.imgPath} alt="social icon" />
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end text-[10px] leading-tight md:text-base">
            © 2025 Alex Mieses. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
