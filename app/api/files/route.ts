import { NextRequest, NextResponse } from 'next/server';
import { getFilePath, listFiles, hasSpaceAvailable, getStorageInfo } from '@/lib/storage';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

// Helper to get query param
function getQueryParam(req: NextRequest, param: string) {
    const url = new URL(req.url);
    return url.searchParams.get(param) || '';
}

export async function GET(req: NextRequest) {
    try {
        const pathParam = getQueryParam(req, 'path');
        const action = getQueryParam(req, 'action');

        if (action === 'download') {
            const targetPath = getFilePath(pathParam);
            if (!fs.existsSync(targetPath)) {
                return NextResponse.json({ error: 'File not found' }, { status: 404 });
            }

            const stats = await fs.promises.stat(targetPath);
            if (stats.isDirectory()) {
                return NextResponse.json({ error: 'Cannot download directory' }, { status: 400 });
            }

            const fileStream = fs.createReadStream(targetPath);
            // @ts-ignore
            return new NextResponse(fileStream, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(path.basename(targetPath))}`,
                },
            });
        }

        const files = await listFiles(pathParam);
        const { used, limit } = await getStorageInfo();
        return NextResponse.json({ files, usage: used, limit });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const pathParam = getQueryParam(req, 'path');
        const filename = req.headers.get('x-filename');

        if (!filename) {
            return NextResponse.json({ error: 'Filename header required' }, { status: 400 });
        }

        // Decode the filename in case it's URL encoded (for non-ASCII characters)
        const decodedFilename = decodeURIComponent(filename);

        const sizeHeader = req.headers.get('content-length');
        const size = sizeHeader ? parseInt(sizeHeader) : 0;

        if (!(await hasSpaceAvailable(size))) {
            return NextResponse.json({ error: 'Storage quota exceeded (35GB Limit)' }, { status: 507 });
        }

        const targetPath = getFilePath(`${pathParam}/${decodedFilename}`);

        // STREAMING UPLOAD
        // In Next.js App Router, req.body is a ReadableStream (web standard)
        // We need to convert it or use it with file system streams.
        // Node.js fs.createWriteStream expects a Node.js Readable stream or we can iterator over the web stream.

        const fileStream = fs.createWriteStream(targetPath);

        if (req.body) {
            // @ts-ignore - Readable.fromWeb is available in newer Node versions
            const nodeStream = Readable.fromWeb(req.body);
            await pipeline(nodeStream, fileStream);
        } else {
            return NextResponse.json({ error: 'No body provided' }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const pathParam = getQueryParam(req, 'path');
        const body = await req.json();
        const folderName = body.folderName;

        if (!folderName) {
            return NextResponse.json({ error: 'Folder name required' }, { status: 400 });
        }

        // Validate folder name (no special characters that could cause issues)
        const validFolderName = /^[a-zA-Z0-9_\-.\s\uAC00-\uD7AF]+$/.test(folderName);
        if (!validFolderName) {
            return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });
        }

        const targetPath = getFilePath(`${pathParam}/${folderName}`);

        if (fs.existsSync(targetPath)) {
            return NextResponse.json({ error: 'Folder already exists' }, { status: 409 });
        }

        await fs.promises.mkdir(targetPath, { recursive: true });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Create folder error:', error);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const pathParam = getQueryParam(req, 'path');
        const targetPath = getFilePath(pathParam);

        if (fs.existsSync(targetPath)) {
            const stats = await fs.promises.stat(targetPath);
            if (stats.isDirectory()) {
                await fs.promises.rm(targetPath, { recursive: true });
            } else {
                await fs.promises.unlink(targetPath);
            }
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

    } catch (error) {
        console.error('Delete error', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
