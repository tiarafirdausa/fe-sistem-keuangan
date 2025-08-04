import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import Select, { Option as DefaultOption } from '@/components/ui/Select';
import { components } from 'react-select';
import { Form, FormItem } from '@/components/ui/Form';
import { TbFilter } from 'react-icons/tb';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classNames from '@/utils/classNames';
import useCommentList from '../hooks/useCommentList';

const { Control } = components;

const commentStatusOption = [
    { value: 'pending', label: 'Pending', className: 'bg-yellow-500' },
    { value: 'approved', label: 'Approved', className: 'bg-emerald-500' },
    { value: 'spam', label: 'Spam', className: 'bg-red-500' },
];

const CustomStatusSelectOption = (props) => {
    return (
        <DefaultOption
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <span className={classNames('w-2 h-2 rounded-full', data.className)} />
                    <span className="ml-2 rtl:mr-2">{label}</span>
                </span>
            )}
        />
    );
};

const CustomStatusControl = ({ children, ...props }) => {
    const selected = props.getValue()[0];
    return (
        <Control {...props}>
            {selected && (
                <span className={classNames('w-2 h-2 rounded-full ml-4', selected.className)} />
            )}
            {children}
        </Control>
    );
};

const validationSchema = z.object({
    status: z.string().optional(),
});

const CommentTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false);
    const { commentFilterData, setCommentFilterData } = useCommentList();

    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            status: commentFilterData.status || '',
        },
        resolver: zodResolver(validationSchema),
    });

    useEffect(() => {
        if (filterIsOpen) {
            reset({
                status: commentFilterData.status || '',
            });
        }
    }, [filterIsOpen, commentFilterData, reset]);

    const onSubmit = (values) => {
        setCommentFilterData({
            ...commentFilterData,
            status: values.status,
            pageIndex: 1, 
        });
        setFilterIsOpen(false);
    };

    const handleClearFilters = () => {
        reset({
            status: '',
        });
        setCommentFilterData({
            ...commentFilterData,
            status: '',
            pageIndex: 1, 
        });
        setFilterIsOpen(false);
    };

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setFilterIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter Komentar"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                onRequestClose={() => setFilterIsOpen(false)}
            >
                <Form
                    className="h-full"
                    containerClassName="flex flex-col justify-between h-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <FormItem label="Status Komentar">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={commentStatusOption}
                                        {...field}
                                        value={commentStatusOption.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        components={{
                                            Option: CustomStatusSelectOption,
                                            Control: CustomStatusControl,
                                        }}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <Button
                            variant="plain"
                            type="button"
                            onClick={handleClearFilters}
                        >
                            Remove All
                        </Button>
                        <Button variant="solid" type="submit">
                            Apply Filters
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </>
    );
};

export default CommentTableFilter;
