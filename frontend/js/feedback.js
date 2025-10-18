// feedback.js — EventQR Feedback interactions (scoped cho #feedback-section)

(function initFeedbackSection() {
    const root = document.getElementById('feedback-section');
    if (!root) return;
  
    // --- Elements
    const starsWrap = root.querySelector('#stars');
    const stars = starsWrap ? starsWrap.querySelectorAll('.fa-star') : [];
    const rateText = root.querySelector('#rate-text');
    const idea = root.querySelector('#idea');
    const nameInput = root.querySelector('.inputs input[type="text"]');
    const emailInput = root.querySelector('.inputs input[type="email"]');
    const subscribeRadios = root.querySelectorAll('input[name="sub"]');
    const checkboxes = root.querySelectorAll('.options .col:first-child input[type="checkbox"]');
    const submitBtn = root.querySelector('#submitBtn');
    const toast = root.querySelector('#toast');
  
    // --- Labels hiển thị cho điểm
    const labels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời!"];
    let selectedRating = 5; // mặc định theo UI của bạn
  
    // --- Helpers
    const setStarsVisual = (value) => {
      stars.forEach((el) => {
        const v = Number(el.dataset.value || '0');
        const active = v <= value;
        el.classList.toggle('active', active);
        // Nếu dùng Font Awesome, chuyển regular <-> solid cho đẹp:
        el.classList.toggle('fa-regular', !active);
        el.classList.toggle('fa-solid', active);
        el.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      if (rateText) {
        rateText.textContent = labels[Math.max(1, Math.min(5, value)) - 1];
      }
    };
  
    const showToast = (msg = "Cảm ơn bạn đã gửi phản hồi 💙") => {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2600);
    };
  
    const validateEmail = (val) => {
      if (!val) return true; // tuỳ chọn
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    };
  
    // --- Rating: hover + click + keyboard
    if (starsWrap && stars.length) {
      stars.forEach((el) => {
        // Hover preview
        el.addEventListener('mouseenter', () => {
          const v = Number(el.dataset.value || '0');
          setStarsVisual(v);
        });
        // Click chọn cố định
        el.addEventListener('click', () => {
          selectedRating = Number(el.dataset.value || '0');
          setStarsVisual(selectedRating);
        });
        // Keyboard (Space/Enter)
        el.setAttribute('tabindex', '0');
        el.addEventListener('keydown', (e) => {
          if (e.code === 'Space' || e.key === 'Enter') {
            e.preventDefault();
            selectedRating = Number(el.dataset.value || '0');
            setStarsVisual(selectedRating);
          }
          // mũi tên trái/phải để tăng/giảm
          if (e.key === 'ArrowRight') {
            selectedRating = Math.min(5, selectedRating + 1);
            setStarsVisual(selectedRating);
          }
          if (e.key === 'ArrowLeft') {
            selectedRating = Math.max(1, selectedRating - 1);
            setStarsVisual(selectedRating);
          }
        });
      });
  
      // Rời khỏi vùng sao → quay lại giá trị đã chọn
      starsWrap.addEventListener('mouseleave', () => setStarsVisual(selectedRating));
  
      // Khởi tạo theo mặc định
      setStarsVisual(selectedRating);
    }
  
    // --- Submit
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        // Thu thập dữ liệu
        const ideas = (idea?.value || "").trim();
        const nameVal = (nameInput?.value || "").trim();
        const emailVal = (emailInput?.value || "").trim();
        const subscribe = Array.from(subscribeRadios).find(r => r.checked)?.nextSibling?.textContent?.trim() || "Có";
  
        const impressed = Array.from(checkboxes)
          .filter(cb => cb.checked)
          .map(cb => {
            // Lấy text trong label
            const label = cb.closest('label');
            return label ? label.textContent.trim().replace(/^\s*$/, '') : 'Khác';
          });
  
        // Validate nhẹ
        if (!validateEmail(emailVal)) {
          showToast("Email không hợp lệ, vui lòng kiểm tra lại.");
          return;
        }
  
        // Disable nút khi đang gửi
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";
  
        // Payload (nếu cần gửi API)
        const payload = {
          rating: selectedRating,
          idea: ideas,
          impressed,                 // mảng các mục ấn tượng
          subscribe: subscribe,      // "Có" hoặc "Không"
          name: nameVal || null,
          email: emailVal || null,
          sentAt: new Date().toISOString()
        };
  
        // TODO: Gửi API thật (mẫu fetch dưới đây)
        // try {
        //   const res = await fetch('/api/feedback', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload)
        //   });
        //   if (!res.ok) throw new Error('Network error');
        // } catch (err) {
        //   console.error(err);
        //   showToast("Gửi thất bại, thử lại sau!");
        //   submitBtn.disabled = false;
        //   submitBtn.style.opacity = "1";
        //   return;
        // }
  
        // Hiện toast + reset form (demo local)
        console.log('[Feedback submitted]', payload);
        showToast("Cảm ơn bạn đã gửi phản hồi 💙");
  
        // Reset mềm: giữ sao đã chọn, clear text fields
        if (idea) idea.value = "";
        if (nameInput) nameInput.value = "";
        if (emailInput) emailInput.value = "";
  
        // Nếu muốn reset checkboxes về trạng thái ban đầu:
        // Array.from(checkboxes).forEach((cb, idx) => cb.checked = idx === 0); // mục đầu checked
        // Array.from(subscribeRadios).forEach((r, idx) => r.checked = idx === 0); // "Có"
  
        // Re-enable nút
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
        }, 600);
      });
    }
  })();
  