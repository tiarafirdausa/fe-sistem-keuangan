import MediaCategoryListSearch from "./MediaCategoryListSearch";
import useMediaCategoryList from "../hooks/useMediaCategoryList";
import cloneDeep from 'lodash/cloneDeep';

const MediaCategoryListTableTools = () => {
    const { mediaCategoryTableData, setMediaCategoryTableData } = useMediaCategoryList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(mediaCategoryTableData);
        newTableData.query = val;
        newTableData.pageIndex = 1;
        setMediaCategoryTableData(newTableData);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <MediaCategoryListSearch onInputChange={handleInputChange} />
        </div>
    );
};

export default MediaCategoryListTableTools;