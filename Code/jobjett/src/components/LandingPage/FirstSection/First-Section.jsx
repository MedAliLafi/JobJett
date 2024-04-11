import "./First-Section.css";
import Background from "../../../assets/GettyImages-1464773731-1200x800.jpg";
function FirstSection() {
  return (
    <section
      style={{
        backgroundImage: `url(${Background})`,
      }}
    >
      <div className="text-box">
        <p>
          Welcome to JobJett, the ultimate destination for seamless recruitment
          and job search. Whether you are an employer seeking top talent or a
          job seeker looking for your next opportunity, we have got you covered.
          Our platform simplifies the recruitment process for employers,
          offering intuitive tools for creating standout job listings, managing
          applications, and communicating with candidates. At the same time, we
          provide job seekers with access to a wide range of exciting
          opportunities from leading companies across industries. Say goodbye to
          traditional recruitment methods and hello to a smarter, more efficient
          way to hire and find jobs. Join JobJett today and take the next step
          in your career journey.
        </p>
      </div>
    </section>
  );
}
export default FirstSection;
