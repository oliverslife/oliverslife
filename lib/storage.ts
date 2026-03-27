import fs from 'fs';
import path from 'path';

const STORAGE_ROOT = path.join(process.cwd(), 'storage');
const MAX_STORAGE_SIZE = 35 * 1024 * 1024 * 1024; // 35GB

// Ensure storage root exists
if (!fs.existsSync(STORAGE_ROOT)) {
    fs.mkdirSync(STORAGE_ROOT, { recursive: true });
}

export function getStorageRoot() {
    return STORAGE_ROOT;
}

export function getFilePath(relativePath: string) {
    // Clean path to prevent directory traversal
    // Remove leading slashes and resolve to storage root
    const cleanPath = relativePath.replace(/^\/+/, '');
    const resolvedPath = path.join(STORAGE_ROOT, cleanPath);

    if (!resolvedPath.startsWith(STORAGE_ROOT)) {
        throw new Error('Invalid path access');
    }
    return resolvedPath;
}

export async function getDirectorySize(dirPath: string): Promise<number> {
    let size = 0;
    try {
        const files = await fs.promises.readdir(dirPath, { withFileTypes: true });

        for (const file of files) {
            const filePath = path.join(dirPath, file.name);
            if (file.isDirectory()) {
                size += await getDirectorySize(filePath);
            } else {
                const stats = await fs.promises.stat(filePath);
                size += stats.size;
            }
        }
    } catch (error) {
        console.error('Error calculating directory size:', error);
    }
    return size;
}

export async function getStorageInfo() {
    const used = await getDirectorySize(STORAGE_ROOT);
    let total = MAX_STORAGE_SIZE;
    try {
        // Use fs.promises.statfs if supported (Node >= 19.6.0)
        // @ts-ignore
        if (typeof fs.promises.statfs === 'function') {
            // @ts-ignore
            const stats = await fs.promises.statfs(STORAGE_ROOT);
            total = stats.blocks * stats.bsize;
        }
    } catch (e) {
        console.error('statfs not supported, using default MAX_STORAGE_SIZE');
    }
    
    const limit = total * 0.9; // 90% of total capacity
    return { used, total, limit };
}

export async function getTotalUsage(): Promise<number> {
    return getDirectorySize(STORAGE_ROOT);
}

export async function hasSpaceAvailable(fileSize: number): Promise<boolean> {
    const { used, limit } = await getStorageInfo();
    return (used + fileSize) <= limit;
}

export interface FileInfo {
    name: string;
    isDirectory: boolean;
    size: number;
    modified: Date;
}

export async function listFiles(relativePath: string): Promise<FileInfo[]> {
    const targetPath = getFilePath(relativePath);

    if (!fs.existsSync(targetPath)) {
        return [];
    }

    const items = await fs.promises.readdir(targetPath, { withFileTypes: true });

    const fileInfos: FileInfo[] = [];

    for (const item of items) {
        let size = 0;
        const fullPath = path.join(targetPath, item.name);
        const stats = await fs.promises.stat(fullPath);

        if (!item.isDirectory()) {
            size = stats.size;
        }

        fileInfos.push({
            name: item.name,
            isDirectory: item.isDirectory(),
            size: size,
            modified: stats.mtime
        });
    }

    return fileInfos;
}
