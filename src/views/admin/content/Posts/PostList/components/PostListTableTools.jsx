// src/views/post/PostList/PostListTableTools.jsx
import PostListSearch from "./PostListSearch";
import usePostList from "../hooks/usePostList"; 
import cloneDeep from 'lodash/cloneDeep'; 
import PostTableFilter from "./PostTableFilter";

const PostListTableTools = () => {
    const { postTableData, setPostTableData } = usePostList();
    const handleInputChange = (val) => {
        const newTableData = cloneDeep(postTableData);
        newTableData.query = val; 
        newTableData.pageIndex = 1; 

        if (typeof val === 'string' && val.length > 1) {
            setPostTableData(newTableData);
        }

        if (typeof val === 'string' && val.length === 0) {
            setPostTableData(newTableData);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <PostListSearch onInputChange={handleInputChange} />
            <PostTableFilter /> 
        </div>
    );
};

export default PostListTableTools;