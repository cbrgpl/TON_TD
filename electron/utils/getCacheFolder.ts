import os from 'os'
import path from 'path'

export const getCacheFolder = () => {
    const platform = os.platform();

    switch (platform) {
        case 'win32':
            return path.join(process.env.APPDATA, 'TonTs');

        case 'darwin':
            return path.join(process.env.HOME, 'Library', 'Caches', 'TonTs');

        case 'linux':
            return path.join(process.env.HOME, '.cache', 'TonTs');

        default:
            throw new Error('Unsupported platform: ' + platform);
    }
}
