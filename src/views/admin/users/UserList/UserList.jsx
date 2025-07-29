// src/views/content/Users/UserList/UserList.jsx
import { AdaptiveCard, Container } from "@/components/shared"
import UserListActionTools from "./components/UserListActionTools"
import UserListTableTools from "./components/UserListTableTools"
import UserListTable from "./components/UserListTable"
import UserListSelected from "./components/UserListSelected"

const UsersList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>User</h3> 
                            <UserListActionTools/> 
                        </div>
                        <UserListTableTools/>
                        <UserListTable/>
                    </div>
                </AdaptiveCard>
            </Container>
            <UserListSelected/>
        </>
    )
}

export default UsersList