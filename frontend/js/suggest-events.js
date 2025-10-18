document.addEventListener("DOMContentLoaded", () => {
  const evGrid = document.getElementById("evGrid");
  const hotList = document.getElementById("hotList");
  const hotCount = document.getElementById("hotCount");
  const evSearch = document.getElementById("evSearch");
  const evOnlyNew = document.getElementById("evOnlyNew");
  const tabs = document.querySelectorAll(".tab");
  const pagination = document.getElementById("evPagination");

  // ======= DỮ LIỆU MẪU =======
  const events = [
    { id: 1, name: "Tech Expo 2025", place: "Đà Nẵng", type: "Công nghệ", dateStart: "2025-10-20", dateEnd: "2025-10-22", hot: true },
    { id: 2, name: "Hội chợ Ẩm thực", place: "Hà Nội", type: "Ẩm thực", dateStart: "2025-10-10", dateEnd: "2025-10-12", hot: false },
    { id: 3, name: "Marathon Mùa Thu", place: "Huế", type: "Thể thao", dateStart: "2025-10-16", dateEnd: "2025-10-17", hot: true },
    { id: 4, name: "Nhạc hội mùa đông", place: "TP.HCM", type: "Giải trí", dateStart: "2025-12-01", dateEnd: "2025-12-02", hot: false },
    { id: 5, name: "Startup Việt 2025", place: "Hà Nội", type: "Kinh doanh", dateStart: "2025-10-25", dateEnd: "2025-10-27", hot: false },
    { id: 6, name: "Music Vibes Fest", place: "Đà Lạt", type: "Âm nhạc", dateStart: "2025-11-02", dateEnd: "2025-11-03", hot: true },
    { id: 7, name: "Hội nghị Nhà đầu tư", place: "TP.HCM", type: "Tài chính", dateStart: "2025-11-10", dateEnd: "2025-11-11", hot: false },
    { id: 8, name: "Triển lãm Game Việt", place: "Hà Nội", type: "Giải trí", dateStart: "2025-10-30", dateEnd: "2025-10-31", hot: true },
    { id: 9, name: "Lễ hội Trà Bảo Lộc", place: "Lâm Đồng", type: "Văn hóa", dateStart: "2025-11-15", dateEnd: "2025-11-17", hot: false },
    { id: 10, name: "Thể thao Sinh viên 2025", place: "Đà Nẵng", type: "Thể thao", dateStart: "2025-11-18", dateEnd: "2025-11-19", hot: true },
  ];

  // ======= HÀM HỖ TRỢ =======
  const today = new Date();
  const parse = d => new Date(d);
  const getStatus = e => {
    const s = parse(e.dateStart), en = parse(e.dateEnd);
    if (today < s) return "upcoming";
    if (today <= en) return "ongoing";
    return "completed";
  };
  const isNew = e => (today - parse(e.dateStart)) / (1000 * 3600 * 24) <= 7;

  // ======= BIẾN PHÂN TRANG =======
  let currentPage = 1;
  const itemsPerPage = 4;
  let filteredEvents = [...events];

  // ======= HIỂN THỊ SỰ KIỆN (CÓ HIỆU ỨNG MỜ VÀ KHÔNG NHẢY TRANG) =======
  function render(list) {
    evGrid.style.opacity = 0; // fade-out khi chuyển trang

    setTimeout(() => {
      const start = (currentPage - 1) * itemsPerPage;
      const paginated = list.slice(start, start + itemsPerPage);

      evGrid.innerHTML = paginated.map(e => `
        <div class="event-card">
          <h4>${e.name}</h4>
          <p><b>Địa điểm:</b> ${e.place}</p>
          <p><b>Thể loại:</b> ${e.type}</p>
          <p><b>Thời gian:</b> ${e.dateStart} → ${e.dateEnd}</p>
          <span class="tag ${getStatus(e)}">${getStatus(e)}</span>
        </div>
      `).join("") || "<p class='muted'>Không có sự kiện nào phù hợp.</p>";

      renderPagination(list.length);
      evGrid.style.opacity = 1; // fade-in lại
    }, 200);
  }

  // ======= PHÂN TRANG (← → & CÁC NÚT SỐ) =======
  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = "";

    if (totalPages <= 1) return; // chỉ hiện khi có nhiều hơn 1 trang

    // ← nút trước
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "←";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        render(filteredEvents);
      }
    });
    pagination.appendChild(prevBtn);

    // nút số trang
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => {
        currentPage = i;
        render(filteredEvents);
      });
      pagination.appendChild(btn);
    }

    // → nút sau
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "→";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        render(filteredEvents);
      }
    });
    pagination.appendChild(nextBtn);
  }

  // ======= DANH SÁCH HOT =======
  function renderHot() {
    const hotEvents = events.filter(e => e.hot);
    hotCount.textContent = `${hotEvents.length} sự kiện`;
    hotList.innerHTML = hotEvents
      .map(e => `<li>${e.name} (${e.place})</li>`)
      .join("");
  }

  // ======= LỌC THEO TÌM KIẾM / TAB / CHECKBOX =======
  function applyFilter() {
    const keyword = evSearch.value.toLowerCase();
    const active = document.querySelector(".tab.active").dataset.filter;

    filteredEvents = events.filter(e =>
      e.name.toLowerCase().includes(keyword) ||
      e.place.toLowerCase().includes(keyword) ||
      e.type.toLowerCase().includes(keyword)
    );

    if (evOnlyNew.checked)
      filteredEvents = filteredEvents.filter(isNew);

    if (active !== "all")
      filteredEvents = filteredEvents.filter(e => getStatus(e) === active);

    currentPage = 1;
    render(filteredEvents);
  }

  // ======= GẮN SỰ KIỆN NGƯỜI DÙNG =======
  evSearch.addEventListener("input", applyFilter);
  evOnlyNew.addEventListener("change", applyFilter);

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      applyFilter();
    });
  });

  // ======= KHỞI TẠO LẦN ĐẦU =======
  render(filteredEvents);
  renderHot();

  window.addEventListener("scroll", () => {
  const topbar = document.querySelector(".topbar");
  if (window.scrollY > 10) topbar.classList.add("scrolled");
  else topbar.classList.remove("scrolled");
});

});
