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
            <a
              key={index}
              href={socialImg.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={socialImg.name}
              className="icon"
            >
              <img
                src={socialImg.imgPath}
                alt={`${socialImg.name} icon`}
                className="size-5 md:size-6 object-contain"
              />
            </a>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end text-[10px] leading-tight md:text-base">
            © {new Date().getFullYear()} Alex Mieses. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
