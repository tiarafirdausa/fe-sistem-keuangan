// src/views/category/CategoryList/CategoryListSearch.jsx
import Input from '@/components/ui/Input';
import useDebounce from '@/utils/hooks/useDebounce';
import { HiOutlineSearch } from 'react-icons/hi'; 

const CategoryListSearch = (props) => {
    const { onInputChange } = props;

    function handleDebounceFn(value) {
        onInputChange?.(value);
    }

    const debounceFn = useDebounce(handleDebounceFn, 500);

    const handleInputChange = (e) => {
        debounceFn(e.target.value);
    };

    return (
        <Input
            placeholder="Search"
            suffix={<HiOutlineSearch className="text-lg" />}
            onChange={handleInputChange}
        />
    );
};

export default CategoryListSearch;