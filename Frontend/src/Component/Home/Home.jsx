import React from "react";
import { useNavigate } from "react-router-dom";
import AboutUs from "../AboutUs/AboutUs";
import ContactUs from "../ContactUs/ContactUs";

function Home() {
  const navigate = useNavigate();
  return (
    <>
     <div className="container mx-auto px-4 py-10">
  <h2 className="text-2xl font-bold text-center mb-8">Event Highlights</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
    {[
      {
        src: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
        title: "Rocking Concert",
        desc: "An electrifying night with stunning performances.",
        btn: "View Gallery"
      },
      {
        src: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg",
        title: "Backstage Moments",
        desc: "Behind-the-scenes shots from your favorite artists.",
        btn: "Explore"
      },
      {
        src: "https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg",
        title: "Crowd Vibes",
        desc: "The energy of thousands captured in one frame.",
        btn: "See More"
      },
      {
        src: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg",
        title: "Sunset Stage",
        desc: "A magical performance as the sun sets.",
        btn: "Experience"
      }
    ].map((card, index) => (
      <div key={index} className="card bg-base-100 w-80 shadow-sm">
        <figure>
          <img src={card.src} alt={card.title} className="h-48 w-full object-cover" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{card.title}</h2>
          <p>{card.desc}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>{card.btn}</button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      {/* About Us Section */}
      <AboutUs />
      {/* Contact Us Section */}
      <ContactUs />
    </>
  );
}

export default Home;
