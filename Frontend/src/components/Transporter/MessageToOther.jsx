import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
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
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [contactsLoading, setContactsLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]); // Track online status
    const scrollRef = useRef(null);
    const socketRef = useRef(null); // Use ref to persist socket instance

    const myCurrentId = user?.id;
    const navigate = useNavigate();

    let receiverModel = "";
    if (role === "admin" || role === "superadmin") receiverModel = "Admin";
    else if (role === "seller") receiverModel = "Seller";
    else if (role === "buyer") receiverModel = "Buyer";
    else if (role === "transporter" || role === "Transporter") receiverModel = "TransporterProvider";

  
    useEffect(() => {
        if (myCurrentId) {
            socketRef.current = io("http://localhost:8000", {
                query: { userId: myCurrentId },
            });

            socketRef.current.on("newMessage", (newMessage) => {
                if (newMessage.sender === id || (newMessage.receiver === id && newMessage.sender === myCurrentId)) {
                    setMessages((prev) => [...prev, newMessage]);
                }
    
                fetchContacts();
            });

            socketRef.current.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => socketRef.current.close();
        }
    }, [myCurrentId, id]);

    const fetchMessages = async () => {
        if (!id || !receiverModel) return;
        try {
            setLoading(true);
            const res = await axios.get(`${CHAT_API_END_POINT}/get/${id}/${receiverModel}`, {
                withCredentials: true
            });
            if (res.data.success) {
                setMessages(res.data.messages);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load conversation");
        } finally {
            setLoading(false);
        }
    };

    const fetchContacts = async () => {
        try {
            setContactsLoading(true);
            const res = await axios.get(`${CHAT_API_END_POINT}/contacts`, { withCredentials: true });
            if (res.data.success) {
                setContacts(res.data.users);
            }
        } catch (error) {
            console.error("Error fetching contacts", error);
        } finally {
            setContactsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [id, receiverModel]);

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        try {
            const res = await axios.post(`${CHAT_API_END_POINT}/send`, {
                receiver: id,
                receiverModel: receiverModel,
                text: inputValue
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                setMessages((prev) => [...prev, res.data.message]);
                setInputValue('');
                fetchContacts(); // Update sidebar last message
            }
        } catch (error) {
            toast.error("Message failed to send");
        }
    };

    const handleContactSelect = (contactId, contactRole) => {
        navigate(`/message/chat/${contactRole}/${contactId}`);
    };

    return (
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
            {/* SIDEBAR */}
            <aside className="hidden md:flex flex-col w-80 bg-white border-r border-gray-200">
                <div className="p-4 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {contactsLoading ? (
                        <div className="p-4 text-center"><Loader2 className="animate-spin mx-auto" /></div>
                    ) : (
                        contacts.map((contact) => {
                            const isOnline = onlineUsers.includes(contact._id);
                            return (
                                <div
                                    key={contact._id}
                                    onClick={() => handleContactSelect(contact._id, contact.role)}
                                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors relative
                                    ${id === contact._id ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-indigo-600 uppercase">
                                            {contact.name?.[0] || 'U'}
                                        </div>
                                        {isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{contact.name}</h4>
                                        <p className="text-xs text-gray-500 truncate">{contact.lastMessage || contact.role}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </aside>

            {/* CHAT AREA */}
            <main className="flex flex-col flex-1 bg-white">
                {id ? (
                    <>
                        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold uppercase">
                                    {role?.[0] || '?'}
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-800 uppercase text-xs">{role}</h2>
                                    <p className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                        {onlineUsers.includes(id) ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                        </header>

                        <section className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f0f2f5]">
                            {loading ? (
                                <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" /></div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = String(msg.sender) === String(myCurrentId);
                                    return (
                                        <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative ${isMe ? 'bg-indigo-600 text-white rounded-br-none ml-12' : 'bg-white text-gray-800 rounded-bl-none mr-12 border border-gray-100'}`}>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                <div className={`flex items-center gap-1 mt-1 opacity-70 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-[9px]">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={scrollRef} />
                        </section>

                        <footer className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-center gap-3 max-w-6xl mx-auto">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Write a message..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-5 focus:outline-none focus:border-indigo-500 text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white p-3 rounded-xl shadow-md"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p>Select a contact to start messaging</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MessageToOther;