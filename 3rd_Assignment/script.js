document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query.trim() !== "") {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
});
document.getElementById("flask").addEventListener("click", function() {
    window.location.href = "https://labs.google.com/search?source=hp&authuser=0";
});
document.getElementById("menu").addEventListener("click", function() {
    window.location.href = "https://www.google.co.in/intl/en/about/products";
});
document.getElementById("mic").addEventListener("click", function() {
    window.location.href = "https://www.google.com/voice search";
});
document.getElementById("lens").addEventListener("click", function() {
    window.location.href = "https://lens.google/";
});