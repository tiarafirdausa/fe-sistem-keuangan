// src/views/page/PageList/PageListTableTools.jsx
import PageListSearch from "./PageListSearch"; 
import usePageList from "../hooks/usePageList";
import cloneDeep from 'lodash/cloneDeep';
import PageTableFilter from "./PageTableFilter"; 

const PageListTableTools = () => {
    const { pageTableData, setPageTableData } = usePageList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(pageTableData);
        newTableData.query = val;
        newTableData.pageIndex = 1;
        setPageTableData(newTableData); 
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <PageListSearch onInputChange={handleInputChange} />
            <PageTableFilter /> 
        </div>
    );
};

export default PageListTableTools;