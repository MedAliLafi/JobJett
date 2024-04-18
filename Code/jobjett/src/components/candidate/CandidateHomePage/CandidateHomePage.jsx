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

  const navigate = useNavigate();

  useEffect(() => {
    if (searchClicked) {
      fetchJobOffers();
      setSearchClicked(false);
    }
    else{
      fetchJobOffers();
    }
  }, [currentPage, searchClicked]);

  const fetchJobOffers = async () => {
    try {
      const response = await axios.get('http://localhost:9000/Candidate/JobOffer/loadjoboffers', {
        params: {
          page: currentPage,
          pageSize: 8,
          jobTitle: jobSearchText,
          companyName: companySearchText,
          location: locationSearchText
        }
      });
  
      const formattedJobOffers = response.data.map(jobOffer => ({
        ...jobOffer,
        DatePosted: new Date(jobOffer.DatePosted).toLocaleDateString('en-GB')
      }));
  
      setJobOffers(formattedJobOffers);
  
      const totalCountHeader = response.headers['x-total-count'];
      const totalCount = parseInt(totalCountHeader);
      const total = Math.ceil(totalCount / 8);
      setTotalPages(total);
    } catch (error) {
      console.error('Error fetching job offers:', error);
    }
  };
  

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleSearchClick = () => {
    event.preventDefault();
    setSearchClicked(true);
    setCurrentPage(1);
  };

  const isLastPage = currentPage >= totalPages;

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
    <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10">
          {jobOffers.map(({ JobOfferID, image, Title, DatePosted, Location, Description, CompanyName }) => (
            <div
              key={JobOfferID}
              className="group group-items singleJob p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg"
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
            <div className="center-content">
              <p className="text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-white overflow-hidden">
                {Description}
              </p>
              <div className="CompanyName flex items-center gap-2">
                <img src={logo1} alt="Company Logo" className="w-[10%]" />
                <span className="text-[14px] py-[1rem] block group-hover:text-white">
                  {CompanyName}
                </span>
              </div>
            </div>

            <button
              id="btn"
              className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-black group-hover:text-white"
              onClick={() => navigate(`/candidate/joboffer/${JobOfferID}`)}
            >
              See Details
            </button>

            <button
              id="btn"
              className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-black group-hover:text-white "
              onClick={() => navigate(`/candidate/application?jobofferId=${JobOfferID}`)}
            >
              Apply Now
            </button>
          </div>
        ))}
    </div>  
         {/* Pagination buttons */}
         <div className="paginationButtons flex justify-center items-center mt-5">
        <button
          className="paginationButton mr-2"
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
