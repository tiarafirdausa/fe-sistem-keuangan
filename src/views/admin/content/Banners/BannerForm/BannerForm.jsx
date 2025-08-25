import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import BannerGeneralSection from './components/BannerGeneralSection'
import BannerImageSection from './components/BannerImageSection'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import { BANNER_DEFAULT_VALUES, BANNER_VALIDATION_SCHEMA } from './constants'

const BannerForm = (props) => {
    const { onFormSubmit, defaultValues = BANNER_DEFAULT_VALUES, children } = props

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        defaultValues,
        resolver: zodResolver(BANNER_VALIDATION_SCHEMA),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const onSubmit = (values) => {
        const formData = new FormData()

        for (const key in values) {
            if (key === 'gambar' || key === 'clear_gambar') {
                continue
            }

            if (values[key] !== undefined && values[key] !== null) {
                if (typeof values[key] === 'boolean') {
                    formData.append(key, values[key] ? 'true' : 'false')
                } else {
                    formData.append(key, values[key])
                }
            }
        }

        if (values.gambar && values.gambar.file instanceof File) {
            formData.append('gambar', values.gambar.file)
        }

        if (getValues('clear_gambar')) {
            formData.append('clear_gambar', 'true')
        }

        onFormSubmit?.(formData)
    }

    return (
        <Form
            className="flex flex-col w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="xl:flex-1">
                        <div className="flex flex-col gap-4">
                            <BannerGeneralSection
                                control={control}
                                errors={errors}
                            />
                            <BannerImageSection
                                control={control}
                                errors={errors}
                                setValue={setValue}
                                getValues={getValues}
                            />
                        </div>
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default BannerForm