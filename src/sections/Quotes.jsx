import { quotes } from "../constants";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

const Quotes = () => {
  return (
    <section id="quotes" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Inspirational Quotes"
          sub="💬 Words that inspired me"
        />

        <div className="lg:columns-3 md:columns-2 columns-1 mt-16">
          {quotes.map((quote, index) => (
            <GlowCard card={quote} key={index} index={index}>
              <div className="flex items-center gap-3">
                <div>
                  <img src={quote.imgPath} alt="" className="w-15 h-15 rounded-full" />
                </div>
                <div>
                  <p className="font-bold">{quote.name}</p>
                  <p className="text-white-50 text-sm">{quote.mentions}</p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Quotes;
