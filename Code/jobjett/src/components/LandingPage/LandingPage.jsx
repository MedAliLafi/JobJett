import FirstSection from "./FirstSection/First-Section";
import Left from "./Left-Photo/left";
import Right from "./Right-Photo/right";
import image1 from "../../assets/HR-careers-01.png";
import image2 from "../../assets/NA_October_10.jpg";
import image3 from "../../assets/5052521.jpg";
import LandingNavbar from "./Navbar/Navbar";

function LandingPage2() {
  return (
    <>
      <LandingNavbar></LandingNavbar>
      <FirstSection></FirstSection>
      <Left
        id="GetJob"
        title="Find Your Dream Job"
        image={image1}
        parg="Embark on your career journey with JobJett. Our platform connects talented individuals like you with exciting job opportunities from leading companies across industries. Whether you are a recent graduate eager to kickstart your career or a seasoned professional seeking new challenges, we have got the resources and support you need to succeed. Explore a wide range of job listings, from entry-level positions to executive roles, and take the next step towards achieving your professional goals. With JobJett, finding your dream job has never been easier. Join us today and unlock endless possibilities for your future."
      ></Left>
      <Right
        id="FindJob"
        title="Post Your Job Opportunity"
        image={image2}
        parg="At JobJett, we understand the importance of finding the right talent to drive your business forward. With our streamlined job posting process, you can reach a vast pool of qualified candidates quickly and efficiently. Whether you are a small startup looking to expand your team or a large corporation seeking top talent, our platform offers the tools and resources you need to attract the best candidates for your job openings. From creating compelling job listings to managing applications with ease, we are here to support you every step of the way. Experience the power of effective recruitment with JobJett. Post your job opportunity today and discover your next great hire."
      ></Right>
      <Left
        id="2"
        title="Craft Your Professional resume with Ease"
        image={image3}
        parg="Create a standout CV effortlessly with JobJett. Our intuitive CV builder empowers you to tailor your resume to your career goals. Choose from customizable templates, personalize your content, and preview your CV in real-time. Say goodbye to formatting issues – our platform takes care of the details so you can focus on showcasing your strengths. With built-in tips and guidance, crafting a professional CV has never been easier. Start building your professional identity today with JobJett."
      ></Left>
    </>
  );
}
export default LandingPage2;
