import { AdaptiveCard, Container } from "@/components/shared";
import BannerListActionTools from "./components/BannerListActionTools";
import BannerListTableTools from "./components/BannerListTableTools";
import BannerListTable from "./components/BannerListTable";
import BannerListSelected from "./components/BannerListSelected";

const BannerList = () => {
  return (
    <>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>Banners</h3>
              <BannerListActionTools />
            </div>
            <BannerListTableTools />
            <BannerListTable />
          </div>
        </AdaptiveCard>
      </Container>
      <BannerListSelected />
    </>
  );
};

export default BannerList;