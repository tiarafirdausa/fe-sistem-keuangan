// src/views/admin/content/Pages/PageForm/index.jsx (Updated)
import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import PageGeneralSection from './components/PageGeneralSection'
import PageImageSection from './components/PageImageSection'
import PageSeoSection from './components/PageSeoSection'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import { PAGE_DEFAULT_VALUES, PAGE_VALIDATION_SCHEMA } from './constants'

const PageForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = PAGE_DEFAULT_VALUES,
        children,
    } = props

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        defaultValues,
        resolver: zodResolver(PAGE_VALIDATION_SCHEMA),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const onSubmit = (values) => {
        const formData = new FormData()

        for (const key in values) {
            if (
                key === 'featured_image' ||
                key === 'gallery_images' ||
                key === 'delete_gallery_image_ids' ||
                key === 'clear_featured_image' ||
                key === 'clear_gallery_images'
            ) {
                continue
            }

            if (values[key] !== undefined && values[key] !== null) {
                if (values[key] instanceof Date) {
                    formData.append(key, values[key].toISOString())
                } else if (typeof values[key] === 'boolean') {
                    formData.append(key, values[key] ? 'true' : 'false')
                } else {
                    formData.append(key, values[key])
                }
            }
        }

        if (
            values.featured_image &&
            values.featured_image.file instanceof File
        ) {
            formData.append('featured_image', values.featured_image.file)
        }

        values.gallery_images.forEach((image) => {
            if (image.file) {
                formData.append('gallery_images', image.file)
            }
        })

        if (getValues('delete_gallery_image_ids')?.length > 0) {
            formData.append(
                'delete_gallery_image_ids',
                JSON.stringify(getValues('delete_gallery_image_ids')),
            )
        }

        formData.append(
            'clear_featured_image',
            getValues('clear_featured_image') ? 'true' : 'false',
        )
        formData.append(
            'clear_gallery_images',
            getValues('clear_gallery_images') ? 'true' : 'false',
        )

        onFormSubmit?.(formData)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="xl:flex-1">
                        <div className="flex flex-col gap-4">
                            <PageGeneralSection
                                control={control}
                                errors={errors}
                            />
                            <PageImageSection
                                control={control}
                                errors={errors}
                                setValue={setValue}
                                getValues={getValues}
                            />
                        </div>
                    </div>
                    <div className="xl:flex-col xl:w-[320px] lg:w-full">
                        <div className="flex flex-col gap-4">
                            <PageSeoSection control={control} errors={errors} />
                        </div>
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default PageForm