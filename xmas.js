/* クリスマス演出（2026/12/1〜12/25 だけ自動で表示。12/26になると自動で元に戻ります）
   確認用：URLの末尾に ?xmas=1 を付けると、期間外でも表示されます */
(function(){
  try{
    var now=Date.now();
    var on = now>=Date.parse('2026-12-01T00:00:00+09:00') && now<=Date.parse('2026-12-25T23:59:59+09:00');
    if(/[?&]xmas=1/.test(location.search)) on=true;
    if(!on) return;

    /* 1) ふんわり雪（見た目だけ・タップの邪魔をしません） */
    var css='.xmas-snow{position:fixed;inset:0;pointer-events:none;z-index:9998;opacity:.85;'+
      'background-image:radial-gradient(circle,#F7C6D4 0 3px,transparent 4px),radial-gradient(circle,#F3B3C6 0 2px,transparent 3px),radial-gradient(circle,#fff 0 4px,transparent 5px);'+
      'background-size:180px 220px,120px 160px,260px 300px;background-position:0 0,40px 60px,90px 120px;animation:xmasSnow 22s linear infinite}'+
      '@keyframes xmasSnow{to{background-position:30px 220px,10px 160px,60px 300px}}'+
      '@media (prefers-reduced-motion:reduce){.xmas-snow{animation:none}}';
    var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
    var sn=document.createElement('div'); sn.className='xmas-snow'; sn.setAttribute('aria-hidden','true');
    document.body.appendChild(sn);

    /* 2) セラピスト写真をクリスマス版に */
    var map={'cast-natsuki-n1.jpg':'xmas-natsuki.jpg','cast-yuri-9.JPG':'xmas-yuri.jpg','cast-hajime-3.JPG':'xmas-hajime.jpg','cast-ibuki-1.jpg':'xmas-ibuki.jpg','cast-leo-1.JPG':'xmas-leo.jpg'};
    function swap(img){
      if(!img||img.tagName!=='IMG'||img.dataset.xmas) return;
      var s=img.getAttribute('src')||'';
      for(var k in map){
        if(s.slice(-k.length)===k){
          img.dataset.xmas='1';
          (function(img,xs){
            var t=new Image();                    /* 写真ファイルがある時だけ切り替える */
            t.onload=function(){
              if(img.classList.contains('m3-cast-photo')||img.classList.contains('m3-cast-photo-lg')){
                img.src=xs;                       /* 一覧のカード：差し替え */
              }else{
                var c=img.cloneNode(true);        /* 詳細の写真列：先頭に追加（元の写真も残る） */
                c.dataset.xmas='1'; c.src=xs;
                img.parentNode.insertBefore(c,img);
              }
            };
            t.src=xs;
          })(img,map[k]);
          return;
        }
      }
    }
    function run(root){ (root.querySelectorAll?root.querySelectorAll('img'):[]).forEach(swap); }
    run(document);
    new MutationObserver(function(ms){
      ms.forEach(function(m){ m.addedNodes.forEach(function(n){ if(n.nodeType===1){ if(n.tagName==='IMG') swap(n); else run(n); } }); });
    }).observe(document.body,{childList:true,subtree:true});
  }catch(e){}
})();
