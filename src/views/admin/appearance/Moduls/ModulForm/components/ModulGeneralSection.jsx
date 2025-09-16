import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import Checkbox from '@/components/ui/Checkbox/Checkbox'
import Switcher from '@/components/ui/Switcher/Switcher'

const folderOptions = [
    { label: 'Post Terpopuler', value: 'popular-post' },
    { label: 'Post Terbaru', value: 'recent-post' },
    { label: 'Banner', value: 'banner' },
    { label: 'Media', value: 'media' },
    { label: 'Profil', value: 'profile' },
    { label: 'Link', value: 'link' },
]

const ModulGeneralSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">Informasi Modul</h4>
            <FormContainer>
                <FormItem
                    label="Judul Modul"
                    invalid={Boolean(errors.judul)}
                    errorMessage={errors.judul?.message}
                >
                    <Controller
                        name="judul"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Judul Modul"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Folder"
                    invalid={Boolean(errors.folder)}
                    errorMessage={errors.folder?.message}
                >
                    <Controller
                        name="folder"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Pilih Folder"
                                options={folderOptions}
                                value={folderOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Urutan Tampil"
                    invalid={Boolean(errors.order)}
                    errorMessage={errors.order?.message}
                >
                    <Controller
                        name="order"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                autoComplete="off"
                                placeholder="Urutan"
                                {...field}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10)
                                    field.onChange(isNaN(value) ? '' : value)
                                }}
                            />
                        )}
                    />
                </FormItem>

                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-start gap-1">
                        <label className="text-sm font-semibold">Widget:</label>
                        <Controller
                            name="widget"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <div className="flex items-start gap-1">
                        <label className="text-sm font-semibold">Home:</label>
                        <Controller
                            name="home"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </div>

                <FormItem
                    label="Aktif"
                    invalid={Boolean(errors.aktif)}
                    errorMessage={errors.aktif?.message}
                    className="flex items-start gap-2"
                >
                    <Controller
                        name="aktif"
                        control={control}
                        render={({ field }) => (
                            <Switcher
                                checked={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </FormItem>
            </FormContainer>
        </Card>
    )
}

export default ModulGeneralSection