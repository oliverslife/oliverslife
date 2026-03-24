'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Folder, Trash2, Upload, HardDrive, LogOut, Download, ChevronLeft, Search, SortAsc, SortDesc, FolderPlus, X, FileText, Image, Video, Music, Archive, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FileInfo {
    name: string;
    isDirectory: boolean;
    size: number;
    modified: string;
}

export default function Dashboard() {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [currentPath, setCurrentPath] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [usage, setUsage] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [creatingFolder, setCreatingFolder] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const fetchFiles = async (path: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
            if (res.ok) {
                const data = await res.json();
                setFiles(data.files);
                setUsage(data.usage);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles(currentPath);
    }, [currentPath]);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUpload = async (uploadFiles: FileList) => {
        setUploading(true);
        const fileArray = Array.from(uploadFiles);

        for (const file of fileArray) {
            setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

            try {
                const res = await fetch(`/api/files?path=${encodeURIComponent(currentPath)}`, {
                    method: 'POST',
                    headers: {
                        'x-filename': encodeURIComponent(file.name),
                        'content-length': file.size.toString(),
                    },
                    body: file,
                });

                if (res.ok) {
                    setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
                } else {
                    const errorData = await res.json();
                    alert(`Upload Failed: ${file.name} - ${errorData.error || 'Unknown Error'}`);
                }
            } catch {
                alert(`Error: ${file.name}`);
            }
        }

        setUploading(false);
        setUploadProgress({});
        fetchFiles(currentPath);
    };

    const handleDelete = async (filename: string) => {
        if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;
        try {
            const filePath = currentPath ? `${currentPath}/${filename}` : filename;
            const res = await fetch(`/api/files?path=${encodeURIComponent(filePath)}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchFiles(currentPath);
            }
        } catch {
            alert('Delete failed');
        }
    };

    const handleDownload = (filename: string) => {
        const filePath = currentPath ? `${currentPath}/${filename}` : filename;
        const url = `/api/files?path=${encodeURIComponent(filePath)}&action=download`;
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        setCreatingFolder(true);

        try {
            const res = await fetch(`/api/files?path=${encodeURIComponent(currentPath)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderName: newFolderName.trim() }),
            });

            if (res.ok) {
                setNewFolderName('');
                setShowCreateFolder(false);
                fetchFiles(currentPath);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create folder');
            }
        } catch {
            alert('Failed to create folder');
        } finally {
            setCreatingFolder(false);
        }
    };

    const getFileIcon = (filename: string, isDirectory: boolean) => {
        if (isDirectory) return <Folder className="text-[#8B7355]" size={24} strokeWidth={1.5} />;

        const ext = filename.split('.').pop()?.toLowerCase() || '';
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const videoExts = ['mp4', 'webm', 'avi', 'mov', 'mkv'];
        const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
        const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];
        const docExts = ['pdf', 'doc', 'docx', 'txt', 'md', 'xls', 'xlsx'];

        if (imageExts.includes(ext)) return <Image className="text-emerald-600" size={24} strokeWidth={1.5} />;
        if (videoExts.includes(ext)) return <Video className="text-violet-600" size={24} strokeWidth={1.5} />;
        if (audioExts.includes(ext)) return <Music className="text-rose-500" size={24} strokeWidth={1.5} />;
        if (archiveExts.includes(ext)) return <Archive className="text-amber-600" size={24} strokeWidth={1.5} />;
        if (docExts.includes(ext)) return <FileText className="text-blue-600" size={24} strokeWidth={1.5} />;

        return <File className="text-gray-400" size={24} strokeWidth={1.5} />;
    };

    const filteredAndSortedFiles = files
        .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
            let comparison = 0;
            switch (sortBy) {
                case 'name': comparison = a.name.localeCompare(b.name); break;
                case 'size': comparison = a.size - b.size; break;
                case 'modified': comparison = new Date(a.modified).getTime() - new Date(b.modified).getTime(); break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const usagePercent = (usage / (35 * 1024 * 1024 * 1024)) * 100;

    return (
        <div
            className="min-h-screen p-6 lg:p-12 font-sans text-[#2C2C2C] bg-[#F4F1EA]"
            style={{
                backgroundImage: `
                    radial-gradient(circle at 100% 0%, rgba(139, 115, 85, 0.08) 0%, transparent 25%),
                    radial-gradient(circle at 0% 100%, rgba(139, 115, 85, 0.05) 0%, transparent 25%)
                `
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12"
            >
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[#8B7355]/10">
                        <HardDrive className="text-[#8B7355]" size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-light text-[#1A1A1A] tracking-tight" style={{ fontFamily: 'serif' }}>Oliverslife</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="h-px w-8 bg-[#8B7355]/40"></span>
                            <p className="text-[#8B7355] text-xs font-bold tracking-[0.2em] uppercase">File Management System</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full lg:w-auto">
                    <div className="flex-1 lg:flex-none flex items-center gap-5 bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm transition-all hover:shadow-md hover:bg-white/80">
                        <div className="flex-1 lg:w-60">
                            <div className="flex justify-between text-[11px] font-bold text-[#6B6B6B] mb-2 uppercase tracking-wider">
                                <span>Storage Usage</span>
                                <span className={usagePercent > 90 ? 'text-red-500' : 'text-[#8B7355]'}>{Math.round(usagePercent)}%</span>
                            </div>
                            <div className="h-2 bg-[#EAE5DE] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(usagePercent, 100)}%` }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="h-full rounded-full bg-gradient-to-r from-[#8B7355] to-[#Cebfab] relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                </motion.div>
                            </div>
                            <div className="flex justify-between mt-2 text-[11px] font-medium text-[#8B7355]/80">
                                <span>{formatSize(usage)} used</span>
                                <span>35 GB total</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="group p-4 text-[#6B6B6B] hover:text-[#8B7355] bg-white/60 hover:bg-white rounded-full transition-all border border-white/60 hover:border-[#8B7355]/20 shadow-sm hover:shadow-[0_8px_20px_rgb(139,115,85,0.15)]"
                        title="Logout"
                    >
                        <LogOut size={22} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Breadcrumbs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex items-center gap-2 text-sm text-[#6B6B6B]">
                <button
                    onClick={() => setCurrentPath('')}
                    className={`flex items-center gap-1 hover:text-[#8B7355] transition-colors ${!currentPath ? 'text-[#8B7355] font-medium' : ''}`}
                >
                    <Home size={14} /> Home
                </button>
                {currentPath.split('/').map((segment, index, arr) => (
                    <span key={index} className="flex items-center gap-2">
                        <span className="text-[#E0D8CC]">/</span>
                        <button
                            onClick={() => setCurrentPath(arr.slice(0, index + 1).join('/'))}
                            className={`hover:text-[#8B7355] transition-colors ${index === arr.length - 1 ? 'text-[#2C2C2C] font-medium' : ''}`}
                        >
                            {segment}
                        </button>
                    </span>
                ))}
            </motion.div>

            {/* Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative z-10 mb-8 flex flex-col xl:flex-row gap-6 items-stretch xl:items-center justify-between bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm"
            >
                <div className="flex gap-3 flex-wrap">
                    {currentPath && (
                        <button
                            onClick={() => setCurrentPath(currentPath.split('/').slice(0, -1).join('/'))}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E5E0D8] text-[#5A5A5A] rounded-xl hover:bg-[#F9F7F2] hover:border-[#Cebfab] hover:text-[#8B7355] transition-all text-sm font-medium hover:shadow-sm"
                        >
                            <ChevronLeft size={18} /> <span className="hidden sm:inline">Back</span>
                        </button>
                    )}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-6 py-3 bg-[#2C2C2C] text-white rounded-xl hover:bg-[#1a1a1a] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all text-sm font-medium tracking-wide shadow-sm"
                    >
                        <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload File'}
                    </button>
                    <button
                        onClick={() => setShowCreateFolder(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-[#E5E0D8] text-[#5A5A5A] rounded-xl hover:border-[#8B7355]/50 hover:text-[#8B7355] hover:shadow-sm hover:-translate-y-0.5 transition-all text-sm font-medium"
                    >
                        <FolderPlus size={18} /> New Folder
                    </button>
                    <button
                        onClick={() => fetchFiles(currentPath)}
                        disabled={loading}
                        className="p-3 bg-white border border-[#E5E0D8] text-[#6B6B6B] rounded-xl hover:text-[#8B7355] hover:border-[#8B7355]/50 hover:shadow-sm transition-all"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* Search & Sort */}
                <div className="flex gap-3 items-center flex-1 lg:flex-none justify-end">
                    <div className="relative group w-full lg:w-72">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9B9B] group-focus-within:text-[#8B7355] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-5 py-3 bg-white border border-[#E5E0D8] rounded-xl text-sm text-[#2C2C2C] focus:border-[#8B7355]/50 focus:ring-4 focus:ring-[#8B7355]/5 transition-all outline-none placeholder:text-[#BBB] shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'name' | 'size' | 'modified')}
                                className="appearance-none pl-4 pr-9 py-3 bg-white border border-[#E5E0D8] rounded-xl text-sm text-[#5A5A5A] focus:border-[#8B7355]/50 outline-none hover:border-[#Cebfab] transition-colors cursor-pointer shadow-sm min-w-[100px]"
                            >
                                <option value="name">Name</option>
                                <option value="size">Size</option>
                                <option value="modified">Date</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9B9B9B]">
                                <ChevronLeft size={14} className="-rotate-90" />
                            </div>
                        </div>
                        <button
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="p-3 bg-white border border-[#E5E0D8] rounded-xl hover:border-[#8B7355]/50 hover:text-[#8B7355] hover:shadow-sm transition-all text-[#6B6B6B]"
                        >
                            {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                        </button>
                    </div>
                </div>

                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => e.target.files && handleUpload(e.target.files)} />
            </motion.div>

            {/* Upload Progress */}
            {Object.keys(uploadProgress).length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-white border border-[#E0D8CC] rounded-md shadow-sm">
                    <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-3">Uploading...</h4>
                    {Object.entries(uploadProgress).map(([name, progress]) => (
                        <div key={name} className="mb-3 last:mb-0">
                            <div className="flex justify-between text-xs text-[#6B6B6B] mb-1">
                                <span className="truncate max-w-[200px] font-medium">{name}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1 bg-[#F5F0E8] rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-300 bg-[#8B7355]" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Create Folder Modal */}
            <AnimatePresence>
                {showCreateFolder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#0a0a0f]/20 backdrop-blur-sm"
                            onClick={() => setShowCreateFolder(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="relative w-full max-w-sm bg-white p-6 rounded-lg shadow-xl border border-[#E0D8CC]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-serif text-[#2C2C2C]">New Folder</h3>
                                <button onClick={() => setShowCreateFolder(false)} className="text-[#9B9B9B] hover:text-[#2C2C2C]"><X size={20} /></button>
                            </div>
                            <input
                                type="text"
                                placeholder="Folder Name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                                className="w-full px-4 py-3 bg-[#F9F7F2] border border-[#E0D8CC] rounded-md text-[#2C2C2C] focus:border-[#8B7355] transition-all placeholder:text-[#BBB] mb-6 outline-none"
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button onClick={() => setShowCreateFolder(false)} className="flex-1 px-4 py-2.5 bg-white border border-[#E0D8CC] text-[#6B6B6B] rounded-md hover:bg-[#F9F7F2]">Cancel</button>
                                <button
                                    onClick={handleCreateFolder}
                                    disabled={creatingFolder || !newFolderName.trim()}
                                    className="flex-1 px-4 py-2.5 bg-[#2C2C2C] text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-all font-medium"
                                >
                                    {creatingFolder ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content: File List */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white/50 border border-white/60 rounded-2xl p-6 h-40 animate-pulse" />
                    ))
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredAndSortedFiles.map((file, index) => (
                            <motion.div
                                key={file.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.03 }}
                                layout
                                className="group relative bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-6 cursor-pointer hover:bg-white hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 ring-1 ring-transparent hover:ring-[#8B7355]/10"
                                onClick={() => file.isDirectory ? setCurrentPath(currentPath ? `${currentPath}/${file.name}` : file.name) : null}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-gradient-to-br from-[#F9F7F2] to-[#F1EDE6] rounded-xl group-hover:from-[#F5F0E8] group-hover:to-[#EAE4D9] transition-colors shadow-inner">
                                        {getFileIcon(file.name, file.isDirectory)}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                                        {!file.isDirectory && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDownload(file.name); }}
                                                className="p-2 text-[#6B6B6B] hover:text-[#8B7355] hover:bg-[#F5F0E8] rounded-lg transition-all"
                                                title="Download"
                                            >
                                                <Download size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(file.name); }}
                                            className="p-2 text-[#6B6B6B] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3
                                        className="font-semibold text-[#2C2C2C] truncate mb-2 text-base group-hover:text-[#8B7355] transition-colors"
                                        title={file.name}
                                    >
                                        {file.name}
                                    </h3>
                                    <div className="flex justify-between items-center text-xs font-medium text-[#9B9B9B] uppercase tracking-wide">
                                        <span className="bg-[#F0EEE9] px-2 py-1 rounded text-[#7A7A7A]">
                                            {file.isDirectory ? 'Folder' : formatSize(file.size)}
                                        </span>
                                        <span>{formatDate(file.modified)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {!loading && filteredAndSortedFiles.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full flex flex-col items-center justify-center p-20 border-2 border-dashed border-[#E0D8CC] rounded-xl bg-white/50">
                        <div className="p-4 bg-[#F5F0E8] rounded-full mb-4">
                            <Upload size={32} className="text-[#8B7355]" />
                        </div>
                        <p className="text-lg font-serif text-[#2C2C2C] mb-1">{searchQuery ? 'No results found' : 'This folder is empty'}</p>
                        <p className="text-sm text-[#6B6B6B]">{searchQuery ? 'Try different keywords' : 'Drag files here or start a new upload'}</p>
                    </motion.div>
                )}
            </div>

            {/* Drag Overlay */}
            <AnimatePresence>
                {dragActive && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#8B7355]/90 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
                        <div className="p-10 border-4 border-white border-dashed rounded-xl text-center">
                            <Upload size={64} className="text-white mx-auto mb-6" />
                            <h2 className="text-3xl font-serif text-white mb-2">Drop files here</h2>
                            <p className="text-white/80 uppercase tracking-widest text-sm">to upload instantly</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
