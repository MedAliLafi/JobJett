/* eslint-disable react/no-unescaped-entities */
import Navbar from "../NavBar/EmployerNavbar.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { BiTimeFive } from "react-icons/bi";
import "./EmployerHomePage.css";
import { useNavigate } from "react-router-dom";

function EmployerHomePage() {
  const [keywordSearchText, setKeywordSearchText] = useState("");
  const [locationSearchText, setLocationSearchText] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchClicked, setSearchClicked] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchClicked) {
      fetchCandidates();
      setSearchClicked(false);
    } else {
      fetchCandidates();
    }
  }, [currentPage, searchClicked]);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/Employer/JobOffer/loadcandidates",
        {
          params: {
            page: currentPage,
            pageSize: 9,
            keyword: keywordSearchText,
            location: locationSearchText,
          },
        }
      );

      setCandidates(response.data);

      const totalCountHeader = response.headers["x-total-count"];
      const totalCount = parseInt(totalCountHeader);
      const total = Math.ceil(totalCount / 9);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleSearchClick = (event) => {
    event.preventDefault();
    setSearchClicked(true);
    setCurrentPage(1);
  };

  
  const handleOfferJob = (CandidateID) => {
    navigate(`/employer/offerajob/${CandidateID}`);
  };

  const isLastPage = currentPage >= totalPages;

  function truncateSummary(summary) {
    if (summary.length <= 200) {
      return summary;
    } else {
      return summary.slice(0, 200) + "...";
    }
  }

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="w-[85%] m-auto bg-white">
        <div className="searchDiv grid gap-10  rounded-[10px] p-3rem">
          <form>
            <div className="firstDiv flex justify-between items-center rounded-8 gap-10 bg-white p-5 shadow-lg shadow-greyIsh-700">
              {/* Keyword search */}
              <div className="flex gap-2 items-center" style={{ flex: "2" }}>
                {/* Adjusted width */}
                <AiOutlineSearch className="text-25 icon" />
                <input
                  type="text"
                  className="bg-transparent text-blueColor focus:outline-none w-full"
                  placeholder="Search by Keywords (Skills, job titles...)"
                  value={keywordSearchText}
                  onChange={(e) => setKeywordSearchText(e.target.value)}
                />
                <AiOutlineCloseCircle
                  onClick={() => setKeywordSearchText("")}
                  className="text-30 text-#a5a6a6 hover:text-black icon"
                />
              </div>
              {/* Location search */}
              <div className="flex gap-2 items-center" style={{ flex: "1" }}>
                {/* Adjusted width */}
                <IoLocationOutline className="text-25 icon" />
                <input
                  type="text"
                  className="bg-transparent text-blueColor focus:outline-none w-full"
                  placeholder="Search by Location..."
                  value={locationSearchText}
                  onChange={(e) => setLocationSearchText(e.target.value)}
                />
                <AiOutlineCloseCircle
                  onClick={() => setLocationSearchText("")}
                  className="text-30 text-#a5a6a6 hover:text-black icon"
                />
              </div>
              {/* Additional filters */}
              <div className="flex gap-2 items-center">
                {/* Add additional filter inputs here */}
              </div>
              {/* Search button */}
              <button
                id="searchbtn"
                className="bg-blueColor h-full p-5 px-10 rounded-[10px] text-white cursor-pointer hover:bg-blue-300"
                onClick={handleSearchClick}
              >
                Search
              </button>
            </div>
          </form>
          <div className="secDiv flex items-center gap-10 justify-center">
            <button
              className="clearAllButton font-semibold"
              onClick={() => {
                setKeywordSearchText("");
                setLocationSearchText("");
              }}
            >
              Clear All
            </button>
            <div className="singleSearch flex items-center gap-2">
              <label
                htmlFor="relevance"
                className="text-[#808080] font-semibold"
              >
                Sort by:
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
        <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10">
        {candidates.map(({ CandidateID, Domain, Location, Summary, State, Country }) => (
          <div
            key={CandidateID}
            id="singleJob"
            className="singleJob p-[20px]  rounded-[10px] hover:bg-blueColor hover:text-white shadow-lg shadow-greyIsh-400/700 hover:shadow-lg child"
          >
            <span className="flex justify-between items-center gap-4">
              <h1 className="text-[16px] font-semibold text-black group-hover:text-white">
                {Domain}
              </h1>
              <span className=" flex items-center text-[#ccc] gap-1 DatePosted">
                <BiTimeFive />
                {/* Change to relevant field */}
                <span>{Location}</span>
              </span>
            </span>
            <h6 className="text-[#ccc]">{Location}</h6>
            <div className=" text-[13px] text-[#959595] border-t-[2px] mt-[20px] group-hover:text-white overflow-hidden">
            <div className="CompanyName flex items-center gap-2">
              <span className="text-[14px] py-[1rem] block group-hover:text-white">
                  {State}, {Country}
                </span>
              </div>
              {truncateSummary(Summary)}
            </div>

            {/* Buttons */}
            <div className="jobButtons">
              <div>
                <button
                  className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-white group-hover:text-white"
                  onClick={() => handleOfferJob(CandidateID)}
                  type="button"
                >
                Offer a job
                </button>
              </div>
            </div>
          </div>
      ))}
        </div>
        {/* Pagination buttons */}
        <div className="paginationButtons flex justify-center items-center mt-5 ">
          <button
            className=" paginationButton mr-2 "
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="paginationButton ml-2"
            onClick={() => goToPage(currentPage + 1)}
            disabled={isLastPage}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default EmployerHomePage;