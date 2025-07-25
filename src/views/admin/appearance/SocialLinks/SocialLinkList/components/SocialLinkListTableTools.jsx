import SocialLinkListSearch from "./SocialLinkListSearch";
import useSocialLinkList from "../hooks/useSocialLinkList";
import cloneDeep from 'lodash/cloneDeep';


const SocialLinkListTableTools = () => {
    const { socialLinkTableData, setSocialLinkTableData } = useSocialLinkList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(socialLinkTableData);
        newTableData.query = val;
        newTableData.pageIndex = 1;

        if (typeof val === 'string') {
            setSocialLinkTableData(newTableData);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <SocialLinkListSearch onInputChange={handleInputChange} />
        </div>
    );
};

export default SocialLinkListTableTools;