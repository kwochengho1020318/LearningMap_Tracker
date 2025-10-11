import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Chatbot.css";
import { useNavigate } from "react-router-dom";
import { sendPost, Toast } from "./utils"
// 單檔 React 組件：聊天頁面（最下面是輸入框）
// 特色：
// - 頁面滿版、訊息區可捲動
// - 底部固定輸入區，Enter 送出、Shift+Enter 換行
// - 自動捲到最新訊息
// - 簡潔氣泡樣式、淺色主題
// - TODO：把 handleSend 裡面模擬回覆，換成你真正的 API 呼叫



export default function ChatbotPage() {
    const [messages, setMessages] = useState([
        { id: 1, role: "assistant", text: "Want to learn something?" },
    ]);
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const scrollAnchorRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        // 訊息更新後自動捲到底
        scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isSending]);


    // 讓 textarea 依內容自動長高
    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`; // 最多長到 ~5 行
    };
    const gotoDashboard = () => {
        navigate("/dashboard"); // 跳轉到 /about
    };

    const formatStudyMap = (plan) => {
        let output = `🎯 Target：${plan.target}\n\n`;

        plan.phase.forEach((phase, index) => {
            output += `📌 phase ${index + 1}：${phase.name}（estimated ${phase.time}）\n`;

            // 內容
            if (phase.content && phase.content.length > 0) {
                output += "  📖 Content：\n";
                phase.content.forEach(item => {
                    output += `    - ${item.name}\n`;
                });
            }

            // 練習
            if (phase.practice && phase.practice.length > 0) {
                output += "  ✏️ practice：\n";
                phase.practice.forEach(item => {
                    output += `    - ${item.name}（source：${item.source}）\n`;
                });
            }

            // 測驗
            if (phase.test) {
                output += `  ✅ test：${phase.test.name} — ${phase.test.info}\n`;
            }

            output += "\n";
        });

        return output.trim();
    }

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isSending) return;

        setIsSending(true);
        const userMsg = { id: Date.now(), role: "user", text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        let data = { input: text }
        const formData = Object.keys(data).map(
            function (keyName) {
                return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
            }
        ).join('&');
        // TODO：改成你真正的 chatbot API 呼叫
        // 這裡先模擬一個延遲並回覆
        try {
            fetch(`${process.env.REACT_APP_API_URL}/chat`, {
                method: "POST",
                body: formData,   /*使用處理後的資料*/
                credentials:"include",
                headers: new Headers({
                    "Content-type": "application/x-www-form-urlencoded"
                })
            })
                .then(res => {if(res.status===401){alert("you have not signed in yet");navigate('./login')} return res.json()})
                .then(data => {
                    const botMsg = { id: Date.now() + 1, role: "assistant", text: formatStudyMap(data), type: "map", data: data };
                    setMessages((prev) => [...prev, botMsg]);
                                setIsSending(false);

                })
                .catch(e => {
                    /*發生錯誤時要做的事情*/
                })


        } catch (err) {
            const errMsg = { id: Date.now() + 2, role: "assistant", text: "something wrong happened, try later。" };
            setMessages((prev) => [...prev, errMsg]);
        } finally {
            // 送出後恢復輸入框高度
            requestAnimationFrame(autoResize);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        autoResize();
    }, []);
    const saveMap = async (data) => {
        await sendPost(`${process.env.REACT_APP_API_URL}/chat/map`, data, () => { setShowToast(true) })
    }
    function MessageBubble({ type, role, text, data }) {
        const isUser = role === "user";
        return (
            <div className={`textbubble ${isUser ? "bubble-user" : "bubble-bot"}`}>
                {!isUser && (
                    <div className="mr-2 mt-1 h-7 w-7 shrink-0 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold"></div>
                )}
                <div
                    style={{ display: "block", whiteSpace: "pre-line", textAlign: "left" }}
                >
                    {text}
                    {type === "map" && (
                        <div>
                            <br />
                            Is the plan OK?
                            <button
                                onClick={() => saveMap(data)}
                                style={{ display: "block", float: "middle" }}
                                className="btn btn-secondary"

                            >
                                Confirm
                            </button></div>)}
                </div>
                {isUser && (
                    <div className="ml-2 mt-1 h-7 w-7 shrink-0 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold"></div>
                )}
            </div>
        );
    }
    return (
        <div className="App-header base">
            {showToast && (

                <Toast
                    message="Map established, going to dashboard"
                    duration={3000}
                    onClose={() => {
                        setShowToast(false);
                        gotoDashboard();
                    }}
                />

            )}
            {/* Header */}
            <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
                <div className="">
                    <div>
                        <h1 className="text-base font-semibold text-slate-800">Chatbot</h1>
                    </div>
                </div>
            </header>

            <div className="wrapper" >

                {/* Messages */}
                <main className="chat-main" >
                    <div className="max-w-3xl mx-auto px-4 py-4">
                        {messages.map((m) => (
                            <MessageBubble type={m.type} key={m.id} role={m.role} data={m.data} text={m.text} />
                        ))}

                        {isSending && (
                            <div className="textbubble bubble-bot">
                                <span className="inline-flex gap-1 items-center">
                                    generating,this might take 1~5minutes, please wait....
                                </span>
                            </div>
                        )}


                    </div>
                </main>

                {/* Input dock */}
                <div className="input-dock" ref={scrollAnchorRef}>
                    <div className="">
                        <div className="">
                            <textarea
                                ref={textareaRef}
                                className="textarea"
                                placeholder="input…"
                                rows={1}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    requestAnimationFrame(autoResize);
                                }}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="">
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isSending}
                                    className="btn btn-secondary"
                                >
                                    send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}




