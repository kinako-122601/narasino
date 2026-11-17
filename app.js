const starterSpots = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "二葉海神 第一支店",
    area: "海神（東海神駅）",
    category: "デカ盛り",
    description: "カツカレーやカツ丼の大盛りが評判の食堂。普通盛りでも大盛り相当との紹介があります。",
    address: "千葉県船橋市海神2-14-19",
    hours: "11:30〜15:00／17:00〜19:45（水曜休）",
    phone: "047-422-6611",
    menu: "カツカレー・カツ丼",
    price: "1,000円台（参考）",
    image: "assets/food/curry-katsu.jpg",
    imageAlt: "カツカレーの参考写真",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Chicken_katsu_curry.jpg",
    color: "#e9c995",
    reviews: [],
    isSeed: true,
    isFromDatabase: false,
    sourceUrl: "https://ts-gourmet.net/funabashi-dekamori/",
    infoUrl: "https://tabelog.com/chiba/A1202/A120201/12022060/",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "福徳食堂",
    area: "本中山（原木中山駅）",
    category: "大盛り",
    description: "ボリュームのある定食が評判。特にチキンカツ定食をがっつり食べたい日に。",
    address: "千葉県船橋市本中山7-7-1 メトロセンター内",
    hours: "11:00〜23:15（定休日なしの情報あり）",
    phone: "047-333-9870",
    menu: "チキンカツ定食",
    price: "1,000円台（参考）",
    image: "assets/food/chicken-cutlet.jpg",
    imageAlt: "チキンカツ定食の参考写真",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Chicken_Cutlet_001.jpg",
    color: "#edc8aa",
    reviews: [],
    isSeed: true,
    isFromDatabase: false,
    sourceUrl: "https://ts-gourmet.net/funabashi-dekamori/",
    infoUrl: "https://tabelog.com/chiba/A1202/A120201/12032352/",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    name: "大乃家食堂",
    area: "船橋市地方卸売市場",
    category: "大盛り",
    description: "船橋市場の食堂。海鮮がたっぷりのった丼は、仕入れによってネタが変わるそうです。",
    address: "千葉県船橋市市場1-8-1 船橋市地方卸売市場 関連棟7号通路",
    hours: "市場営業日 7:00〜12:30（水・日・祝休の情報あり）",
    phone: "047-423-2489",
    menu: "海鮮丼",
    price: "1,000円台（参考）",
    image: "assets/food/seafood-bowl.jpg",
    imageAlt: "海鮮丼の参考写真",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Seafood_bowl.jpg",
    color: "#e5d19c",
    reviews: [],
    isSeed: true,
    isFromDatabase: false,
    sourceUrl: "https://ts-gourmet.net/funabashi-dekamori/",
    infoUrl: "https://funabashi-ichiba.jp/relation/5125/",
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    name: "ビッグテキサス 船橋店",
    area: "本町（京成船橋駅）",
    category: "デカ盛り",
    description: "リブステーキはサイズを選べ、最大1kgまで対応との紹介があります。食べる量に合わせて注文できます。",
    address: "千葉県船橋市本町2-11-12 三善ビル1F",
    hours: "11:30〜15:00／17:00〜23:00（定休日は店舗へ確認）",
    phone: "047-433-0290",
    menu: "リブステーキ（サイズ選択可）",
    price: "要確認",
    image: "assets/food/steak.jpg",
    imageAlt: "リブステーキの参考写真",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Ikinari_Steak_rib_eye_steak.jpg",
    color: "#cddbc4",
    reviews: [],
    isSeed: true,
    isFromDatabase: false,
    sourceUrl: "https://ts-gourmet.net/funabashi-dekamori/",
    infoUrl: "https://page.line.me/468ewbak",
  },
];

const supabaseConfig = window.SUPABASE_CONFIG || {};
const supabaseUrl = String(supabaseConfig.url || "").replace(/\/+$/, "");
const supabaseAnonKey = String(supabaseConfig.anonKey || "");

const grid = document.querySelector("#spot-grid");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");
const shopModal = document.querySelector("#shop-modal");
const detailModal = document.querySelector("#detail-modal");
const detailBody = document.querySelector("#detail-body");
const toast = document.querySelector("#toast");
const shopForm = document.querySelector("#shop-form");
const backendStatus = document.querySelector("#backend-status");
let spots = starterSpots;
let activeSpotId = null;
let toastTimer;

function hasSupabaseConfig() {
  try {
    const url = new URL(supabaseUrl);
    return ["http:", "https:"].includes(url.protocol) && supabaseAnonKey.length > 0;
  } catch {
    return false;
  }
}

