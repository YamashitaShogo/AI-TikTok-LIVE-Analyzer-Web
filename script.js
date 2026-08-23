console.log("AI TikTok LIVE Analyzer Web");

const contactForm = document.getElementById("contact-form");
const contactMessage = document.getElementById("contact-message");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton =
            contactForm.querySelector(".contact-submit");

        const formData = {
            name: document
                .getElementById("name")
                .value
                .trim(),

            email: document
                .getElementById("email")
                .value
                .trim(),

            category: document
                .getElementById("category")
                .value,

            message: document
                .getElementById("message")
                .value
                .trim(),
        };

        if (
            !formData.name ||
            !formData.email ||
            !formData.category ||
            !formData.message
        ) {
            contactMessage.textContent =
                "入力されていない項目があります。";

            contactMessage.className =
                "contact-message error";

            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "送信中...";

        contactMessage.textContent = "";

        try {
            /*
             * 後でここを実際のAPI URLに変更します。
             *
             * 例：
             * https://xxxxx.onrender.com/contact
             */

            const response = await fetch(
                "https://ai-tiktok-live-analyzer.onrender.com/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(
                        formData
                    ),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "送信に失敗しました。"
                );
            }

            contactMessage.textContent =
                "お問い合わせを送信しました。";

            contactMessage.className =
                "contact-message success";

            contactForm.reset();

        } catch (error) {
            console.error(error);

            contactMessage.textContent =
                "現在お問い合わせを送信できません。";

            contactMessage.className =
                "contact-message error";

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "送信する";
        }
    });
}