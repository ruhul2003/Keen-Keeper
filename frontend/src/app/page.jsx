import Banner from '../Components/Banner';
import Counts from '../Components/Counts';
import OverdueAlertBanner from '../Components/OverdueAlertBanner';
import Friends from '../Components/Friends';

export default function HomePage() {
  return (
    <div>
      <Banner />
      <Counts />
      <OverdueAlertBanner />
      <Friends />
    </div>
  );
}