function setBackendStatus(message, disablePosting = false) {
  backendStatus.textContent = message;
  backendStatus.hidden = !message;
  document.querySelectorAll(".add-post-button").forEach((button) => {
    button.disabled = disablePosting;
  });
}

async function supabaseRequest(path, { method = "GET", body } = {}) {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase URL or anon public key is not configured.");
  }
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      ...(method === "POST" ? { Prefer: "return=representation" } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Supabase request failed (${response.status}): ${responseText}`);
  }
  return responseText ? JSON.parse(responseText) : null;
}

function formatReviewDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
    .format(date).replaceAll("/", ".");
}

function mapReview(review) {
  return {
    id: review.id,
    name: review.nickname,
    rating: review.rating,
    text: review.body,
    date: formatReviewDate(review.created_at),
    createdAt: review.created_at,
  };
}

function mapSpot(spot) {
  const starterSpot = starterSpots.find((item) => item.id === spot.id);
  return {
    ...starterSpot,
    ...spot,
    emoji: starterSpot?.emoji || "🍽️",
    color: starterSpot?.color || "#dce7d4",
    stamp: "みんなの\nおすすめ",
    isSeed: Boolean(starterSpot),
    isFromDatabase: true,
    sourceUrl: starterSpot?.sourceUrl,
    infoUrl: spot.info_url || starterSpot?.infoUrl,
    image: starterSpot?.image || "assets/food/ramen.jpg",
    imageAlt: starterSpot?.imageAlt || "お店の参考写真",
    imageSourceUrl: starterSpot?.imageSourceUrl || "https://commons.wikimedia.org/wiki/File:Ramen-2.jpg",
    reviews: (spot.reviews || []).map(mapReview)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  };
}

async function loadSpots() {
  if (!hasSupabaseConfig()) {
    spots = starterSpots;
    setBackendStatus("共有機能を使うには、supabase-config.js に Supabase の Project URL と anon public key を設定してください。", true);
    render();
    return;
  }
  try {
    const rows = await supabaseRequest(
      "shops?select=id,name,area,category,description,menu,price,address,hours,phone,info_url,created_at,reviews(id,nickname,rating,body,created_at)&order=created_at.desc",
    );
    if (!Array.isArray(rows)) throw new Error("Supabase returned an invalid shop list.");
    const databaseSpots = rows.map(mapSpot);
    const databaseSeedIds = new Set(databaseSpots.filter((spot) => spot.isSeed).map((spot) => spot.id));
    const missingStarterSpots = starterSpots.filter((spot) => !databaseSeedIds.has(spot.id));
    spots = [...databaseSpots, ...missingStarterSpots];
    setBackendStatus("");
  } catch (error) {
    console.error("共有データを読み込めませんでした。", error);
    setBackendStatus("共有データを読み込めませんでした。Supabase の設定とデータベースの状態を確認して、ページを再読み込みしてください。");
  }
  render();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function averageRating(spot) {
  if (!spot.reviews.length) return null;
  return spot.reviews.reduce((total, review) => total + review.rating, 0) / spot.reviews.length;
}

function render() {
  const query = searchInput.value.trim().toLocaleLowerCase("ja");
  const category = categoryFilter.value;
  let visibleSpots = spots.filter((spot) => {
    const matchesCategory = category === "all" || spot.category === category;
    const searchable = [spot.name, spot.area, spot.category, spot.description, spot.menu, spot.address].join(" ").toLocaleLowerCase("ja");
    return matchesCategory && searchable.includes(query);
  });

  if (sortFilter.value === "rating") {
    visibleSpots.sort((a, b) => (averageRating(b) ?? 0) - (averageRating(a) ?? 0));
  } else if (sortFilter.value === "reviews") {
    visibleSpots.sort((a, b) => b.reviews.length - a.reviews.length);
  }

  grid.innerHTML = visibleSpots.map((spot) => {
    const rating = averageRating(spot);
    const stamp = escapeHTML(spot.stamp || "推し\nスポット").replace(/\n/g, "<br>");
    return `
      <article class="spot-card" tabindex="0" role="button" aria-label="${escapeHTML(spot.name)}の詳細とレビュー">
        <div class="card-visual" style="--card-bg:${escapeHTML(spot.color || "#e9eee2")}">
          <span class="card-category">${escapeHTML(spot.category)}</span>
          ${spot.isSeed ? '<span class="card-sample">初期掲載</span>' : ""}
          <img class="card-photo" src="${escapeHTML(spot.image)}" alt="${escapeHTML(spot.imageAlt)}" loading="lazy" />
          <span class="card-photo-note">参考写真</span>
          <span class="card-stamp">${stamp}</span>
        </div>
        <div class="card-info">
          <div class="card-meta">
            <span>⌖ ${escapeHTML(spot.area)}</span>
            <span class="card-rating">${rating ? `<span>★</span> ${rating.toFixed(1)}` : "レビューなし"}</span>
          </div>
          <h3>${escapeHTML(spot.name)}</h3>
          <p class="card-description">${escapeHTML(spot.description)}</p>
          <div class="card-bottom">
            <span class="card-menu"><span>✳</span>${escapeHTML(spot.menu || "おすすめメニュー募集中")}</span>
            <span class="card-reviews">レビュー ${spot.reviews.length}件 ↗</span>
          </div>
        </div>
      </article>`;
  }).join("");

  document.querySelector("#results-count").textContent = visibleSpots.length;
  document.querySelector("#empty-state").hidden = visibleSpots.length !== 0;
  document.querySelector("#sample-note").hidden = !spots.some((spot) => spot.isSeed);
  document.querySelector("#spot-count").textContent = spots.length;
  document.querySelector("#review-count").textContent = spots.reduce((count, spot) => count + spot.reviews.length, 0);
  grid.querySelectorAll(".spot-card").forEach((card, index) => {
    card.addEventListener("click", () => openDetails(visibleSpots[index].id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetails(visibleSpots[index].id);
      }
    });
  });
}

function openShopModal() {
  shopForm.reset();
  shopModal.showModal();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function openDetails(id) {
  activeSpotId = id;
  const spot = spots.find((item) => item.id === id);
  if (!spot) return;
  const rating = averageRating(spot);
  const reviewsHTML = spot.reviews.length
    ? spot.reviews.map((review) => `
      <article class="review-item">
        <div class="review-item-top">
          <strong>${escapeHTML(review.name)}</strong>
          <span>${escapeHTML(review.date)}</span>
        </div>
        <div class="review-stars" aria-label="${review.rating}つ星">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
        <p>${escapeHTML(review.text)}</p>
      </article>`).join("")
    : '<p class="no-reviews">まだレビューがありません。最初のレビューを書いてみませんか？</p>';
  const addressHTML = spot.address
    ? `<div class="shop-contact-row"><dt>住所</dt><dd>${escapeHTML(spot.address)} <a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(spot.address)}" target="_blank" rel="noopener noreferrer">地図</a></dd></div>`
    : "";
  const hoursHTML = spot.hours
    ? `<div class="shop-contact-row"><dt>営業時間</dt><dd>${escapeHTML(spot.hours)}</dd></div>`
    : "";
  const phoneHTML = spot.phone
    ? `<div class="shop-contact-row"><dt>電話</dt><dd><a href="tel:${escapeHTML(spot.phone.replace(/[^\d+]/g, ""))}">${escapeHTML(spot.phone)}</a></dd></div>`
    : "";
  const contactHTML = addressHTML || hoursHTML || phoneHTML
    ? `<dl class="shop-contact">${addressHTML}${hoursHTML}${phoneHTML}</dl>`
    : "";
  const infoUrl = safeWebUrl(spot.infoUrl);
  const volumeSourceUrl = safeWebUrl(spot.sourceUrl);
  const imageSourceUrl = safeWebUrl(spot.imageSourceUrl);
  const sourceLinks = [
    infoUrl ? `<a href="${escapeHTML(infoUrl)}" target="_blank" rel="noopener noreferrer">店舗情報</a>` : "",
    volumeSourceUrl ? `<a href="${escapeHTML(volumeSourceUrl)}" target="_blank" rel="noopener noreferrer">大盛り情報（TSグルメ）</a>` : "",
    imageSourceUrl ? `<a href="${escapeHTML(imageSourceUrl)}" target="_blank" rel="noopener noreferrer">参考写真（Wikimedia Commons・CC0）</a>` : "",
  ].filter(Boolean);
  const sourceHTML = sourceLinks.length
    ? `<p class="source-note">出典：${sourceLinks.join(" ／ ")}。営業時間・価格は変更されることがあるため、来店前にご確認ください。</p>`
    : "";

  detailBody.innerHTML = `
    <div class="detail-heading">
      <span class="detail-category">${escapeHTML(spot.category)}</span>
      <h2 id="detail-title">${escapeHTML(spot.name)}</h2>
      <span class="detail-area">⌖ ${escapeHTML(spot.area)}</span>
    </div>
    <p class="detail-summary">${escapeHTML(spot.description)}</p>
    ${contactHTML}
    ${sourceHTML}
    <div class="detail-facts">
      <span>おすすめ <strong>${escapeHTML(spot.menu || "募集中")}</strong></span>
      <span>予算 <strong>${escapeHTML(spot.price || "情報なし")}</strong></span>
      <span>評価 <strong>${rating ? `★ ${rating.toFixed(1)}` : "—"}</strong></span>
    </div>
    <div class="review-heading"><h3>みんなのレビュー</h3><span>${spot.reviews.length}件</span></div>
    <div class="review-list">${reviewsHTML}</div>
    ${spot.isSeed && !spot.isFromDatabase
      ? '<p class="sample-detail-note">この店舗のレビュー共有には、Supabaseへの初期店舗データ登録が必要です。</p>'
      : `<form class="review-form" id="review-form">
      <h3>このお店のレビューを書く</h3>
      <label class="field-label">ニックネーム
        <input name="reviewer" required maxlength="30" placeholder="例：まんぷく太郎" />
      </label>
      <label class="field-label rating-select">評価
        <select name="rating" required>
          <option value="5">★★★★★ とてもおすすめ</option>
          <option value="4">★★★★☆ おすすめ</option>
          <option value="3">★★★☆☆ ふつう</option>
          <option value="2">★★☆☆☆ もう少し</option>
          <option value="1">★☆☆☆☆ お好みで</option>
        </select>
      </label>
      <label class="field-label">レビュー
        <textarea name="text" required maxlength="500" placeholder="食べた感想やおすすめポイントを書いてください"></textarea>
      </label>
      <button class="button button-dark" type="submit">レビューを投稿する <span aria-hidden="true">↗</span></button>
    </form>`}`;

  const reviewForm = detailBody.querySelector("#review-form");
  if (reviewForm) reviewForm.addEventListener("submit", submitReview);
  if (!detailModal.open) detailModal.showModal();
}

