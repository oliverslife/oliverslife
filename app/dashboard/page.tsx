'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Folder, Trash2, Upload, HardDrive, LogOut, Download, ChevronLeft, Search, SortAsc, SortDesc, FolderPlus, X, FileText, Image, Video, Music, Archive, RefreshCw, Home, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
    const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
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
                await axios.post(`/api/files?path=${encodeURIComponent(currentPath)}`, file, {
                    headers: {
                        'x-filename': encodeURIComponent(file.name),
                        'content-length': file.size.toString(),
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(prev => ({ ...prev, [file.name]: percentCompleted }));
                        }
                    }
                });
            } catch {
                alert(`Error uploading: ${file.name}`);
            }
        }

        setUploading(false);
        setTimeout(() => setUploadProgress({}), 3000);
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

    const handleDownload = async (filename: string) => {
        const filePath = currentPath ? `${currentPath}/${filename}` : filename;
        const url = `/api/files?path=${encodeURIComponent(filePath)}&action=download`;
        
        setDownloadProgress(prev => ({ ...prev, [filename]: 0 }));

        try {
            const response = await axios.get(url, {
                responseType: 'blob',
                onDownloadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setDownloadProgress(prev => ({ ...prev, [filename]: percentCompleted }));
                    }
                }
            });

            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            alert('Download failed');
        }

        setTimeout(() => {
            setDownloadProgress(prev => {
                const next = { ...prev };
                delete next[filename];
                return next;
            });
        }, 3000);
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
        if (isDirectory) return <Folder className="text-indigo-400" size={28} strokeWidth={1.5} />;

        const ext = filename.split('.').pop()?.toLowerCase() || '';
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const videoExts = ['mp4', 'webm', 'avi', 'mov', 'mkv'];
        const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
        const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];
        const docExts = ['pdf', 'doc', 'docx', 'txt', 'md', 'xls', 'xlsx'];

        if (imageExts.includes(ext)) return <Image className="text-emerald-400" size={28} strokeWidth={1.5} />;
        if (videoExts.includes(ext)) return <Video className="text-purple-400" size={28} strokeWidth={1.5} />;
        if (audioExts.includes(ext)) return <Music className="text-pink-400" size={28} strokeWidth={1.5} />;
        if (archiveExts.includes(ext)) return <Archive className="text-amber-400" size={28} strokeWidth={1.5} />;
        if (docExts.includes(ext)) return <FileText className="text-blue-400" size={28} strokeWidth={1.5} />;

        return <File className="text-slate-400" size={28} strokeWidth={1.5} />;
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
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
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
            className="min-h-screen p-6 lg:p-12 font-sans text-slate-200 bg-[#0B0F19] selection:bg-indigo-500/30 overflow-hidden relative"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10"
                >
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                            <HardDrive className="text-indigo-400" size={36} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-tight">
                                Oliverslife Cloud
                            </h1>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="h-px w-8 bg-indigo-500/50"></span>
                                <p className="text-indigo-300/80 text-xs font-semibold tracking-[0.2em] uppercase">Secure Storage</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full lg:w-auto">
                        <div className="flex-1 lg:flex-none flex items-center gap-5 bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-colors">
                            <div className="flex-1 lg:w-64">
                                <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                    <span>Storage Usage</span>
                                    <span className={usagePercent > 90 ? 'text-red-400' : 'text-indigo-300'}>{Math.round(usagePercent)}%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(usagePercent, 100)}%` }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 relative"
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                    </motion.div>
                                </div>
                                <div className="flex justify-between mt-2 text-[11px] font-medium text-slate-400">
                                    <span>{formatSize(usage)} used</span>
                                    <span>35 GB total</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="group p-5 bg-white/5 hover:bg-red-500/10 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-red-500/30 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                            title="Logout"
                        >
                            <LogOut size={22} className="text-slate-400 group-hover:text-red-400 transition-colors" />
                        </button>
                    </div>
                </motion.div>

                {/* Toolbar Context */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between p-2">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-xl overflow-x-auto whitespace-nowrap scrollbar-hide">
                            <button
                                onClick={() => setCurrentPath('')}
                                className={`flex items-center gap-2 hover:text-indigo-300 transition-colors ${!currentPath ? 'text-indigo-400 font-medium' : 'text-slate-400'}`}
                            >
                                <Home size={16} /> <span className="text-sm">Home</span>
                            </button>
                            {currentPath.split('/').filter(Boolean).map((segment, index, arr) => (
                                <span key={index} className="flex items-center gap-2">
                                    <ChevronLeft size={14} className="text-slate-600 rotate-180" />
                                    <button
                                        onClick={() => setCurrentPath(arr.slice(0, index + 1).join('/'))}
                                        className={`hover:text-indigo-300 transition-colors text-sm ${index === arr.length - 1 ? 'text-slate-200 font-medium' : 'text-slate-400'}`}
                                    >
                                        {segment}
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap pb-2 xl:pb-0">
                            {currentPath && (
                                <button
                                    onClick={() => setCurrentPath(currentPath.split('/').slice(0, -1).join('/'))}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-white/5 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-all text-sm font-medium"
                                >
                                    <ChevronLeft size={16} /> Back
                                </button>
                            )}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all text-sm font-medium disabled:opacity-50"
                            >
                                <Upload size={16} /> Upload
                            </button>
                            <button
                                onClick={() => setShowCreateFolder(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/5 rounded-xl transition-all text-sm font-medium"
                            >
                                <FolderPlus size={16} /> New Folder
                            </button>
                            <button
                                onClick={() => fetchFiles(currentPath)}
                                disabled={loading}
                                className="p-2.5 bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-slate-300 rounded-xl transition-all"
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin text-indigo-400' : ''} />
                            </button>
                            <div className="h-8 w-px bg-white/10 mx-1 hidden xl:block"></div>
                            <div className="relative group">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-40 xl:w-56 pl-9 pr-4 py-2.5 bg-slate-900/50 border border-white/5 rounded-xl text-sm text-slate-200 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none placeholder:text-slate-500 transition-all"
                                />
                            </div>
                            <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'name' | 'size' | 'modified')}
                                    className="appearance-none bg-transparent pl-3 pr-8 py-1.5 text-sm text-slate-300 focus:outline-none cursor-pointer"
                                >
                                    <option value="name" className="bg-slate-800">Name</option>
                                    <option value="size" className="bg-slate-800">Size</option>
                                    <option value="modified" className="bg-slate-800">Date</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                    className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
                                >
                                    {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                                </button>
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => e.target.files && handleUpload(e.target.files)} />
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Upload Progress */}
                    {Object.keys(uploadProgress).length > 0 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-white/5 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                            <h4 className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
                                <Upload size={14} className="animate-bounce" /> Uploading Transfers
                            </h4>
                            <div className="space-y-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(uploadProgress).map(([name, progress]) => (
                                    <div key={name}>
                                        <div className="flex justify-between text-sm text-slate-300 mb-1.5">
                                            <span className="truncate max-w-[70%] font-medium">{name}</span>
                                            <span className="text-indigo-300 font-mono text-xs">{progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-500 relative" style={{ width: `${progress}%` }}>
                                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite]" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Download Progress */}
                    {Object.keys(downloadProgress).length > 0 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-white/5 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                            <h4 className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
                                <Download size={14} className="animate-bounce" /> Downloading Transfers
                            </h4>
                            <div className="space-y-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(downloadProgress).map(([name, progress]) => (
                                    <div key={name}>
                                        <div className="flex justify-between text-sm text-slate-300 mb-1.5">
                                            <span className="truncate max-w-[70%] font-medium">{name}</span>
                                            <span className="text-emerald-300 font-mono text-xs">{progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-400 relative" style={{ width: `${progress}%` }}>
                                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite]" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Create Folder Modal */}
                <AnimatePresence>
                    {showCreateFolder && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setShowCreateFolder(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="relative w-full max-w-sm bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                                            <FolderPlus className="text-indigo-400" size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Create Folder</h3>
                                    </div>
                                    <button onClick={() => setShowCreateFolder(false)} className="text-slate-500 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"><X size={18} /></button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter folder name..."
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500 mb-6 outline-none"
                                    autoFocus
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setShowCreateFolder(false)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors text-sm font-medium">Cancel</button>
                                    <button
                                        onClick={handleCreateFolder}
                                        disabled={creatingFolder || !newFolderName.trim()}
                                        className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:shadow-none transition-all text-sm font-medium flex justify-center items-center gap-2"
                                    >
                                        {creatingFolder ? <RefreshCw size={16} className="animate-spin" /> : 'Create Folder'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Main Content: File List */}
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
                    {loading ? (
                        Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 h-44 animate-pulse relative overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
                            </div>
                        ))
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredAndSortedFiles.map((file, index) => (
                                <motion.div
                                    key={file.name}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                    transition={{ delay: index * 0.02, type: "spring", stiffness: 300, damping: 25 }}
                                    layout
                                    className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/10 hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                                    onClick={() => file.isDirectory ? setCurrentPath(currentPath ? `${currentPath}/${file.name}` : file.name) : null}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-300">
                                            {getFileIcon(file.name, file.isDirectory)}
                                        </div>
                                        <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                                            {!file.isDirectory && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDownload(file.name); }}
                                                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors bg-slate-900/50 backdrop-blur-md border border-white/5"
                                                    title="Download"
                                                >
                                                    <Download size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(file.name); }}
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors bg-slate-900/50 backdrop-blur-md border border-white/5"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <h3
                                            className="font-semibold text-slate-200 truncate mb-1.5 text-sm group-hover:text-indigo-300 transition-colors"
                                            title={file.name}
                                        >
                                            {file.name}
                                        </h3>
                                        <div className="flex flex-col gap-1 text-[11px] font-medium text-slate-500">
                                            <div className="flex justify-between items-center">
                                                <span className="bg-white/5 px-2 py-0.5 rounded text-slate-400 border border-white/5">
                                                    {file.isDirectory ? 'Folder' : formatSize(file.size)}
                                                </span>
                                            </div>
                                            <span className="truncate">{formatDate(file.modified)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {!loading && filteredAndSortedFiles.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm mt-8">
                        <div className="p-6 bg-indigo-500/10 rounded-full mb-6 ring-8 ring-indigo-500/5">
                            <Archive size={48} className="text-indigo-400" />
                        </div>
                        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400 mb-2">
                            {searchQuery ? 'No matching files found' : 'Your space is empty'}
                        </p>
                        <p className="text-slate-500">
                            {searchQuery ? 'Try adjusting your search criteria' : 'Drag and drop your files here to securely upload them'}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Drag Overlay */}
            <AnimatePresence>
                {dragActive && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center pointer-events-none">
                        <div className="absolute inset-4 border-2 border-indigo-500/50 border-dashed rounded-3xl bg-indigo-500/5 flex flex-col items-center justify-center animate-pulse">
                            <div className="p-8 bg-indigo-500/20 rounded-full mb-8">
                                <Upload size={80} className="text-indigo-400" />
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-4">Drop your files here</h2>
                            <p className="text-indigo-300/80 text-lg uppercase tracking-widest font-semibold flex items-center gap-2">
                                <CheckCircle2 size={20} /> Release to upload instantly
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.5);
                }
            `}} />
        </div>
    );
}

