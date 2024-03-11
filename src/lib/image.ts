const MAX_WIDTH = 400

export const canvasToBlob = (canvas: HTMLCanvasElement, quality = 0.95): Promise<Blob | null> => {
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality));
};

export const resizeImage = async (image: string): Promise<Blob | null> => {
    return new Promise((resolve) => {
        const img = document.createElement('img');

        img.addEventListener('load', async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return;
            }

            let height = img.height;
            let width = img.width;

            if (width > MAX_WIDTH) {
                height = height * (MAX_WIDTH / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            for (let quality = 1; quality > 0; quality -= 0.05) {
                const blob = await canvasToBlob(canvas, quality);
                if ((blob?.size ?? Infinity) <= 31 * 4096) {
                    resolve(blob);
                    return;
                }
            }
        });

        img.src = image;
    });
};
