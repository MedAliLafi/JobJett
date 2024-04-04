import { useState } from "react";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { BsHouseDoor } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import "./SearchDiv.css";

const SearchDiv = () => {
  const [jobSearchText, setJobSearchText] = useState("");
  const [companySearchText, setCompanySearchText] = useState("");
  const [locationSearchText, setLocationSearchText] = useState("");

  return (
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
    </div>
  );
};

export default SearchDiv;
