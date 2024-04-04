import { BiTimeFive } from "react-icons/bi";
import logo1 from "../../assets/MicrosoftLogo.png";
import logo2 from "../../assets/SamsungLogo.png";
import "./JobDiv.css";

const Data = [
  {
    id: 1,
    image: logo1,
    title: "Web Developer",
    time: "Now",
    location: "Canada",
    desc: "anidandpsudbzdiad abdipau bdauidha h  udhadbaubdiabdaduadbba !",
    company: "Microsoft",
  },
  {
    id: 2,
    image: logo2,
    title: "Software Engineer",
    time: "3 months ago",
    location: "Seoul South-Korea",
    desc: "anidandpsudbzdiad abdipau bdauidha h  udhadbaubdiabdaduadbba !",
    company: "Samsung",
  },
  {
    id: 3,
    image: logo2,
    title: "Software Engineer",
    time: "Yesterday",
    location: "California USA",
    desc: "anidandpsudbzdiad abdipau bdauidha h  udhadbaubdiabdaduadbba !",
    company: "Apple",
  },
  {
    id: 4,
    image: logo2,
    title: "Software Engineer",
    time: "Yesterday",
    location: "California USA",
    desc: "anidandpsudbzdiad abdipau bdauidha h  udhadbaubdiabdaduadbba !",
    company: "Apple",
  },
  {
    id: 5,
    image: logo2,
    title: "Software Engineer",
    time: "Yesterday",
    location: "California USA",
    desc: "anidandpsudbzdiad abdipau bdauidha h  udhadbaubdiabdaduadbba !",
    company: "Apple",
  },
  {
    id: 6,
    image: logo2,
    title: "Software Engineer",
    time: "Yesterday",
    location: "California USA",
    desc: "anidandpsudbzdiad abdipau bdauidha h  udhadbaubdiabdaduadbba !",
    company: "Apple",
  },
  {
    id: 7,
    image: logo2,
    title: "Software Engineer",
    time: "Yesterday",
    location: "California USA",
    desc: "anidandpsudbzdiad abdipau bdauidha h  udhadbaubdiabdaduadbba !",
    company: "Apple",
  },
  {
    id: 6,
    image: logo2,
    title: "Software Engineer",
    time: "Yesterday",
    location: "California USA",
    desc: "anidandpsudbzdiad abdipau bdauidha h  udhadbaubdiabdaduadbba !",
    company: "Apple",
  },
];

// eslint-disable-next-line react/prop-types
function JobDiv() {
  return (
    <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10">
      {Data.map(({ id, image, title, time, location, desc, company }) => {
        return (
          <div
            key={id}
            className="group group-items singleJob p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg"
          >
            <span className="flex justify-between items-center gap-4">
              <h1 className="text-[16px] font-semibold text-black group-hover:text-white">
                {title}
              </h1>
              <span className=" flex items-center text-[#ccc] gap-1 time">
                <BiTimeFive />
                <span>{time}</span>
              </span>
            </span>
            <h6 className="text-[#ccc]">{location}</h6>
            <div className="center-content">
              <p className="text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-white overflow-hidden">
                {desc}
              </p>
              <div className="company flex items-center gap-2">
                <img src={image} alt="Company Logo" className="w-[10%]" />
                <span className="text-[14px] py-[1rem] block group-hover:text-white">
                  {company}
                </span>
              </div>
            </div>

            <button
              id="btn"
              className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-black group-hover:text-white"
            >
              See Details
            </button>

            <button
              id="btn"
              className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-black group-hover:text-white "
            >
              Apply Now
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default JobDiv;
