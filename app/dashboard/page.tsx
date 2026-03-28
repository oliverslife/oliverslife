'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Folder, Trash2, Upload, HardDrive, LogOut, Download, ChevronRight, Search, FolderPlus, X, FileText, Image, Video, Music, Archive, RefreshCw, Home, Clock, Star, Share2, MoreHorizontal, Cloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './dashboard.css';

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
    const [limit, setLimit] = useState(35 * 1024 * 1024 * 1024); // Default 35GB, updated by API
    const [favorites, setFavorites] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
            router.push('/');
        }
    };

    useEffect(() => {
        const storedFavs = localStorage.getItem('oliverslife_favorites');
        if (storedFavs) {
            try { setFavorites(JSON.parse(storedFavs)); } catch (e) {}
        }
    }, []);

    const toggleFavorite = (filePath: string) => {
        setFavorites(prev => {
            const newFavs = prev.includes(filePath) ? prev.filter(p => p !== filePath) : [...prev, filePath];
            localStorage.setItem('oliverslife_favorites', JSON.stringify(newFavs));
            return newFavs;
        });
    };

    const fetchFiles = async (path: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
            if (res.ok) {
                const data = await res.json();
                setFiles(data.files);
                if (data.usage !== undefined) setUsage(data.usage);
                if (data.limit !== undefined) setLimit(data.limit);
            } else if (res.status === 401) {
                // Unauthorized session
                router.push('/');
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
                        // Removed content-length (unsafe header in browser)
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(prev => ({ ...prev, [file.name]: percentCompleted }));
                        }
                    }
                });
            } catch (err: any) {
                if (err.response?.status === 507) {
                    alert('Storage limit exceeded (90% capacity). Cannot upload.');
                } else {
                    alert(`Error uploading: ${file.name}`);
                }
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
                // If it was favorited, remove it from favorites
                setFavorites(prev => {
                    const newFavs = prev.filter(p => !p.startsWith(filePath));
                    localStorage.setItem('oliverslife_favorites', JSON.stringify(newFavs));
                    return newFavs;
                });
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
        if (isDirectory) return <Folder color="#8B7355" size={48} strokeWidth={1} fill="rgba(139,115,85,0.1)" />;

        const ext = filename.split('.').pop()?.toLowerCase() || '';
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const videoExts = ['mp4', 'webm', 'avi', 'mov', 'mkv'];
        const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
        const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];
        const docExts = ['pdf', 'doc', 'docx', 'txt', 'md', 'xls', 'xlsx', 'pptx'];

        if (imageExts.includes(ext)) return <Image color="#10b981" size={48} strokeWidth={1} fill="rgba(16,185,129,0.1)" />;
        if (videoExts.includes(ext)) return <Video color="#8b5cf6" size={48} strokeWidth={1} fill="rgba(139,92,246,0.1)" />;
        if (audioExts.includes(ext)) return <Music color="#ec4899" size={48} strokeWidth={1} fill="rgba(236,72,153,0.1)" />;
        if (archiveExts.includes(ext)) return <Archive color="#f59e0b" size={48} strokeWidth={1} fill="rgba(245,158,11,0.1)" />;
        if (docExts.includes(ext)) return <FileText color="#3b82f6" size={48} strokeWidth={1} fill="rgba(59,130,246,0.1)" />;

        return <File color="#94a3b8" size={48} strokeWidth={1} fill="rgba(148,163,184,0.1)" />;
    };

    const filteredAndSortedFiles = files
        .filter(file => {
            const fullName = currentPath ? `${currentPath}/${file.name}` : file.name;
            if (activeTab === 'favorites' && !favorites.includes(fullName)) return false;
            if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (activeTab === 'recents') {
                return new Date(b.modified).getTime() - new Date(a.modified).getTime();
            }
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
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' by Admin';
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

    const usagePercent = limit > 0 ? (usage / limit) * 100 : 0;

    return (
        <div 
            className="dashboard-container"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-logo">
                    <Cloud size={32} color="white" />
                    <span>cloud</span>
                </div>

                <div className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => {setActiveTab('all'); setCurrentPath('');}}>
                        <Folder size={18} /> All Files
                    </button>
                    <button className={`nav-item ${activeTab === 'recents' ? 'active' : ''}`} onClick={() => setActiveTab('recents')}>
                        <Clock size={18} /> Recents
                    </button>
                    <button className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
                        <Star size={18} /> Favorites
                    </button>
                </div>

                <div className="nav-section">My Collections</div>
                <div className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => {setActiveTab('projects'); setCurrentPath('Projects');}}>
                        <Folder size={18} /> Project Files
                    </button>
                    <button className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => {setActiveTab('personal'); setCurrentPath('Personal');}}>
                        <Folder size={18} /> Personal
                    </button>
                </div>

                <div className="usage-container">
                    <div className="usage-title">Storage Usage</div>
                    <div className="usage-bar">
                        <div className="usage-fill" style={{ width: `${Math.min(usagePercent, 100)}%` }} />
                    </div>
                    <div className="usage-text">
                        <span>{formatSize(usage)}</span>
                        <span>{formatSize(limit)} limit</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Topbar */}
                <div className="topbar">
                    <div className="search-container">
                        <Search className="search-icon" size={18} />
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search files and folders"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="topbar-actions">
                        <button className="icon-btn" onClick={() => fetchFiles(currentPath)}><RefreshCw size={18} className={loading ? 'fa-spin' : ''} /></button>
                        <button className="icon-btn" title="Logout" onClick={handleLogout}><LogOut size={18} /></button>
                        <button className="avatar" title="Sojin Kim">SK</button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="breadcrumb">
                        <button className="breadcrumb-item" onClick={() => setCurrentPath('')}>
                            {activeTab === 'recents' ? 'Recents' : activeTab === 'favorites' ? 'Favorites' : 'All Files'}
                        </button>
                        {currentPath && currentPath.split('/').filter(Boolean).map((segment, idx, arr) => (
                            <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <ChevronRight className="breadcrumb-divider" size={18} />
                                <button 
                                    className="breadcrumb-item"
                                    onClick={() => setCurrentPath(arr.slice(0, idx + 1).join('/'))}
                                >
                                    {segment}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="toolbar-actions">
                        <button className="icon-btn" style={{border: '1px solid #cbd5e1'}} onClick={() => fileInputRef.current?.click()}>
                            <Upload size={16} />
                        </button>
                        <button className="btn-secondary" onClick={() => setShowCreateFolder(true)}>
                            New <FolderPlus size={16} />
                        </button>
                        <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
                            Upload <Upload size={16} color="white" />
                        </button>
                    </div>
                </div>

                {/* File Grid */}
                <div className="content-area">
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                            <RefreshCw size={32} className="fa-spin" style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    ) : filteredAndSortedFiles.length === 0 ? (
                        <div className="empty-state">
                            <Archive size={64} color="#cbd5e1" strokeWidth={1} />
                            <h3>Your space is empty</h3>
                            <p>Drag and drop your files here to upload, or try a different tab.</p>
                        </div>
                    ) : (
                        <div className="grid-container">
                            {filteredAndSortedFiles.map((file) => {
                                const fullName = currentPath ? `${currentPath}/${file.name}` : file.name;
                                const isFav = favorites.includes(fullName);
                                
                                return (
                                <div 
                                    key={file.name} 
                                    className="file-card"
                                    onClick={() => file.isDirectory ? setCurrentPath(fullName) : null}
                                >
                                    <div className="file-icon-container">
                                        {getFileIcon(file.name, file.isDirectory)}
                                    </div>
                                    <div className="file-name" title={file.name}>{file.name}</div>
                                    <div className="file-meta">
                                        <span>{formatDate(file.modified)}</span>
                                        {!file.isDirectory && <span>{formatSize(file.size)}</span>}
                                    </div>

                                    <div className="card-actions">
                                        <button 
                                            className="action-icon" 
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(fullName); }}
                                            title="Favorite"
                                        >
                                            <Star size={16} fill={isFav ? "gold" : "none"} color={isFav ? "gold" : "#64748b"} />
                                        </button>
                                        {!file.isDirectory && (
                                            <button 
                                                className="action-icon" 
                                                onClick={(e) => { e.stopPropagation(); handleDownload(file.name); }}
                                                title="Download"
                                            >
                                                <Download size={16} />
                                            </button>
                                        )}
                                        <button 
                                            className="action-icon danger" 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(file.name); }}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )})}
                        </div>
                    )}
                </div>
            </div>

            {/* Inputs & Overlays */}
            <input type="file" ref={fileInputRef} className="hidden" style={{display: 'none'}} multiple onChange={(e) => e.target.files && handleUpload(e.target.files)} />

            <AnimatePresence>
                {dragActive && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="drag-overlay">
                        <div className="drag-content">
                            <Upload size={64} color="#8B7355" />
                            <h2>Drop files to upload</h2>
                            <p style={{color: '#64748b'}}>Release your mouse to start uploading</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCreateFolder && (
                    <div className="modal-overlay" onClick={() => setShowCreateFolder(false)}>
                        <motion.div 
                            initial={{scale: 0.9, opacity: 0}} 
                            animate={{scale: 1, opacity: 1}} 
                            exit={{scale: 0.9, opacity: 0}} 
                            className="modal-content"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="modal-title">Create New Folder</h3>
                            <input 
                                type="text"
                                className="modal-input"
                                placeholder="Folder Name"
                                value={newFolderName}
                                onChange={e => setNewFolderName(e.target.value)}
                                autoFocus
                                onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                            />
                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={() => setShowCreateFolder(false)}>Cancel</button>
                                <button className="btn-primary" onClick={handleCreateFolder} disabled={creatingFolder || !newFolderName}>
                                    {creatingFolder ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Upload/Download Progress */}
            {Object.keys({...uploadProgress, ...downloadProgress}).length > 0 && (
                <div className="progress-container">
                    <div className="progress-header">
                        <span>Active Transfers</span>
                        <span>{Object.keys({...uploadProgress, ...downloadProgress}).length} files</span>
                    </div>
                    <div className="progress-list">
                        {Object.entries(uploadProgress).map(([name, progress]) => (
                            <div key={`ul-${name}`} className="progress-item">
                                <div className="progress-info">
                                    <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%'}}>Upload: {name}</span>
                                    <span style={{color: '#8B7355', fontWeight: 600}}>{progress}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{width: `${progress}%`}}></div>
                                </div>
                            </div>
                        ))}
                        {Object.entries(downloadProgress).map(([name, progress]) => (
                            <div key={`dl-${name}`} className="progress-item">
                                <div className="progress-info">
                                    <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%'}}>Download: {name}</span>
                                    <span style={{color: '#10b981', fontWeight: 600}}>{progress}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{width: `${progress}%`, background: '#10b981'}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .fa-spin { animation: spin 1s linear infinite; }
            `}} />
        </div>
    );
}

