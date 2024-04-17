import Navbar from "../NavBar/CandidateNavbar.jsx";
import { useState } from "react";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { BsHouseDoor } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { BiTimeFive } from "react-icons/bi";
import logo1 from "../../../assets/MicrosoftLogo.png";
import logo2 from "../../../assets/SamsungLogo.png";
import "./CandidateHomePage.css";

const Data = [
  {
    id: 1,
    image: logo1,
    title: "Web Developer",
    dateposted: "Now",
    location: "Canada",
    description: "anidandpsudbzdiad abdipau bdauidha h  udhadbaubdiabdaduadbba !",
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


function CandidateHomePage() {
  const [jobSearchText, setJobSearchText] = useState("");
  const [companySearchText, setCompanySearchText] = useState("");
  const [locationSearchText, setLocationSearchText] = useState("");
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="w-[85%] m-auto bg-white">
      <div className="searchDiv grid gap-10  rounded-[10px] p-3rem">
      <form>
        <div className="firstDiv flex justify-between items-center rounded-8 gap-10 bg-white p-5 shadow-lg shadow-greyIsh-700">
          <div className="flex gap-2 items-center">
            <AiOutlineSearch className="text-25 icon" />
            <input
              type="text"
              className="bg-transparent text-blueColor focus:outline-none w-full"
              placeholder="Search Job Here..."
              value={jobSearchText}
              onChange={(e) => setJobSearchText(e.target.value)}
            />
            <AiOutlineCloseCircle
              onClick={() => setJobSearchText("")}
              className="text-30 text-#a5a6a6 hover:text-black icon"
            />
          </div>
          <div className="flex gap-2 items-center">
            <BsHouseDoor className="text-25 icon" />
            <input
              type="text"
              className="bg-transparent text-blueColor focus:outline-none w-full"
              placeholder="Search By Company..."
              value={companySearchText}
              onChange={(e) => setCompanySearchText(e.target.value)}
            />
            <AiOutlineCloseCircle
              onClick={() => setCompanySearchText("")}
              className="text-30 text-#a5a6a6 hover:text-black icon"
            />
          </div>
          <div className="flex gap-2 items-center">
            <IoLocationOutline className="text-25 icon" />
            <input
              type="text"
              className="bg-transparent text-blueColor focus:outline-none w-full"
              placeholder="Search By Location..."
              value={locationSearchText}
              onChange={(e) => setLocationSearchText(e.target.value)}
            />
            <AiOutlineCloseCircle
              onClick={() => setLocationSearchText("")}
              className="text-30 text-#a5a6a6 hover:text-black icon"
            />
          </div>
          <button
            id="searchbtn"
            className="bg-blueColor h-full p-5 px-10 rounded-[10px] text-white cursor-pointer hover:bg-blue-300"
          >
            Search
          </button>
        </div>
      </form>

      <div className="secDiv flex items-center gap-10 justify-center">
        <button
          className="clearAllButton font-semibold"
          onClick={() => {
            setJobSearchText("");
            setLocationSearchText("");
            setCompanySearchText("");
          }}
        >
          Clear All
        </button>
        <div className="singleSearch flex items-center gap-2">
          <label htmlFor="relevance" className="text-[#808080] font-semibold">
            sort by:
          </label>
          <select
            name=""
            id="relevance"
            className="bg-white rounded-[3px] px-4 py-1"
          >
            <option value="">Relevance</option>
            <option value="">Newest</option>
            <option value="">Latest</option>
          </select>
        </div>
      </div>
    </div>        <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10">
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
   </div>
    </>
  );
}

export default CandidateHomePage;
