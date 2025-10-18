(() => {
    const tz = 'Asia/Ho_Chi_Minh';
    const $  = (s,root=document)=>root.querySelector(s);
    const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));
  
    const wrap = document.getElementById('my-tickets');
    if(!wrap){ console.warn('tickets.js: #my-tickets not found'); return; }
  
    const grid   = $('#tickets-grid', wrap);
    const tabs   = $$('.tab', wrap);
    const search = $('#tk-search', wrap);
    const sort   = $('#tk-sort', wrap);
    const viewBtns = $$('.view-btn', wrap);
  
    const statUpcoming = $('#stat-upcoming', wrap.closest('.tickets-section'));
    const statUsed     = $('#stat-used', wrap.closest('.tickets-section'));
    const statCanceled = $('#stat-canceled', wrap.closest('.tickets-section'));
  
    const cards = $$('.ticket-card', grid);
  
    // ===== Formats =====
    const money = v => (Number(v)||0).toLocaleString('vi-VN') + ' đ';
    const fmtRange = (sISO,eISO)=>{
      const s=new Date(sISO), e=new Date(eISO);
      const fm=d=>d.toLocaleString('vi-VN',{timeZone:tz, hour12:false, day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'}).replace(',', '');
      return `${fm(s)} – ${fm(e)}`;
    };
  
    // ===== Paint initial meta =====
    function paintCard(card){
      const range = card.querySelector('[data-date-range]');
      if(range) range.textContent = fmtRange(card.dataset.start, card.dataset.end);
      const price = card.querySelector('[data-price]');
      if(price) price.textContent = money(card.dataset.price);
    }
    cards.forEach(paintCard);
  
    // ===== Stats =====
    function updateStats(){
      const visible = cards.filter(c => c.style.display !== 'none');
      const cnt = (st)=>visible.filter(c=>c.dataset.status===st).length;
      statUpcoming.textContent = cnt('upcoming');
      statUsed.textContent     = cnt('used');
      statCanceled.textContent = cnt('canceled');
    }
  
    // ===== Filters =====
    function applyFilters(){
      const active = wrap.querySelector('.tab.active')?.dataset.filter || 'all';
      const q = (search.value||'').trim().toLowerCase();
  
      cards.forEach(card=>{
        const st = card.dataset.status;
        const hay = (
          card.dataset.name + ' ' +
          card.dataset.order + ' ' +
          card.dataset.venue
        ).toLowerCase();
        const hitTab = (active==='all') || (st===active);
        const hitText = !q || hay.includes(q);
        card.style.display = (hitTab && hitText) ? '' : 'none';
      });
  
      sortCards();
      updateStats();
    }
  
    // ===== Sort =====
    function sortCards(){
      const mode = sort.value;
      const arr = cards.slice().filter(c=>c.style.display!=='none');
      const cmp = {
        date_desc: (a,b)=> new Date(b.dataset.start)-new Date(a.dataset.start),
        date_asc:  (a,b)=> new Date(a.dataset.start)-new Date(b.dataset.start),
        name_asc:  (a,b)=> a.dataset.name.localeCompare(b.dataset.name,'vi'),
        name_desc: (a,b)=> b.dataset.name.localeCompare(a.dataset.name,'vi'),
      }[mode];
  
      arr.sort(cmp);
      arr.forEach(el=>grid.appendChild(el)); // re-order
    }
  
    tabs.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        tabs.forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
        btn.classList.add('active'); btn.setAttribute('aria-selected','true');
        applyFilters();
      });
    });
    search.addEventListener('input', ()=>{ clearTimeout(search._t); search._t=setTimeout(applyFilters,120); });
    sort.addEventListener('change', applyFilters);
  
    viewBtns.forEach(b=>{
      b.addEventListener('click', ()=>{
        viewBtns.forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        grid.classList.toggle('list', b.dataset.view==='list');
      });
    });
  
    // ===== Modal =====
    const overlay = $('#ticket-modal-root .overlay');
    const modal   = $('#ticket-modal');
    const openModal = ()=>{ overlay.hidden=false; modal.hidden=false; document.documentElement.style.overflow='hidden'; };
    const closeModal= ()=>{ overlay.hidden=true; modal.hidden=true; document.documentElement.style.overflow=''; };
  
    document.addEventListener('click', e=>{
      if(e.target.matches('[data-close]')) closeModal();
    });
    overlay.addEventListener('click', closeModal);
  
    function openTicket(card){
      $('#m-title').textContent = card.dataset.name;
      $('#m-image').src = card.querySelector('.ticket-media img').src;
      $('#m-date').textContent = fmtRange(card.dataset.start, card.dataset.end);
      $('#m-venue').textContent = card.dataset.venue;
      $('#m-order').textContent = card.dataset.order;
      $('#m-seat').textContent = card.dataset.seat;
      $('#m-price').textContent = money(card.dataset.price);
  
      const statusMap = {
        upcoming: {text:'Sắp diễn ra', cls:'is-upcoming'},
        used:     {text:'Đã dùng', cls:'is-used'},
        canceled: {text:'Đã hủy', cls:'is-canceled'},
      };
      const st = statusMap[card.dataset.status] || statusMap.upcoming;
      const stNode = $('#m-status');
      stNode.textContent = st.text;
      stNode.className = 'tp-status badge '+st.cls;
  
      // QR code (sử dụng API công cộng; offline thì có fallback)
      const data = encodeURIComponent(`${card.dataset.order}|${card.dataset.name}|${card.dataset.start}`);
      $('#m-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${data}`;
  
      openModal();
    }
  
    grid.addEventListener('click', (e)=>{
      const card = e.target.closest('.ticket-card');
      if(!card) return;
      const btn = e.target.closest('[data-action]');
      if(!btn) return;
      const act = btn.dataset.action;
      if(act==='detail'){
        if(card.dataset.status==='canceled') return;
        openTicket(card);
      }else if(act==='wallet'){
        btn.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
        btn.disabled = true;
      }else if(act==='invoice'){
        alert('Tải hóa đơn: đang mô phỏng (kết nối backend để tải file PDF).');
      }else if(act==='support'){
        alert('Liên hệ hỗ trợ: support@yourdomain.com');
      }
    });
  
    // ===== Print & Download PNG =====
    $('#btn-print').addEventListener('click', ()=> window.print());
    $('#btn-download').addEventListener('click', ()=>{
      // Tải ảnh từ QR + overlay đơn giản (capture mô phỏng)
      const qr = $('#m-qr');
      const link = document.createElement('a');
      link.href = qr.src;
      link.download = `${$('#m-order').textContent}.png`;
      link.click();
    });
  
    // ===== init first render =====
    applyFilters();
  })();
  