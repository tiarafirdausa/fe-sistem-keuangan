import { create } from 'zustand'

export const initialModulTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialModulFilterData = {
    search: '',
}

const initialModulState = {
    modulTableData: initialModulTableData,
    modulFilterData: initialModulFilterData,
    selectedModuls: [],
}

export const useModulListStore = create((set) => ({
    ...initialModulState,
    setModulFilterData: (payload) => set(() => ({ modulFilterData: payload })),
    setModulTableData: (payload) => set(() => ({ modulTableData: payload })),
    setSelectedModuls: (checked, modul) =>
        set((state) => {
            const prevSelectedModuls = state.selectedModuls
            if (checked) {
                if (
                    !prevSelectedModuls.some(
                        (prevModul) => modul.id_modul === prevModul.id_modul,
                    )
                ) {
                    return { selectedModuls: [...prevSelectedModuls, modul] }
                }
            } else {
                return {
                    selectedModuls: prevSelectedModuls.filter(
                        (prevModul) => prevModul.id_modul !== modul.id_modul,
                    ),
                }
            }
            return { selectedModuls: prevSelectedModuls }
        }),
    setSelectAllModuls: (moduls) => set(() => ({ selectedModuls: moduls })),
    resetModulListStore: () => set(initialModulState),
}))
