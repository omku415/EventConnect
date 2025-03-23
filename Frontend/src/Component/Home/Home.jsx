import React from "react";
import AboutUs from "../AboutUs/AboutUs";
import ContactUs from "../ContactUs/ContactUs";

function Home() {
  return (
    <>
      <div className="carousel w-full">
        <div id="item1" className="carousel-item w-full">
          <img
            src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            className="w-full h-[500px]"
            alt="Concert Audience"
          />
        </div>
        <div id="item2" className="carousel-item w-full">
          <img
            src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            className="w-full h-[500px] "
          />
        </div>
        <div id="item3" className="carousel-item w-full">
          <img
            src="https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            className="w-full h-[500px]"
          />
        </div>
        <div id="item4" className="carousel-item w-full">
          <img
            src="https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            className="w-full h-[500px]"
          />
        </div>
      </div>
      <div className="flex w-full justify-center gap-2 py-2">
        <a href="#item1" className="btn btn-xs">
          1
        </a>
        <a href="#item2" className="btn btn-xs">
          2
        </a>
        <a href="#item3" className="btn btn-xs">
          3
        </a>
        <a href="#item4" className="btn btn-xs">
          4
        </a>
      </div>
      {/* About Us Section */}
      <AboutUs />
      {/* Contact Us Section */}
      <ContactUs />
    </>
  );
}

export default Home;
