import BannerListSearch from "./BannerListSearch";
import useBannerList from "../hooks/useBannerList";
import cloneDeep from 'lodash/cloneDeep';

const BannerListTableTools = () => {
    const { bannerTableData, setBannerTableData } = useBannerList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(bannerTableData);
        newTableData.query = val;
        newTableData.pageIndex = 1;
        setBannerTableData(newTableData);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <BannerListSearch onInputChange={handleInputChange} />
        </div>
    );
};

export default BannerListTableTools;