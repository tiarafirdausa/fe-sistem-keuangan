// src/views/tag/TagList/TagListTableTools.jsx
import TagListSearch from "./TagListSearch";
import useTagList from "../hooks/useTagList"; 
import cloneDeep from 'lodash/cloneDeep';


const TagListTableTools = () => {
    const { tagTableData, setTagTableData } = useTagList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(tagTableData); 
        newTableData.query = val;
        newTableData.pageIndex = 1; 

        if (typeof val === 'string' && val.length > 1) {
            setTagTableData(newTableData);
        }

        if (typeof val === 'string' && val.length === 0) {
            setTagTableData(newTableData);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <TagListSearch onInputChange={handleInputChange} />
        </div>
    );
};

export default TagListTableTools;