/*
* When Feedback page is loaded this function is called
*/
export function DisplayFeedbackPage() {
    console.log("Calling DisplayFeedbackPage()...");
    let FeedbackForm = document.getElementById("FeedbackForm");
    const ConfirmationModal = document.getElementById('ConfirmationModal');
    if (!FeedbackForm || !ConfirmationModal) {
        console.error("[ERROR] Unable to find FeedbackForm or ConfirmationModal");
        return;
    }
    // Prevents form from submitting normally
    FeedbackForm.addEventListener("submit", function (event) {
        event.preventDefault();
        // Get form data
        const formData = {
            name: document.getElementById("name")?.value || "",
            email: document.getElementById("email")?.value || "",
            subject: document.getElementById("subject")?.value || "",
            message: document.getElementById("message")?.value || ""
        };
        new Promise((resolve) => {
            resolve(formData); // Simulate network delay
        })
            .then((data) => {
            // Update modal content with submitted data
            const modalTitle = document.querySelector(".modal-title");
            const modalBody = document.querySelector(".modal-body");
            if (modalTitle && modalBody) {
                modalTitle.textContent = "Confirm Your Submission";
                modalBody.innerHTML = `
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Subject:</strong> ${data.subject}</p>
                    <p><strong>Message:</strong> ${data.message}</p>
                    <p>Are you sure you want to submit this feedback?</p>
                `;
                // Show the modal
                ConfirmationModal.style.display = "block";
            }
        });
    });
    // Hides Modal
    let CancelBtn = document.getElementById("CancelBtn");
    if (!CancelBtn) {
        console.error("[ERROR] Unable to find CancelBtn");
        return;
    }
    CancelBtn.addEventListener("click", function () {
        ConfirmationModal.style.display = "none";
    });
    // Hides Modal
    let CloseBtn = document.getElementById("CloseBtn");
    if (!CloseBtn) {
        console.error("[ERROR] Unable to find CloseBtn");
        return;
    }
    CloseBtn.addEventListener("click", function () {
        ConfirmationModal.style.display = "none";
    });
}
