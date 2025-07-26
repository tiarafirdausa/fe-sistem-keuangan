// src/views/tag/TagList/TagListTableTools.jsx
import useMenuList from "../hooks/useMenuList";
import cloneDeep from 'lodash/cloneDeep';
import MenuListSearch from "./MenuListSearch";


const MenuListTableTools = () => {
    const { menuTableData, setMenuTableData } = useMenuList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(menuTableData);
        newTableData.query = val;
        newTableData.pageIndex = 1;

        if (typeof val === 'string') {
            setMenuTableData(newTableData);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <MenuListSearch onInputChange={handleInputChange} />
        </div>
    );
};

export default MenuListTableTools;