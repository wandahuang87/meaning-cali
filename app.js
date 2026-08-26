var REVIEW_CODE = "2022";

var PRODUCTS = [
  { id:"camera", img:"camera", name:"Custom Disposable Film Camera",
    sub:"with NFC Sharing \u00b7 36 Exposures", price:40, unit:"per camera", minq:10,
    desc:"Fully custom printed disposable film camera with built-in flash, battery, and NFC sticker for instant digital photo sharing. Each camera body is personalized with your names, date, and artwork.",
    feats:["36 exposures preloaded","Built-in flash + battery","Full-wrap custom print","NFC tap-to-share"] },
  { id:"incense", img:"incense", name:"Personalized Wedding Incense Favors",
    sub:"Scented Sticks with Ceramic Holder", price:10, unit:"per set", minq:20,
    desc:"A quiet, sensory guest favor \u2014 scented incense sticks paired with a ceramic holder, presented in custom packaging illustrated with you and your partner.",
    feats:["Scented incense sticks","Ceramic holder","Custom illustrated box","Multiple scent options"] },
  { id:"airfreshener", img:"airfresh", name:"Wedding Air Freshener Favors",
    sub:"Illustrated Car Scent \u00b7 Bridal Gift", price:9, unit:"per piece", minq:20,
    desc:"A custom illustrated car air freshener featuring your own couple portrait \u2014 an unexpected favor your guests will actually keep and use long after the day.",
    feats:["Custom couple illustration","Long-lasting scent","Individually packaged","Unique keepsake"] },
  { id:"giftbox", img:"giftbox", name:"Custom Wedding Guest Gift Box",
    sub:"Personalized Favor Packaging", price:20, unit:"per box", minq:10,
    desc:"A complete curated gift set in custom printed packaging \u2014 personalized with your names, date, and illustration. Pair it with any of our favors to build your own welcome box.",
    feats:["Fully custom printed","Curated gift set","Multiple size options","Premium matte finish"] }
];

var REVIEWS = [
  { name:"Jessica", date:"June 2026", rating:5,
    text:"It's really good to order disposable cameras here! They created so much fun at our wedding \u2728",
    img:"review1", product:"Custom Disposable Film Camera" }
];

var newRating = 5, reviewImg = null;
var IMG = window.IMG || {};

function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function stars(n){ return "\u2605".repeat(n) + "\u2606".repeat(5-n); }

function renderProducts(){
  var html = PRODUCTS.map(function(p){
    var feats = p.feats.map(function(f){ return '<span class="feat">'+esc(f)+'</span>'; }).join('');
    return '<div class="product">'
      + '<div class="p-img"><img src="'+(IMG[p.img]||'')+'" alt="'+esc(p.name)+'"></div>'
      + '<div class="p-body"><div>'
      + '<h3>'+esc(p.name)+'</h3>'
      + '<p class="p-sub">'+esc(p.sub)+'</p>'
      + '<p class="p-desc">'+esc(p.desc)+'</p>'
      + '<div class="feats">'+feats+'</div></div>'
      + '<div><div class="p-foot">'
      + '<div><span class="price">$'+p.price+'</span><span class="unit">'+esc(p.unit)+'</span></div>'
      + '<div class="qty-wrap"><label for="qty-'+p.id+'">QTY</label>'
      + '<input type="number" min="0" step="1" id="qty-'+p.id+'" class="qty" placeholder="0"'
      + ' data-price="'+p.price+'" data-name="'+esc(p.name)+'"></div>'
      + '</div><p class="minq">Min. order: '+p.minq+' units</p></div>'
      + '</div></div>';
  }).join('');
  document.getElementById('products').innerHTML = html;

  var sel = document.getElementById('rprod');
  sel.innerHTML = '<option value="">Select product</option>' + PRODUCTS.map(function(p){
    return '<option value="'+esc(p.name)+'">'+esc(p.name)+'</option>'; }).join('');

  document.querySelectorAll('input.qty').forEach(function(i){
    i.addEventListener('input', updateSummary);
  });
}

function renderReviews(){
  document.getElementById('reviews').innerHTML = REVIEWS.map(function(r){
    var src = r.img ? (IMG[r.img] || r.img) : null;
    return '<div class="review"><div class="r-head"><div>'
      + '<span class="r-name">'+esc(r.name)+'</span><span class="r-date">'+esc(r.date)+'</span></div>'
      + '<span class="stars">'+stars(r.rating)+'</span></div>'
      + (r.product ? '<p class="r-prod">Purchased: '+esc(r.product)+'</p>' : '')
      + '<p class="r-text">'+esc(r.text)+'</p>'
      + (src ? '<img class="r-img" src="'+src+'" alt="Customer photo">' : '')
      + '</div>';
  }).join('');
  var avg = (REVIEWS.reduce(function(s,r){return s+r.rating;},0)/REVIEWS.length).toFixed(1);
  document.getElementById('review-count').textContent =
    REVIEWS.length + " review" + (REVIEWS.length!==1?"s":"") + " \u00b7 " + avg + " average";
}

function renderStars(){
  document.getElementById('stars').innerHTML = [1,2,3,4,5].map(function(n){
    return '<button class="star-btn'+(n<=newRating?' on':'')+'" data-n="'+n+'">\u2605</button>';
  }).join('');
}

function currentOrder(){
  var items = [];
  document.querySelectorAll('input.qty').forEach(function(inp){
    var q = parseInt(inp.value) || 0;
    if(q > 0) items.push({ name: inp.dataset.name, price: +inp.dataset.price, qty: q });
  });
  return items;
}

