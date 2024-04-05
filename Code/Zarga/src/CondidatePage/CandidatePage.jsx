import JobDiv from "./JobDiv/JobDiv";
import SearchDiv from "./SearchDiv/SearchDiv";
import Nav from "./nav/Nav";

function CandidatePage() {
  return (
    <>
      <div>
        <Nav />
      </div>
      <div className="w-[85%] m-auto bg-white">
        <SearchDiv />
        <JobDiv />
      </div>
    </>
  );
}

export default CandidatePage;
