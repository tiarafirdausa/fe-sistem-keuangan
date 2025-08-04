// src/views/comment/CommentList/CommentListTableTools.js
import CommentListSearch from "./CommentListSearch"; 
import useCommentList from "../hooks/useCommentList";
import cloneDeep from 'lodash/cloneDeep';
import CommentTableFilter from "./CommentTableFilter"; 

const CommentListTableTools = () => {
    const { commentTableData, setCommentTableData } = useCommentList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(commentTableData);
        newTableData.query = val; 
        newTableData.pageIndex = 1; 
        setCommentTableData(newTableData); 
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CommentListSearch onInputChange={handleInputChange} />
            <CommentTableFilter /> 
        </div>
    );
};

export default CommentListTableTools;