function updateSummary(){
  var items = currentOrder();
  var box = document.getElementById('summary');
  if(items.length === 0){ box.style.display = 'none'; }
  else {
    box.style.display = 'block';
    document.getElementById('sum-rows').innerHTML = items.map(function(i){
      return '<div class="sum-row"><span>'+esc(i.name)+' \u00d7 '+i.qty+'</span>'
        + '<span style="font-weight:500">$'+(i.price*i.qty).toFixed(2)+'</span></div>';
    }).join('');
    var total = items.reduce(function(s,i){ return s + i.price*i.qty; }, 0);
    document.getElementById('sum-total').textContent = '$' + total.toFixed(2);
  }
  var ok = items.length>0
    && document.getElementById('cname').value.trim()
    && document.getElementById('cemail').value.trim();
  document.getElementById('download').disabled = !ok;
}

function orderText(){
  var items = currentOrder();
  var total = items.reduce(function(s,i){ return s + i.price*i.qty; }, 0);
  function g(id){ return document.getElementById(id).value.trim(); }
  var L = [];
  L.push("===========================================");
  L.push("         MEANING BY W - ORDER FORM");
  L.push("===========================================");
  L.push("");
  L.push("Date: " + new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}));
  L.push("");
  L.push("CLIENT INFORMATION");
  L.push("-------------------------------------------");
  if(g('cname'))  L.push("Name:          " + g('cname'));
  if(g('cemail')) L.push("Email:         " + g('cemail'));
  if(g('wdate'))  L.push("Wedding Date:  " + g('wdate'));
  if(g('guests')) L.push("Guest Count:   " + g('guests'));
  if(g('refby'))  L.push("Referred By:   " + g('refby'));
  L.push("");
  L.push("ORDER DETAILS");
  L.push("-------------------------------------------");
  items.forEach(function(i){
    L.push(i.name);
    L.push("  " + i.qty + " x $" + i.price.toFixed(2) + "    =    $" + (i.price*i.qty).toFixed(2));
    L.push("");
  });
  L.push("-------------------------------------------");
  L.push("ESTIMATED TOTAL:              $" + total.toFixed(2));
  L.push("-------------------------------------------");
  if(g('notes')){
    L.push("");
    L.push("NOTES / SPECIAL REQUESTS");
    L.push("-------------------------------------------");
    L.push(g('notes'));
  }
  L.push("");
  L.push("===========================================");
  L.push("Please send this form to:");
  L.push("meaningcali@gmail.com");
  L.push("");
  L.push("Or have your wedding planner forward it");
  L.push("on your behalf.");
  L.push("");
  L.push("All items are made to order.");
  L.push("Production: 3-8 weeks depending on quantity.");
  L.push("Ships from California, USA.");
  L.push("===========================================");
  return L.join("\n");
}

function init(){
  document.getElementById('logo-top').src = IMG.logo || '';
  document.getElementById('logo-bottom').src = IMG.logo || '';

  renderProducts();
  renderReviews();

  ['cname','cemail'].forEach(function(id){
    document.getElementById(id).addEventListener('input', updateSummary);
  });

  document.getElementById('download').addEventListener('click', function(){
    var blob = new Blob([orderText()], {type:'text/plain'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Meaning-Order-' + (document.getElementById('cname').value.trim() || 'Form') + '.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    var s = document.getElementById('dl-success');
    s.style.display = 'block';
    setTimeout(function(){ s.style.display = 'none'; }, 5000);
  });

  document.getElementById('verify').addEventListener('click', function(){
    var v = document.getElementById('code').value.trim();
    var err = document.getElementById('code-err');
    if(v === REVIEW_CODE){
      document.getElementById('gate').style.display = 'none';
      document.getElementById('review-form').style.display = 'block';
      renderStars();
    } else {
      err.textContent = "That code isn't right. Check the card included with your order.";
      err.style.display = 'block';
    }
  });
  document.getElementById('code').addEventListener('keydown', function(e){
    if(e.key === 'Enter') document.getElementById('verify').click();
  });

  document.getElementById('stars').addEventListener('click', function(e){
    var b = e.target.closest('.star-btn');
    if(!b) return;
    newRating = +b.dataset.n;
    renderStars();
  });

  ['rname','rtext'].forEach(function(id){
    document.getElementById(id).addEventListener('input', function(){
      document.getElementById('submit-review').disabled =
        !(document.getElementById('rname').value.trim() && document.getElementById('rtext').value.trim());
    });
  });

  document.getElementById('rimg').addEventListener('change', function(e){
    var f = e.target.files[0];
    if(!f) return;
    var rd = new FileReader();
    rd.onload = function(){
      reviewImg = rd.result;
      var p = document.getElementById('rpreview');
      p.src = reviewImg; p.style.display = 'block';
    };
    rd.readAsDataURL(f);
  });

  document.getElementById('submit-review').addEventListener('click', function(){
    REVIEWS.unshift({
      name: document.getElementById('rname').value.trim(),
      date: new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"}),
      rating: newRating,
      text: document.getElementById('rtext').value.trim(),
      img: reviewImg,
      product: document.getElementById('rprod').value
    });
    renderReviews();
    document.getElementById('rname').value = '';
    document.getElementById('rtext').value = '';
    document.getElementById('rprod').value = '';
    document.getElementById('rpreview').style.display = 'none';
    reviewImg = null; newRating = 5;
    document.getElementById('submit-review').disabled = true;
    document.getElementById('gate').style.display = 'block';
    document.getElementById('review-form').style.display = 'none';
    document.getElementById('code').value = '';
    document.getElementById('code-err').style.display = 'none';
  });
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
