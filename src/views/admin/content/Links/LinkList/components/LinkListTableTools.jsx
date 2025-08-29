import LinkListSearch from './LinkListSearch';
import useLinkList from '../hooks/useLinkList';
import cloneDeep from 'lodash/cloneDeep';

const LinkListTableTools = () => {
    const { linkTableData, setLinkTableData } = useLinkList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(linkTableData);
        newTableData.query = val;
        newTableData.pageIndex = 1;
        setLinkTableData(newTableData);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <LinkListSearch onInputChange={handleInputChange} />
        </div>
    );
};

export default LinkListTableTools;