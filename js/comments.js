document.addEventListener("DOMContentLoaded", function() {
    fetch("comments.json")
        .then(response => response.json())
        .then(data => {
            const commentsList = document.getElementById("comments-list");
            data.forEach(comment => {
                const commentElement = document.createElement("div");
                commentElement.className = "comment";
                commentElement.innerHTML = `
                    <p><strong>${comment.name}</strong> (${new Date(comment.date).toLocaleString()}):</p>
                    <p>${comment.comment}</p>
                    ${comment.replyingTo ? `<p>Replying to comment ID: ${comment.replyingTo}</p>` : ""}
                    <p>Article: ${comment.article}</p>
                    <button class="reply-button" data-id="${comment.id}">Reply</button>
                `;
                commentsList.appendChild(commentElement);
            });

            // Add event listeners to reply buttons
            document.querySelectorAll(".reply-button").forEach(button => {
                button.addEventListener("click", function() {
                    const commentId = this.getAttribute("data-id");
                    document.getElementById("replyingTo").value = commentId;
                    document.getElementById("comment").focus();
                });
            });
        });

    document.getElementById("submit-comment").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the form from refreshing the page
        const name = document.getElementById("name").value;
        const comment = document.getElementById("comment").value;
        const replyingTo = document.getElementById("replyingTo").value || null;
        const article = document.getElementById("article").value;

        // Get the reCAPTCHA token
        var recaptchaToken = document.querySelector('.g-recaptcha-response').value;
        
        if (recaptchaToken) {
            const newComment = { name, comment, replyingTo, article, recaptchaToken };
            
            fetch("https://danielcherney.com/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newComment)
            })
            .then(response => response.json())
            .then(newComment => {
                const commentElement = document.createElement("div");
                commentElement.className = "comment";
                commentElement.innerHTML = `
                    <p><strong>${newComment.name}</strong> (${new Date(newComment.date).toLocaleString()}):</p>
                    <p>${newComment.comment}</p>
                    ${newComment.replyingTo ? `<p>Replying to comment ID: ${newComment.replyingTo}</p>` : ""}
                    <p>Article: ${newComment.article}</p>
                    <button class="reply-button" data-id="${newComment.id}">Reply</button>
                `;
                commentsList.appendChild(commentElement);

                // Add event listener to the new reply button
                commentElement.querySelector(".reply-button").addEventListener("click", function() {
                    const commentId = this.getAttribute("data-id");
                    document.getElementById("replyingTo").value = commentId;
                    document.getElementById("comment").focus();
                });

                // Optionally, reset the form and clear the reCAPTCHA
                document.getElementById("your_form").reset();
                grecaptcha.reset();
            });
        } else {
            alert('Please complete the reCAPTCHA');
        }
    });
});