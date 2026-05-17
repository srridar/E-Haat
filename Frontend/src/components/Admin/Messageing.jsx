import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Loader2, Edit2, Trash2, X, User, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { toast } from "sonner"; // Switched to sonner for dashboard consistency
import { CHAT_API_END_POINT } from '@/utils/constants';

const Messaging = () => {
    const { id, role } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [inputValue, setInputValue] = useState('');
    const [messageId, setMessageId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const myCurrentId = user?._id || user?.id;

    // Model Mapping
    const modelMap = {
        admin: "Admin",
        superadmin: "Admin",
        seller: "Seller",
        buyer: "Buyer",
        transporter: "TransporterProvider",
        Transporter: "TransporterProvider"
    };
    const receiverModel = modelMap[role] || "";

    const fetchMessages = async () => {
        if (!id || !receiverModel) return;
        try {
            setLoading(true);
            const res = await axios.get(`${CHAT_API_END_POINT}/get/${id}/${receiverModel}`, {
                withCredentials: true
            });
            if (res.data.success) setMessages(res.data.messages);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to decrypt secure channel");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [id, receiverModel]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleEditClick = (msg) => {
        setInputValue(msg.text);
        setMessageId(msg._id);
        setOpenMenuId(null);
    };

    const cancelEdit = () => {
        setMessageId(null);
        setInputValue("");
    };

    const handleDeleteClick = async (mId) => {
        try {
            const res = await axios.delete(`${CHAT_API_END_POINT}/delete/${mId}`, { withCredentials: true });
            if (res.data.success) {
                setMessages((prev) => prev.filter((msg) => msg._id !== mId));
                setOpenMenuId(null);
                toast.success("Message purged");
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        try {
            if (messageId) {
                const res = await axios.put(`${CHAT_API_END_POINT}/edit/${messageId}`, { text: inputValue }, { withCredentials: true });
                if (res.data.success) {
                    setMessages((prev) => prev.map((msg) => msg._id === messageId ? res.data.message : msg));
                    cancelEdit();
                }
            } else {
                const res = await axios.post(`${CHAT_API_END_POINT}/send`, 
                    { receiver: id, receiverModel, text: inputValue },
                    { withCredentials: true }
                );
                if (res.data.success) {
                    setMessages((prev) => [...prev, res.data.message]);
                    setInputValue("");
                }
            }
        } catch (error) {
            toast.error("Transmission failed");
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#121212] overflow-hidden text-gray-100">
            {/* Sidebar - Integrated with Dark Theme */}
            <aside className="hidden lg:flex flex-col w-80 bg-[#1e1e1e] border-r border-gray-800">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-black text-white tracking-tighter mb-4">COMMUNICATIONS</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-600" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Logs..." 
                            className="w-full bg-[#121212] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-indigo-500/50 text-xs text-gray-300 transition-all" 
                        />
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-10 opacity-20 text-center">
                    <ShieldCheck size={48} className="mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest leading-loose">Channel Secured with End-to-End Encryption Protocol</p>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex flex-col flex-1 bg-[#121212] relative">
                {/* Header */}
                <header className="flex items-center justify-between px-8 py-4 bg-[#1e1e1e]/80 backdrop-blur-xl border-b border-white/5 z-20">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                <User size={24} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#1e1e1e] rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="font-black text-white uppercase text-xs tracking-[0.2em]">{role} CHANNEL</h2>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">UID: {id?.toUpperCase()}</p>
                        </div>
                    </div>
                </header>

                {/* Messages Container */}
                <section className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_50%_50%,_#1a1a1a_0%,_#121212_100%)]">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-full gap-4">
                            <Loader2 className="animate-spin text-indigo-500" size={32} />
                            <p className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase">Decrypting Logs...</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = String(msg.sender) === String(myCurrentId);
                            return (
                                <div key={msg._id} className={`flex w-full group ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`relative max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        
                                        {/* Action Menu (MoreVertical) */}
                                        <div className={`absolute top-0 ${isMe ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                            <button 
                                                onClick={() => setOpenMenuId(openMenuId === msg._id ? null : msg._id)}
                                                className="p-1 text-gray-600 hover:text-white transition-colors"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                            
                                            {openMenuId === msg._id && (
                                                <div className={`absolute bottom-full mb-2 ${isMe ? 'left-0' : 'right-0'} w-28 bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden shadow-2xl z-30`}>
                                                    <button onClick={() => handleEditClick(msg)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-[10px] font-bold text-gray-300 hover:bg-indigo-600 hover:text-white transition-all uppercase">
                                                        <Edit2 size={12} /> Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(msg._id)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-[10px] font-bold text-red-400 hover:bg-red-600 hover:text-white transition-all uppercase">
                                                        <Trash2 size={12} /> Purge
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`px-5 py-3 rounded-[1.5rem] shadow-xl border transition-all ${
                                            isMe 
                                            ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none' 
                                            : 'bg-[#1e1e1e] border-gray-800 text-gray-300 rounded-tl-none hover:border-gray-700'
                                        }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>

                                        {/* Meta Information */}
                                        <div className={`flex items-center gap-2 mt-2 px-1 opacity-40 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-[9px] font-mono uppercase tracking-tighter">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMe && (
                                                <span className={`text-[9px] font-black uppercase ${msg.seen ? 'text-emerald-400' : 'text-gray-400'}`}>
                                                    {msg.seen ? 'Received' : 'Sent'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={scrollRef} />
                </section>

                {/* Footer Input Area */}
                <footer className="p-6 bg-[#1e1e1e]/50 border-t border-white/5 backdrop-blur-md">
                    <div className="max-w-5xl mx-auto flex flex-col gap-2">
                        {messageId && (
                            <div className="flex items-center justify-between px-4 py-2 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-lg mb-2">
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Edit2 size={12} /> Modifying outgoing transmission...
                                </p>
                                <button onClick={cancelEdit} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative group">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Input signal..."
                                    className="w-full bg-[#121212] border border-gray-800 rounded-[1.2rem] py-4 px-6 focus:outline-none focus:border-indigo-500/50 text-sm text-gray-200 shadow-inner placeholder:text-gray-700 transition-all"
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white p-4 rounded-[1.2rem] shadow-lg shadow-indigo-900/20 transition-all active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Messaging;