document.addEventListener("DOMContentLoaded", () => {
    const chatToggle = document.getElementById("chat-toggle");
    const chatPanel = document.getElementById("chat-panel");
    const chatClose = document.getElementById("chat-close");
    const chatSend = document.getElementById("chat-send");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    if (!chatToggle || !chatPanel) {
        console.error("Livemetry chat elements not found.");
        return;
    }

    chatToggle.addEventListener("click", () => {
        chatPanel.classList.toggle("open");
    });

    chatClose?.addEventListener("click", () => {
        chatPanel.classList.remove("open");
    });

    async function sendChatMessage() {
        const text = chatInput.value.trim();

        if (!text) return;

        const userMessage = document.createElement("div");
        userMessage.className = "chat-message user";
        userMessage.textContent = text;
        chatMessages.appendChild(userMessage);

        chatInput.value = "";

        const botMessage = document.createElement("div");
        botMessage.className = "chat-message bot";
        botMessage.textContent = "考え中...";
        chatMessages.appendChild(botMessage);

        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(
                "https://livemetry-chat-api-1.onrender.com/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: text
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            botMessage.textContent =
                data.reply || "回答を取得できませんでした.";

        } catch (error) {
            console.error("Livemetry AI error:", error);

            botMessage.textContent =
                "現在AIに接続できません。時間をおいてもう一度お試しください。";
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatSend?.addEventListener("click", sendChatMessage);

    chatInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendChatMessage();
        }
    });
});



document.querySelectorAll(".chat-quick-questions button").forEach((button) => {
    button.addEventListener("click", () => {
        const question = button.dataset.question;
        const input = document.getElementById("chat-input");
        const sendButton = document.getElementById("chat-send");

        input.value = question;
        sendButton.click();
    });
});

let contactGuideShown = false;

const chatMessageArea = document.getElementById("chat-messages");

const contactObserver = new MutationObserver(() => {
    if (contactGuideShown) return;

    const userMessages = chatMessageArea.querySelectorAll(".chat-message.user");

    if (userMessages.length >= 4) {
        contactGuideShown = true;

        const guide = document.createElement("div");
        guide.className = "chat-message bot chat-contact-guide";

        guide.innerHTML = `
            <div>解決しない場合は、お問い合わせフォームからご連絡ください。</div>
            <a href="#contact" class="chat-contact-button">
                お問い合わせはこちら
            </a>
        `;

        chatMessageArea.appendChild(guide);
        chatMessageArea.scrollTop = chatMessageArea.scrollHeight;
    }
});

contactObserver.observe(chatMessageArea, {
    childList: true
});
