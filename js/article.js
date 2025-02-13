document.addEventListener("DOMContentLoaded", function() {
    const metaDate = document.querySelector('meta[name="creation-date"]').content;
    const publishedDate = new Date(metaDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.querySelector('.published-date').textContent = publishedDate;
});