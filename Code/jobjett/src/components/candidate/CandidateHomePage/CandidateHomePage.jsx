/* eslint-disable react/no-unescaped-entities */
import Navbar from "../NavBar/CandidateNavbar.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { BsHouseDoor } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { BiTimeFive } from "react-icons/bi";
import "./CandidateHomePage.css";
import JobOfferDetails from "../JobOfferDetails/JobOfferDetails";
import ApplyNowtModal from "./ApplyNowtModal.jsx";

function CandidateHomePage() {
  const [jobSearchText, setJobSearchText] = useState("");
  const [companySearchText, setCompanySearchText] = useState("");
  const [locationSearchText, setLocationSearchText] = useState("");
  const [jobOffers, setJobOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchClicked, setSearchClicked] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJobOfferID, setSelectedJobOfferID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };
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
            pageSize: 9,
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
      const total = Math.ceil(totalCount / 9);
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

  const openModal = (jobOfferID) => {
    setSelectedJobOfferID(jobOfferID);
  };

  const closeModal = () => {
    setSelectedJobOfferID(null);
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
          {jobOffers.map(
            ({
              JobOfferID,
              Logo,
              Title,
              DatePosted,
              Location,
              Description,
              CompanyName,
            }) => (
              <div
                key={JobOfferID}
                id="singleJob"
                className="singleJob p-[20px]  rounded-[10px] hover:bg-blueColor hover:text-white shadow-lg shadow-greyIsh-400/700 hover:shadow-lg child"
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
                    <img src={Logo} alt=" " className="w-[10%]" />
                    <span className="text-[14px] py-[1rem] block group-hover:text-white">
                      {CompanyName}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="jobButtons">
                  <div>
                    <button
                      className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-black group-hover:text-white"
                      onClick={() => openModal(JobOfferID)}
                    >
                      See Details
                    </button>
                    {/* Render modal only for the selected job offer */}
                    {selectedJobOfferID === JobOfferID && (
                      <div className="modal-wrapper">
                        <div
                          className="modal-backdrop"
                          onClick={closeModal}
                        ></div>
                        <JobOfferDetails
                          JobOfferID={JobOfferID}
                          closeModal={closeModal}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-white group-hover:text-white"
                      onClick={handleModalToggle}
                      type="button"
                    >
                      Apply Now
                    </button>
                    <ApplyNowtModal
                      isOpen={isModalOpen}
                      onClose={handleModalToggle}
                    />
                  </div>

                  {/* Main modal */}
                  <div
                    id="crud-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                  >
                    <div className="relative p-4 w-full max-w-md max-h-full">
                      {/* Modal content */}
                      <div className="relative bg-white rounded-lg shadow">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Create New Product
                          </h3>
                          <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            onClick={handleModalToggle}
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
                              ></path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                          </button>
                        </div>
                        {/* Modal body */}
                        <form className="p-4 md:p-5">
                          <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                              <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Type product name"
                                required
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Price
                              </label>
                              <input
                                type="number"
                                name="price"
                                id="price"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="$2999"
                                required
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <label
                                htmlFor="category"
                                className="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Category
                              </label>
                              <select
                                id="category"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                              >
                                <option selected>Select category</option>
                                <option value="TV">TV/Monitors</option>
                                <option value="PC">PC</option>
                                <option value="GA">Gaming/Console</option>
                                <option value="PH">Phones</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label
                                htmlFor="description"
                                className="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Product Description
                              </label>
                              <textarea
                                id="description"
                                rows="4"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Write product description here"
                              ></textarea>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                          >
                            <svg
                              className="me-1 -ms-1 w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            Add new product
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
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
