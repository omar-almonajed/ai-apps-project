(function($){
  const STORAGE_KEY = 'aiApps_v1';

  const SAMPLE_APPS = [
    { name:'VisionAI', company:'OpenVision', domain:'Healthcare', free:'no', desc:'نظام تحليل صور طبية معزَّز بالذكاء الصناعي.', website:'https://www.visionai.co/', image:'https://via.placeholder.com/150', video:'' },
    { name:'ChatPro', company:'TalkLab', domain:'Chatbots', free:'yes', desc:'مساعد محادثة متعدد اللغات.', website:'https://www.chatpro.ai/', image:'https://via.placeholder.com/150', video:'' },
    { name:'ShopSmart', company:'EcomSoft', domain:'E-Commerce', free:'no', desc:'توصيات منتجات ذكية.', website:'https://www.shopsmart.com/', image:'https://via.placeholder.com/150', video:'' },
    { name:'LearnMate', company:'EduWorks', domain:'Education', free:'yes', desc:'منصة تعليمية تكيُّفية.', website:'https://www.learnmate.com/', image:'https://via.placeholder.com/150', video:'' },
    { name:'RoboNav', company:'RoboCorp', domain:'Robotics', free:'no', desc:'نظام ملاحة لروبوتات الخدمة المنزلية.', website:'https://www.robonav.com/', image:'https://via.placeholder.com/150', video:'' }
  ];

  const escapeHtml = (s) => s ? String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])) : '';

  function ensureSampleApps(){
    if(!localStorage.getItem(STORAGE_KEY)){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_APPS));
    }
  }

  function getApps(){ ensureSampleApps(); return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  function saveApp(app){ const apps = getApps(); apps.push(app); localStorage.setItem(STORAGE_KEY, JSON.stringify(apps)); }

  function renderAppsTable(){
    const apps = getApps();
    const $body = $('#apps-body');
    $body.empty();
    if(!apps.length){ $('#apps-table').hide(); $('#no-apps').show(); return; }
    $('#apps-table').show(); $('#no-apps').hide();

    apps.forEach((a, idx)=>{
      const $tr = $('<tr></tr>')
        .append(`<td>${escapeHtml(a.name)}</td>`)
        .append(`<td>${escapeHtml(a.company)}</td>`)
        .append(`<td>${escapeHtml(a.domain)}</td>`)
        .append(`<td>${a.free==='yes'?'نعم':'لا'}</td>`)
        .append($('<td></td>').append(`<button class="btn-primary" data-idx="${idx}">تفاصيل</button>`));
      $body.append($tr);

      // تفاصيل التطبيق
      const mediaHtml = a.image || a.video ? `<div style="display:flex;gap:10px;margin-top:8px;">
        ${a.image?`<img src="${escapeHtml(a.image)}" style="max-width:150px;height:150px;object-fit:cover;border-radius:5px;">`:''}
        ${a.video?`<video controls style="max-width:150px;height:150px;border-radius:5px;"><source src="${escapeHtml(a.video)}" type="video/mp4">متصفحك لا يدعم الفيديو</video>`:''}
      </div>` : '';

      const $detRow = $(`
        <tr class="details-row" style="display:none;" data-details-for="${idx}">
          <td colspan="5">
            <strong>شرح:</strong> ${escapeHtml(a.desc)}<br>
            <strong>الرابط:</strong> <a href="${escapeHtml(a.website)}" target="_blank">${escapeHtml(a.website)}</a>
            ${mediaHtml}
          </td>
        </tr>
      `);
      $body.append($detRow);
    });

    $body.off('click','.btn-primary').on('click','.btn-primary', function(){
      const idx = $(this).data('idx');
      $(`tr.details-row[data-details-for="${idx}"]`).toggle();
    });
  }

  // Form validation
  const validators = {
    isAlphaNoSpace: str => /^[A-Za-z]+$/.test(str),
    isAlphaWithSpaces: str => /^[A-Za-z ]+$/.test(str),
    isValidURL: str => { try{ new URL(str); return true }catch{ return false } }
  };

  $(function(){
    if($('#apps-body').length) renderAppsTable();

    const $form = $('#addAppForm');
    if($form.length){
      $('#resetBtn').click(()=>{ $form[0].reset(); $('.error').text(''); });
      $form.submit(e=>{
        e.preventDefault();
        $('.error').text('');
        const name = $('#appName').val().trim();
        const company = $('#companyName').val().trim();
        const website = $('#website').val().trim();
        const free = $('#isFree').val();
        const domain = $('#domain').val();
        const desc = $('#description').val().trim();
        let hasError=false;

        if(!name || !validators.isAlphaNoSpace(name)){ $('#errAppName').text('حروف إنجليزية فقط بدون فراغات'); hasError=true; }
        if(!company || !validators.isAlphaWithSpaces(company)){ $('#errCompany').text('حروف إنجليزية فقط'); hasError=true; }
        if(!website || !validators.isValidURL(website)){ $('#errWebsite').text('رابط غير صالح'); hasError=true; }
        if(!domain){ $('#errDomain').text('اختر المجال'); hasError=true; }
        if(!desc || desc.length<10){ $('#errDesc').text('شرح مختصر على الأقل 10 أحرف'); hasError=true; }

        if(hasError) return;

        saveApp({name,company,website,free,domain,desc});
        window.location.href='apps.html';
      });
    }
  });

  // Expose globally
  window.myApp = { renderAppsTable, saveApp, validators, ensureSampleApps };
})(jQuery);
