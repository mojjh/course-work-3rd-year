const defaultReviews = [
    { stars: 5, text: "Отличный магазин!" },
    { stars: 4, text: "Быстрая доставка" },
    { stars: 5, text: "Кот в восторге 😸" }
];

let reviewIndex = 0;
const CARD_WIDTH = 340;
const reviewsContainer = document.getElementById("reviews");
const modal = document.getElementById("reviewModal");

function getReviews() {
    return JSON.parse(localStorage.getItem("reviews")) || defaultReviews;
}

function saveReviews(reviews) {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

function initReviews() {
    const reviews = getReviews();
    reviewsContainer.innerHTML = reviews.map(r => `
        <div class="review-card">
            <div>${"⭐".repeat(r.stars)}</div>
            <p>${r.text}</p>
        </div>
    `).join('');
    reviewIndex = 0;
    renderReviews();
}

function renderReviews() {
    const translateX = -(reviewIndex * CARD_WIDTH);
    reviewsContainer.style.transform = `translateX(${translateX}px)`;
}

function nextReview() {
    const reviews = getReviews();
    if (reviewIndex < reviews.length - 1) {
        reviewIndex++;
        renderReviews();
    }
}

function prevReview() {
    if (reviewIndex > 0) {
        reviewIndex--;
        renderReviews();
    }
}

function openReviewModal() {
    modal.style.display = "block";
}

function closeReviewModal() {
    modal.style.display = "none";
    document.getElementById("reviewText").value = "";
    document.getElementById("reviewStars").value = "5";
}

function addReview() {
    const stars = Number(document.getElementById("reviewStars").value);
    const text = document.getElementById("reviewText").value.trim();

    if (!text) {
        alert("Напишите текст отзыва!");
        return;
    }

    const reviews = getReviews();
    reviews.unshift({ stars, text });
    saveReviews(reviews);

    document.getElementById("reviewText").value = "";
    document.getElementById("reviewStars").value = "5";
    closeReviewModal();
    initReviews();
}


window.onclick = function(event) {
    if (event.target === modal) {
        closeReviewModal();
    }
}

initReviews();
