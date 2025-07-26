import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router-dom'

const MenuItemListActionTools = () => {
    const navigate = useNavigate();
    const { menuId } = useParams(); 

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => navigate(`/admin/menus/${menuId}/items/new`)} 
            >
                Add Menu Item
            </Button>
        </div>
    )
}

export default MenuItemListActionTools;