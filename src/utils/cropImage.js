const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

// Mengubah fungsi ini agar menerima pixelCrop sebagai parameter kedua
const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const dX = pixelCrop.x * scaleX
    const dY = pixelCrop.y * scaleY
    const dWidth = pixelCrop.width * scaleX
    const dHeight = pixelCrop.height * scaleY // Mengatur ukuran canvas agar sesuai dengan hasil crop yang diinginkan

    canvas.width = dWidth
    canvas.height = dHeight

    ctx.drawImage(image, dX, dY, dWidth, dHeight, 0, 0, dWidth, dHeight)

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Canvas is empty')
                reject(new Error('Canvas is empty'))
                return
            }
            resolve(blob)
        }, 'image/jpeg')
    })
}

export default getCroppedImg
