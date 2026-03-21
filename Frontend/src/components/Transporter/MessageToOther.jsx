import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MoreVertical, X, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";
import { CHAT_API_END_POINT } from '@/utils/constants';
import { io } from "socket.io-client";

const MessageToOther = () => {
    const { id, role } = useParams();
    const { user } = useSelector((state) => state.auth);

    const [inputValue, setInputValue] = useState('');
    const [openId, setOpenId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [contactsLoading, setContactsLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    // State for Editing
    const [editingMessageId, setEditingMessageId] = useState(null);

    const scrollRef = useRef(null);
    const socketRef = useRef(null);

    const myCurrentId = user?.id;
    const navigate = useNavigate();

    let receiverModel = "";
    if (role === "admin" || role === "superadmin") receiverModel = "Admin";
    else if (role === "seller") receiverModel = "Seller";
    else if (role === "buyer") receiverModel = "Buyer";
    else if (role === "transporter" || role === "Transporter" || role === "transportprovider") receiverModel = "TransportProvider";

    useEffect(() => {
        if (!myCurrentId) return;

        socketRef.current = io("http://localhost:8000", {
            query: { userId: myCurrentId },
        });

        socketRef.current.on("newMessage", (newMessage) => {
            const isChatOpen =
                (newMessage.sender === id && newMessage.receiver === myCurrentId) ||
                (newMessage.sender === myCurrentId && newMessage.receiver === id) ||
                (receiverModel === "Admin" && newMessage.receiverModel === "Admin");

            if (isChatOpen) {
                setMessages((prev) => {
                    const exists = prev.some((m) => m._id === newMessage._id);
                    return exists ? prev : [...prev, newMessage];
                });
            }
            fetchContacts();
        });

        socketRef.current.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [myCurrentId, id, receiverModel]);

    useEffect(() => {
        const handleClickOutside = () => setOpenId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const fetchMessages = async () => {
        if (!id || !receiverModel) return;
        try {
            setLoading(true);
            const res = await axios.get(`${CHAT_API_END_POINT}/get/${id}/${receiverModel}`, { withCredentials: true });
            if (res.data.success) setMessages(res.data.messages);
        } catch (error) {
            toast.error("Failed to load conversation");
        } finally {
            setLoading(false);
        }
    };

    const fetchContacts = async () => {
        try {
            setContactsLoading(true);
            const res = await axios.get(`${CHAT_API_END_POINT}/contacts`, { withCredentials: true });
            if (res.data.success) setContacts(res.data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setContactsLoading(false);
        }
    };

    useEffect(() => { fetchMessages(); }, [id, receiverModel]);
    useEffect(() => { fetchContacts(); }, []);
    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages]);

    const deleteHandler = async (messageId) => {
        try {
            const res = await axios.delete(`${CHAT_API_END_POINT}/delete/${messageId}`, { withCredentials: true });
            if (res.data.success) {
                setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
                setOpenId(null);
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // Prepare for Editing: Put text into input field
    const startEditMessage = (msg) => {
        setEditingMessageId(msg._id);
        setInputValue(msg.text);
        setOpenId(null);
    };

    const cancelEdit = () => {
        setEditingMessageId(null);
        setInputValue("");
    };

    const handleSendOrUpdate = async () => {
        if (!inputValue.trim()) return;

        if (editingMessageId) {
            // UPDATE LOGIC
            try {
                const res = await axios.put(
                    `${CHAT_API_END_POINT}/edit/${editingMessageId}`,
                    { text: inputValue },
                    { withCredentials: true }
                );

                if (res.data.success) {
                    setMessages((prev) =>
                        prev.map((msg) => msg._id === editingMessageId ? { ...msg, text: inputValue } : msg)
                    );
                    setEditingMessageId(null);
                    setInputValue("");
                }
            } catch (err) {
                toast.error("Edit failed");
            }
        } else {
            try {
                const res = await axios.post(
                    `${CHAT_API_END_POINT}/send`,
                    {
                        receiver: receiverModel === "Admin" ? null : id,
                        receiverModel,
                        text: inputValue
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    }
                );
                if (res.data.success) {
                    setMessages((prev) => [...prev, res.data.message]);
                    setInputValue('');
                    fetchContacts();
                }
            } catch {
                toast.error("Message failed to send");
            }
        }
    };

    const handleContactSelect = (contactId, contactRole) => {
        navigate(`/message/chat/${contactRole}/${contactId}`);
    };

    return (
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
            {/* CONTACT LIST */}
            <aside className="hidden md:flex flex-col w-80 bg-white border-r">
                <div onClick={() => navigate("/message/chat")} className="p-4 border-b cursor-pointer hover:bg-gray-50 transition">
                    <h1 className="text-xl font-bold text-indigo-600">Messages</h1>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contactsLoading ? <Loader2 className="animate-spin mx-auto mt-5 text-indigo-600" /> : 
                        contacts.map((contact) => (
                            <div
                                key={contact._id}
                                onClick={() => handleContactSelect(contact._id, contact.role)}
                                className={`p-4 cursor-pointer flex gap-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${id === contact._id ? 'bg-indigo-50' : ''}`}
                            >
                                <div className="relative h-10 w-10 flex-shrink-0">
                                    <div className="w-full h-full bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                        {contact.name?.[0]}
                                    </div>
                                    {onlineUsers.includes(contact._id) && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="text-sm font-semibold truncate">{contact.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{contact.lastMessage || "No messages yet"}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </aside>

            {/* CHAT AREA */}
            <main className="flex flex-col flex-1 bg-white">
                {id ? (
                    <>
                        <header className="px-6 py-4 border-b flex justify-between items-center bg-white shadow-sm z-10">
                            <div>
                                <h2 className="font-bold text-gray-800 text-lg">{role?.toUpperCase()}</h2>
                                <p className="text-xs text-gray-400 font-medium">
                                    {onlineUsers.includes(id) ? <span className="text-green-500">● Online</span> : "● Offline"}
                                </p>
                            </div>
                        </header>

                        <section className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
                            {loading ? <Loader2 className="animate-spin mx-auto mt-10 text-indigo-600" /> : 
                                messages.map((msg) => {
                                    const isMe = String(msg.sender) === String(myCurrentId);
                                    return (
                                        <div key={msg._id} className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className="group relative max-w-[70%]">
                                                {/* Tool Button (Me Only) */}
                                                {isMe && (
                                                    <div className="absolute top-0 -left-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setOpenId(openId === msg._id ? null : msg._id); }}
                                                            className="p-1 hover:bg-gray-200 rounded-full"
                                                        >
                                                            <MoreVertical size={14} className="text-gray-400" />
                                                        </button>
                                                        {openId === msg._id && (
                                                            <div className="absolute bottom-full left-0 mb-2 w-24 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden z-[100]">
                                                                <button onClick={() => startEditMessage(msg)} className="block w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 font-medium">Edit</button>
                                                                <button onClick={() => deleteHandler(msg._id)} className="block w-full text-left px-3 py-2 text-xs hover:bg-red-50 text-red-600 font-medium">Delete</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                                                    {msg.text}
                                                </div>
                                                <p className={`text-[10px] mt-1 text-slate-400 ${isMe ? 'text-right' : 'text-left'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            <div ref={scrollRef} />
                        </section>

                        <footer className="p-4 border-t bg-white">
                            {editingMessageId && (
                                <div className="flex items-center justify-between px-3 py-1 bg-indigo-50 rounded-t-lg border-x border-t border-indigo-100 text-xs text-indigo-600 font-semibold mb-[-1px]">
                                    <span className="flex items-center gap-1 italic"><Check size={12}/> Editing Message</span>
                                    <button onClick={cancelEdit} className="p-1 hover:bg-indigo-100 rounded-full"><X size={14}/></button>
                                </div>
                            )}
                            <div className="flex gap-2 items-center">
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendOrUpdate()}
                                    className={`flex-1 border-2 outline-none transition-all rounded-xl px-4 py-3 text-sm focus:border-indigo-500 ${editingMessageId ? 'border-indigo-400 rounded-t-none bg-indigo-50/30' : 'border-gray-100 bg-gray-50'}`}
                                    placeholder={editingMessageId ? "Update your message..." : "Type your message..."}
                                />
                                <button 
                                    onClick={handleSendOrUpdate} 
                                    className={`px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center ${editingMessageId ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
                                >
                                    {editingMessageId ? <Check size={20} strokeWidth={3} /> : <Send size={20} />}
                                </button>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                        <div className="p-6 bg-slate-50 rounded-full"><Send size={48} className="text-slate-200" /></div>
                        <p className="font-medium">Select a conversation to start chatting</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MessageToOther;