document.addEventListener('DOMContentLoaded', () => {
    const metaImage = document.querySelector('meta[name="image"]').getAttribute('content');
    const heroSection = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    const titleText = document.querySelector('title').innerText;

    // Set the hero background image
    heroSection.style.backgroundImage = `url(${metaImage})`;

    // Set the hero title
    heroTitle.textContent = titleText;
});
