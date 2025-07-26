// src/views/admin/appearance/Menus/MenuList/MenuList.jsx
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import MenuListTable from './components/MenuListTable' // Import komponen tabel menu
// import MenuListActionTools from './components/MenuListActionTools' // Komponen tools aksi untuk daftar menu
// import MenuListSelected from './components/MenuListSelected' // Komponen untuk seleksi multi menu
// import MenuListTableTools from './components/MenuListTableTools' // Komponen tools tabel untuk daftar menu

const MenuList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Menus</h3> 
                            {/* <MenuListActionTools />  */}
                        </div>
                        {/* <MenuListTableTools />  */}
                        <MenuListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            {/* <MenuListSelected/> */}
        </>
    )
}

export default MenuList