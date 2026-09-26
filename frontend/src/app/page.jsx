import Banner from '../Components/Banner';
import Counts from '../Components/Counts';
import OverdueAlertBanner from '../Components/OverdueAlertBanner';
import UpcomingBirthdaysBanner from '../Components/UpcomingBirthdaysBanner';
import Friends from '../Components/Friends';

export default function HomePage() {
  return (
    <div>
      <Banner />
      <Counts />
      <UpcomingBirthdaysBanner />
      <OverdueAlertBanner />
      <Friends />
    </div>
  );
}
