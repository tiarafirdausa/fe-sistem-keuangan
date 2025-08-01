import useMenuItemList from '../hooks/useMenuItemList';
import cloneDeep from 'lodash/cloneDeep';
import MenuItemListSearch from './MenuItemListSearch'; 

const MenuItemListTableTools = ({menuId}) => {
    const { menuItemTableData, setMenuItemTableData } = useMenuItemList(menuId);

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(menuItemTableData);
        newTableData.query = val;
        newTableData.pageIndex = 1;

        if (typeof val === 'string') {
            setMenuItemTableData(newTableData);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <MenuItemListSearch onInputChange={handleInputChange} />
        </div>
    );
};

export default MenuItemListTableTools;