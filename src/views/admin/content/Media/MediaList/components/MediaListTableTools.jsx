import MediaListSearch from "./MediaListSearch";
import MediaTableFilter from "./MediaTableFilter";
import useMediaList from "../hooks/useMediaList";
import cloneDeep from 'lodash/cloneDeep';

const MediaListTableTools = () => {
    const { mediaTableData, setMediaTableData } = useMediaList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(mediaTableData);
        newTableData.query = val;
        newTableData.pageIndex = 1;
        setMediaTableData(newTableData);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <MediaListSearch onInputChange={handleInputChange} />
            <MediaTableFilter />
        </div>
    );
};

export default MediaListTableTools;