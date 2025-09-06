// src/views/category/CategoryList/components/CategoryImportActionTools.jsx

import { useRef } from 'react';
import Button from '@/components/ui/Button';
import { BiImport } from 'react-icons/bi';
import { apiImportCategories } from '@/services/CategoryService';
import { toast } from '@/components/ui/toast';
import { FaShapes } from 'react-icons/fa';
import Notification from '@/components/ui/Notification';
import Avatar from '@/components/ui/Avatar';

// Receive mutate as a prop
const CategoryImportActionTools = ({ mutate }) => {
    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'application/vnd.ms-excel') {
            toast.push(<Notification type="danger" title="Invalid File Type">Please upload a valid .xlsx or .xls file.</Notification>, { placement: 'top-center' });
            return;
        }

        try {
            await apiImportCategories(file);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<FaShapes />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Categories imported successfully!</span>
                </div>,
                { duration: 3000 }
            );
            
            // Call the mutate function received as a prop
            if (mutate) {
                mutate();
            } else {
                console.error('Mutate function is not available.');
            }
        } catch (error) {
            console.error('Failed to import categories:', error);
            toast.push(
                <Notification type="danger" title="Import Failed">
                    Failed to import categories. Please check the file and try again.
                </Notification>,
                { placement: 'top-center' }
            );
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
            />
            <Button
                variant="twoTone"
                icon={<BiImport className="text-xl" />}
                onClick={handleImportClick}
            />
        </>
    );
};

export default CategoryImportActionTools;