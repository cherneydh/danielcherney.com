document.addEventListener("DOMContentLoaded", function() {
    fetch("comments.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();  // Fetch the response as text
        })
        .then(text => {
            console.log('Fetched text:', text);  // Log the fetched text to debug
            try {
                const data = JSON.parse(text);  // Try to parse the JSON
                console.log('Parsed JSON:', data);  // Log the parsed JSON to debug
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
            } catch (error) {
                console.error('There was a problem parsing the JSON:', error);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    document.getElementById("submit-comment").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the form from refreshing the page
        const name = document.getElementById("name").value;
        const comment = document.getElementById("comment").value;
        const replyingTo = document.getElementById("replyingTo").value || null;
        const article = document.getElementById("article").value;

        // Get the reCAPTCHA token
        var recaptchaTokenElement = document.querySelector('.g-recaptcha-response');
        if (recaptchaTokenElement) {
            var recaptchaToken = recaptchaTokenElement.value;
            if (recaptchaToken) {
                const newComment = { name, comment, replyingTo, article, recaptchaToken };
                
                fetch("https://danielcherney.com/comments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newComment)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text(); // Fetch the response as text
                })
                .then(text => {
                    console.log('Fetched text:', text);  // Log the fetched text to debug
                    try {
                        const newComment = JSON.parse(text);  // Try to parse the JSON
                        console.log('Parsed JSON:', newComment);  // Log the parsed JSON to debug
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
                    } catch (error) {
                        console.error('There was a problem parsing the JSON:', error);
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            } else {
                alert('Please complete the reCAPTCHA');
            }
        } else {
            console.error('The reCAPTCHA element is not found');
        }
    });
});
