const navLinks = [
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Education",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
];

const words = [
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
];

const counterItems = [
  { value: 2, suffix: "+", label: "Years of Experience" },
  { value: 12, suffix: "+", label: "Completed Projects" },
];

const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: "/images/time.png",
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];

const techStackImgs = [
  // Markup & styling
  {
    name: "HTML5",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg",
  },
  {
    name: "Tailwind CSS",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "Bootstrap",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-original.svg",
  },
  {
    name: "JavaScript",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
  },
  // Frontend
  {
    name: "TypeScript",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
  },
  {
    name: "React",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
  },
  {
    name: "Redux",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg",
  },
  {
    name: "Next.js",
    imgPath: "/images/logos/nextjs.svg",
  },
  {
    name: "Three.js",
    imgPath: "/images/logos/threejs-wireframe.svg",
  },
  // Backend & databases
  {
    name: "Node.js",
    imgPath: "/images/logos/nodejs-logo-final.svg",
  },
  {
    name: "Python",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
  },
  {
    name: "Go",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg",
  },
  {
    name: "PostgreSQL",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "MongoDB",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg",
  },
  // Cloud, DevOps & tools
  {
    name: "Firebase",
    imgPath: "/images/logos/firebase.svg",
  },
  {
    name: "AWS",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
  },
  {
    name: "Docker",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg",
  },
  {
    name: "Kubernetes",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-original.svg",
  },
  {
    name: "Git",
    imgPath: "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg",
  },
];

const techStackIcons = [
  {
    name: "React Developer",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Python Developer",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "Backend Developer",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Interactive Developer",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
  },
  {
    name: "Project Manager",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
];

const expCards = [
  {
    review: "As a certified graduate of MIT xPRO, I've gained comprehensive knowledge in modern web development technologies and best practices.",
    imgPath: "/images/mit-exp1.jpg",
    logoPath: "/images/mit-logo.png",
    title: "React.js Developer",
    date: "Jan 2024 - Sep 2024",
    responsibilities: [
      "Studying and understanding web applications using React.js and other related technologies at MIT xPRO.",
      "Collaborating with fellow students and instructors at MIT xPRO to enhance learning and understanding.",
      "Implementing responsive design and ensuring cross-browser compatibility as part of MIT xPRO coursework.",
      "Participating in peer reviews and providing constructive feedback to fellow students at MIT xPRO.",
    ],
  },
  {
    review: "My experience at MIT xPRO has provided me with valuable skills in developing cross-platform mobile applications.",
    imgPath: "/images/mit-exp2.jpg",
    logoPath: "/images/mit-logo.png",
    title: "React Native Developer",
    date: "Jan 2024 - Sep 2024",
    responsibilities: [
      "Developing mobile applications using React Native as part of the MIT xPRO curriculum.",
      "Learning to integrate backend services with mobile frontends for complete application functionality.",
      "Implementing user authentication, data storage, and API integration in mobile applications.",
      "Creating responsive and intuitive user interfaces for various mobile device sizes and platforms.",
    ],
  },
  {
    review: "The MIT xPRO program has equipped me with full stack development skills that are directly applicable to real-world projects.",
    imgPath: "/images/mit-exp3.jpg",
    logoPath: "/images/mit-logo.png",
    title: "Full Stack Developer",
    date: "Jan 2024 - Sep 2024",
    responsibilities: [
      "Building complete web applications using the MERN stack (MongoDB, Express, React, Node.js) at MIT xPRO.",
      "Developing RESTful APIs and implementing database design using MongoDB and Mongoose.",
      "Creating responsive frontend interfaces with React and implementing state management with Redux.",
      "Deploying applications to cloud platforms and implementing CI/CD pipelines for automated testing and deployment.",
    ],
  },
];

const expLogos = [
  {
    name: "mit-logo",
    imgPath: "/images/mit-logo.png",
  },
  {
    name: "mit-logo",
    imgPath: "/images/mit-logo.png",
  },
  {
    name: "mit-logo",
    imgPath: "/images/mit-logo.png",
  },
];

const socialImgs = [
  {
    name: "GitHub",
    imgPath: "/images/socials/github.svg",
    url: "https://github.com/Troy2727",
  },
  {
    name: "X",
    imgPath: "/images/socials/x.svg",
    url: "https://x.com/AlexMieses27",
  },
  {
    name: "LinkedIn",
    imgPath: "/images/socials/linkedin.svg",
    url: "https://www.linkedin.com/in/alexmieses",
  },
];

export {
  words,
  abilities,
  counterItems,
  expCards,
  expLogos,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
};
