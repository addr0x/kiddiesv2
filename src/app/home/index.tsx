import HeroPage from "./hero";
import About from "./about";
import ActivityRoadmap from "./activity_roadmap";
import PastWinners from "./past_winners";
import Humanitarian from "./humanitarian";
import Footer from "@/src/components/footer";

export default function Home() {
  return (
    <main className="fb-col-wrapper space-y-12">
      <HeroPage />
      <ActivityRoadmap />
      <About />
      <Humanitarian />
      <PastWinners />
      <Footer />
    </main>
  );
}
