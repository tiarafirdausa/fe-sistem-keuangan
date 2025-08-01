// src/views/content/Users/UserList/components/UserListTableTools.jsx
import UserListSearch from "./UserListSearch"; 
import useUserList from "../hooks/useUserList";
import cloneDeep from 'lodash/cloneDeep';
import UserTableFilter from "./UserTableFilter"; 

const UserListTableTools = () => {
    const { userTableData, setUserTableData } = useUserList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(userTableData);
        newTableData.query = val; 
        newTableData.pageIndex = 1; 
        setUserTableData(newTableData);
        
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <UserListSearch onInputChange={handleInputChange} />
            <UserTableFilter />
        </div>
    );
};

export default UserListTableTools;