// toast/index.js
import ToastWrapper from './ToastWrapper'
import { PLACEMENT } from '../utils/constants'

export const toastDefaultProps = {
    placement: PLACEMENT.TOP_END,
    offsetX: 30,
    offsetY: 30,
    transitionType: 'scale',
    block: false,
    duration: 3000, // Durasi default
}

const defaultWrapperId = 'default'
const wrappers = new Map()

function castPlacment(placement) {
    if (/\top\b/.test(placement)) {
        return 'top-full'
    }

    if (/\bottom\b/.test(placement)) {
        return 'bottom-full'
    }
}

async function createWrapper(wrapperId, props) {
    const [wrapper] = await ToastWrapper.getInstance(props)

    wrappers.set(wrapperId || defaultWrapperId, wrapper)

    return wrapper
}

function getWrapper(wrapperId) {
    if (wrappers.size === 0) {
        return null
    }
    return wrappers.get(wrapperId || defaultWrapperId)
}

const toast = (message) => toast.push(message)

toast.push = (message, options = {}) => { // Gunakan objek kosong sebagai default untuk menghindari error
    const resolvedOptions = { ...toastDefaultProps, ...options }; // Gabungkan default props dengan opsi yang diberikan

    let id = resolvedOptions.placement
    if (resolvedOptions.block) {
        id = castPlacment(resolvedOptions.placement)
    }

    const wrapper = getWrapper(id)

    if (wrapper?.current) {
        // Panggil push dengan durasi
        return wrapper.current.push(message, resolvedOptions.duration)
    }

    return createWrapper(id ?? '', resolvedOptions).then((ref) => { // Teruskan opsi ke createWrapper
        return ref.current?.push(message, resolvedOptions.duration) // Panggil push dengan durasi
    })
}

toast.remove = (key) => {
    wrappers.forEach((elm) => {
        elm.current.remove(key)
    })
}

toast.removeAll = () => {
    wrappers.forEach((elm) => elm.current.removeAll())
}

export default toast