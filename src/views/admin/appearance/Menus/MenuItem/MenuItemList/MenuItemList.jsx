// src/views/admin/appearance/Menus/MenuItems/MenuItemList/MenuItemList.jsx
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import MenuItemListTable from './components/MenuItemListTable'
import { useParams } from 'react-router-dom'; 
import useMenuList from '../../MenuList/hooks/useMenuList'; 

const MenuItemList = () => {
    const { menuId } = useParams(); 

    const { menuList } = useMenuList();
    const currentMenu = menuList.find(menu => menu.id === parseInt(menuId));
    const menuTitle = currentMenu ? `Menu Items for "${currentMenu.name}"` : 'Menu Items';

    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:flex-wrap md:justify-between gap-2">
                            <h3>{menuTitle}</h3>
                            {/* <MenuItemListActionTools /> */}
                        </div>
                        {/* <MenuItemListTableTools /> */}
                        <MenuItemListTable menuId={menuId} /> {/* <-- SANGAT PENTING: Melewatkan menuId */}
                    </div>
                </AdaptiveCard>
            </Container>
            {/* <MenuItemListSelected/> */}
        </>
    )
}

export default MenuItemList