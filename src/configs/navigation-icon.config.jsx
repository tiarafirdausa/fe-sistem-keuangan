import {
    PiHouseLineDuotone,
    PiNewspaperDuotone, 
    PiPaletteDuotone,   
    PiUsersDuotone,     
    PiTagDuotone,       
    PiFoldersDuotone,   
    PiChatCenteredTextDuotone, 
    PiImageDuotone,     
    PiListDuotone,      
    PiShareNetworkDuotone, 
    PiGearSixDuotone,   
    PiUserDuotone,  
    PiBookOpenUserDuotone,  
} from 'react-icons/pi'

const navigationIcon = {
    // Dashboard
    dashboard: <PiHouseLineDuotone />,

    // Content Management
    content: <PiNewspaperDuotone />,
    post: <PiNewspaperDuotone />,
    page: <PiBookOpenUserDuotone />, 
    category: <PiFoldersDuotone />,
    tag: <PiTagDuotone />,
    comment: <PiChatCenteredTextDuotone />,
    media: <PiImageDuotone />,

    // Appearance
    appearance: <PiPaletteDuotone />,
    menu: <PiListDuotone />,
    social: <PiShareNetworkDuotone />,
    settings: <PiGearSixDuotone />,

    // User Management
    users: <PiUsersDuotone />,
    user: <PiUserDuotone />,
}

export default navigationIcon