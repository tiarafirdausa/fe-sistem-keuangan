import PostListSearch from "./PostListSearch";
import PostTableFilter from "./PostTableFilter";
import usePostList from "../hooks/usePostList";
import cloneDeep from 'lodash/cloneDeep'

const PostListTableTools = () => {
    const { tableData, setTableData } = usePostList()

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val 
        newTableData.pageIndex = 1

        if (typeof val === 'string' && val.length > 1) {
            setTableData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            setTableData(newTableData)
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <PostListSearch onInputChange={handleInputChange} />
            <PostTableFilter />
        </div>
    )
}

export default PostListTableTools