async function submitReview(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const spot = spots.find((item) => item.id === activeSpotId);
  if (!spot) return;
  const reviewer = String(formData.get("reviewer")).trim();
  const text = String(formData.get("text")).trim();
  if (!reviewer || !text) {
    showToast("ニックネームとレビューを入力してください。");
    event.currentTarget.querySelector(!reviewer ? '[name="reviewer"]' : '[name="text"]').focus();
    return;
  }
  try {
    const result = await supabaseRequest("reviews", {
      method: "POST",
      body: {
        shop_id: spot.id,
        nickname: reviewer,
        rating: Number(formData.get("rating")),
        body: text,
      },
    });
    if (!Array.isArray(result) || !result[0]) throw new Error("Supabase did not return the saved review.");
    spot.reviews.unshift(mapReview(result[0]));
    render();
    openDetails(spot.id);
    showToast("レビューを投稿しました！");
  } catch (error) {
    console.error("レビューを投稿できませんでした。", error);
    showToast("レビューを投稿できませんでした。接続設定を確認してください。");
  }
}

shopForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(shopForm);
  const name = String(formData.get("name")).trim();
  const area = String(formData.get("area")).trim();
  const description = String(formData.get("description")).trim();
  if (!name || !area || !description) {
    const emptyField = !name ? "name" : !area ? "area" : "description";
    showToast("お店の名前・エリア・おすすめポイントを入力してください。");
    shopForm.querySelector(`[name="${emptyField}"]`).focus();
    return;
  }
  try {
    const result = await supabaseRequest("shops", {
      method: "POST",
      body: {
        name,
        area,
        category: String(formData.get("category")),
        description,
        menu: String(formData.get("menu")).trim(),
        price: String(formData.get("price")).trim(),
      },
    });
    if (!Array.isArray(result) || !result[0]) throw new Error("Supabase did not return the saved shop.");
    const spot = mapSpot({ ...result[0], reviews: [] });
    spots.unshift(spot);
    render();
    shopModal.close();
    showToast("お店を投稿しました！");
    document.querySelector("#spots").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("お店を投稿できませんでした。", error);
    showToast("お店を投稿できませんでした。接続設定を確認してください。");
  }
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});
document.querySelectorAll("#open-add-shop, #open-add-shop-secondary, #open-add-shop-banner, #empty-add-shop")
  .forEach((button) => button.addEventListener("click", openShopModal));
searchInput.addEventListener("input", render);
categoryFilter.addEventListener("change", () => {
  document.querySelectorAll(".category-chip").forEach((chip) => {
    chip.classList.toggle("selected", chip.dataset.category === categoryFilter.value);
  });
  render();
});
sortFilter.addEventListener("change", render);
document.querySelectorAll(".category-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    categoryFilter.value = chip.dataset.category;
    document.querySelectorAll(".category-chip").forEach((item) => item.classList.toggle("selected", item === chip));
    render();
  });
});

render();
