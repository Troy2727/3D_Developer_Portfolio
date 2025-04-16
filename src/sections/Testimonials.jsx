import { testimonials } from "../constants";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

const Testimonials = () => {
  return (
    <section id="testimonials" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="What People Say About Me?"
          sub="⭐️ Customer feedback highlights"
        />

        <div className="grid-3-cols mt-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="h-full flex flex-col">
              <GlowCard card={testimonial} index={index}>
                <div className="flex items-center gap-3 mt-auto">
                  <div className={`${testimonial.imgPath.includes("mit-logo") ? "bg-white p-1 rounded-full" : ""}`}>
                    <img
                      src={testimonial.imgPath}
                      alt=""
                      className={`${testimonial.imgPath.includes("mit-logo") ? "w-12 h-12 object-contain" : "w-12 h-12 object-cover rounded-full"}`}
                    />
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-white-50 text-sm">{testimonial.mentions}</p>
                  </div>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
