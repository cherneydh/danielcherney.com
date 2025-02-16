document.addEventListener("DOMContentLoaded", function() {
    const metaElement = document.querySelector('meta[name="creation-date"]');
    if (metaElement) {
        const metaDate = metaElement.content;
        const publishedDate = new Date(metaDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const publishedDateElement = document.querySelector('.published-date');
        if (publishedDateElement) {
            publishedDateElement.textContent = publishedDate;
        } else {
            console.error('Element with class "published-date" not found');
        }
    } else {
        console.error('Meta element with name "creation-date" not found');
    }
});
