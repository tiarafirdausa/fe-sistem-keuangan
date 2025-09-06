// src/views/category/CategoryList/components/CategoryListTableTools.jsx
import CategoryListSearch from "./CategoryListSearch";
import useCategoryList from "../hooks/useCategoryList"; // Correctly using the custom hook
import cloneDeep from 'lodash/cloneDeep';
import CategoryImportActionTools from './CategoryImportActionTools'; 

const CategoryListTableTools = () => {
    const { categoryTableData, setCategoryTableData, mutate } = useCategoryList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(categoryTableData);
        newTableData.query = val;
        newTableData.pageIndex = 1;

        setCategoryTableData(newTableData);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CategoryListSearch onInputChange={handleInputChange} />
            <CategoryImportActionTools mutate={mutate} /> 
        </div>
    );
};

export default CategoryListTableTools;