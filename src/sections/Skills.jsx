import { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import TitleHeader from "../components/TitleHeader";

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch("/constants/skills.json")
      .then((response) => response.json())
      .then((data) => setSkills(data))
      .catch((error) => console.error("Error fetching skills:", error));
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      ".skill-card",
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#skills-section",
          start: "top center",
        },
      }
    );
  });

  return (
    <div id="skills-section" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="My Skills"
          sub="🚀 Technologies I Work With"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="skill-card card-border overflow-hidden group rounded-lg p-4 flex flex-col items-center"
            >
              <div className="tech-card-animated-bg" />
              <img
                src={skill.icon}
                alt={skill.name}
                className="w-16 h-16 mb-2"
              />
              <p className="text-center">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
