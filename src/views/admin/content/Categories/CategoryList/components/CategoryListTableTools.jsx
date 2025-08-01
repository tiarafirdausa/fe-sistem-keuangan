import CategoryListSearch from "./CategoryListSearch";
import useCategoryList from "../hooks/useCategoryList";
import cloneDeep from 'lodash/cloneDeep';


const CategoryListTableTools = () => {
    const { categoryTableData, setCategoryTableData } = useCategoryList();

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(categoryTableData);
        newTableData.query = val;
        newTableData.pageIndex = 1;

        setCategoryTableData(newTableData);

    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CategoryListSearch onInputChange={handleInputChange} />
        </div>
    );
};

export default CategoryListTableTools;