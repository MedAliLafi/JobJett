/* eslint-disable react/no-unescaped-entities */
import Navbar from "../NavBar/CandidateNavbar.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { BsHouseDoor } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { BiTimeFive } from "react-icons/bi";
import logo1 from "../../../assets/MicrosoftLogo.png";
import logo2 from "../../../assets/SamsungLogo.png";
import "./CandidateHomePage.css";

function CandidateHomePage() {
  const [jobSearchText, setJobSearchText] = useState("");
  const [companySearchText, setCompanySearchText] = useState("");
  const [locationSearchText, setLocationSearchText] = useState("");
  const [jobOffers, setJobOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchClicked, setSearchClicked] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (searchClicked) {
      fetchJobOffers();
      setSearchClicked(false);
    } else {
      fetchJobOffers();
    }
  }, [currentPage, searchClicked]);

  const fetchJobOffers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/Candidate/JobOffer/loadjoboffers",
        {
          params: {
            page: currentPage,
            pageSize: 8,
            jobTitle: jobSearchText,
            companyName: companySearchText,
            location: locationSearchText,
          },
        }
      );

      const formattedJobOffers = response.data.map((jobOffer) => ({
        ...jobOffer,
        DatePosted: new Date(jobOffer.DatePosted).toLocaleDateString("en-GB"),
      }));

      setJobOffers(formattedJobOffers);

      const totalCountHeader = response.headers["x-total-count"];
      const totalCount = parseInt(totalCountHeader);
      const total = Math.ceil(totalCount / 8);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching job offers:", error);
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

  const isLastPage = currentPage >= totalPages;
  function truncateDescription(description) {
    if (description.length <= 200) {
      return description;
    } else {
      return description.slice(0, 200) + "...";
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
              {/* Job search */}
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
              {/* Company search */}
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
              {/* Location search */}
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
                setJobSearchText("");
                setLocationSearchText("");
                setCompanySearchText("");
              }}
            >
              Clear All
            </button>
            <div className="singleSearch flex items-center gap-2">
              <label
                htmlFor="relevance"
                className="text-[#808080] font-semibold"
              >
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
        <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10">
          {jobOffers.map(
            ({
              JobOfferID,
              image,
              Title,
              DatePosted,
              Location,
              Description,
              CompanyName,
            }) => (
              <div
                key={JobOfferID}
                className="singleJob p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg"
              >
                <span className="flex justify-between items-center gap-4">
                  <h1 className="text-[16px] font-semibold text-black group-hover:text-white">
                    {Title}
                  </h1>
                  <span className=" flex items-center text-[#ccc] gap-1 DatePosted">
                    <BiTimeFive />
                    <span>{DatePosted}</span>
                  </span>
                </span>
                <h6 className="text-[#ccc]">{Location}</h6>
                <div className=" text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-white overflow-hidden">
                  {truncateDescription(Description)}
                  <div className="CompanyName flex items-center gap-2">
                    <img src={logo1} alt="Company Logo" className="w-[10%]" />
                    <span className="text-[14px] py-[1rem] block group-hover:text-white">
                      {CompanyName}
                    </span>
                  </div>
                </div>
                <div className="jobContent">{/* Job offer details */}</div>
                {/* Buttons */}
                <div className="jobButtons">
                  <button
                    data-modal-target="popup-modal"
                    className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-black group-hover:text-white"
                    onClick={toggleModal}
                  >
                    See Details
                  </button>
                  {showModal && (
                    <div
                      id="popup-modal"
                      tabIndex="-1"
                      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
                      onClick={toggleModal}
                    >
                      <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow">
                          <button
                            type="button"
                            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            data-modal-hide="popup-modal"
                            onClick={toggleModal}
                          >
                            <svg
                              className="w-3 h-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                            </svg>
                            <span className="sr-only">Close modal</span>
                          </button>
                          <div className="p-4 md:p-5 text-center">
                            <svg
                              className="mx-auto mb-4 text-gray-400 w-12 h-12"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500">
                              Are you sure you want to delete this product?
                            </h3>
                            <button
                              data-modal-hide="popup-modal"
                              type="button"
                              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                              onClick={toggleModal}
                            >
                              Yes, I'm sure
                            </button>
                            <button
                              data-modal-hide="popup-modal"
                              type="button"
                              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                              onClick={toggleModal}
                            >
                              No, cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-black group-hover:text-white "
                    onClick={() =>
                      navigate(
                        `/candidate/application?jobofferId=${JobOfferID}`
                      )
                    }
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            )
          )}
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

export default CandidateHomePage;
