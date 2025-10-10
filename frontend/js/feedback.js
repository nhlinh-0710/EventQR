// Đánh giá sao
const stars = document.querySelectorAll("#stars i");
const rateText = document.getElementById("rate-text");
const texts = ["Rất tệ", "Tạm ổn", "Bình thường", "Tốt", "Tuyệt vời!"];

stars.forEach(star => {
  star.addEventListener("click", () => {
    const val = star.dataset.value;
    stars.forEach(s => s.classList.remove("active"));
    for (let i = 0; i < val; i++) stars[i].classList.add("active");
    rateText.textContent = texts[val - 1];
  });
});

// Toast khi gửi
const btn = document.getElementById("submitBtn");
const toast = document.getElementById("toast");
btn.addEventListener("click", (e) => {
  e.preventDefault(); // chặn reload
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
});

// Xử lý nút "Xem thêm" (không chuyển trang)
const seeMoreBtn = document.querySelector(".see-more");
const surveyRight = document.querySelector(".survey-right");

seeMoreBtn.addEventListener("click", (e) => {
  e.preventDefault(); // chặn điều hướng
  const more = document.createElement("div");
  more.className = "feedback-box";
  more.innerHTML = `
    <div class="stars">★★★★★</div>
    <p>"Sự kiện tổ chức rất chuyên nghiệp, tôi rất ấn tượng!"</p>
    <small>Gửi hôm qua</small>
  `;
  surveyRight.insertBefore(more, seeMoreBtn);
  seeMoreBtn.textContent = "Đã hiển thị thêm";
  seeMoreBtn.style.pointerEvents = "none";
  seeMoreBtn.style.opacity = "0.7";
});
