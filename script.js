// ========================================
// DOM要素の取得
// ========================================
const fixedCta = document.querySelector(".mobile-fixed-cta");
const hero = document.querySelector(".hero");
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const faqItems = document.querySelectorAll(".poster-faq-list details");
const lineDemoTriggers = document.querySelectorAll("[data-demo-line]");
const lineDemoModal = document.querySelector("#demo-line-modal");
const lineDemoDialog = lineDemoModal?.querySelector(".demo-modal-dialog");
const lineDemoCloseButton = lineDemoModal?.querySelector(".demo-modal-close");
let lineDemoReturnFocus = null;

// ========================================
// FAQの初期状態
// ========================================
faqItems.forEach((item) => {
  item.open = false;
});

// ========================================
// SP固定電話CTAの表示制御
// ========================================
const updateFixedCta = () => {
  if (!fixedCta || !hero) return;
  const shouldShow = window.scrollY > hero.offsetHeight - 120;
  fixedCta.classList.toggle("is-visible", shouldShow);
};

// ========================================
// ハンバーガーメニューを閉じる処理
// ========================================
const closeMenu = () => {
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.remove("is-open");
  mobileMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "メニューを開く");
};

// ========================================
// ハンバーガーメニューの開閉処理
// ========================================
const toggleMenu = () => {
  if (!hamburger || !mobileMenu) return;
  const isOpen = hamburger.classList.toggle("is-open");
  mobileMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
};

// ========================================
// LINEデモ案内モーダルの開閉処理
// ========================================
const openLineDemo = (trigger) => {
  if (!lineDemoModal || !lineDemoDialog) return;
  lineDemoReturnFocus = trigger;
  closeMenu();
  lineDemoModal.classList.add("is-open");
  lineDemoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("demo-modal-open");
  lineDemoDialog.focus({ preventScroll: true });
};

const closeLineDemo = () => {
  if (!lineDemoModal?.classList.contains("is-open")) return;
  lineDemoModal.classList.remove("is-open");
  lineDemoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("demo-modal-open");
  lineDemoReturnFocus?.focus({ preventScroll: true });
  lineDemoReturnFocus = null;
};

// ========================================
// スクロール・リサイズイベント
// ========================================
updateFixedCta();
window.addEventListener("scroll", updateFixedCta, { passive: true });
window.addEventListener("resize", updateFixedCta);

// ========================================
// メニュークリック・外側クリック・Escapeキーの処理
// ========================================
hamburger?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleMenu();
});

lineDemoTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openLineDemo(trigger);
  });
});

lineDemoModal?.addEventListener("click", (event) => {
  if (event.target.closest("[data-demo-modal-close]")) closeLineDemo();
});

mobileMenu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("click", (event) => {
  if (!mobileMenu?.classList.contains("is-open")) return;
  if (event.target.closest(".header")) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && lineDemoModal?.classList.contains("is-open")) {
    event.preventDefault();
    lineDemoCloseButton?.focus({ preventScroll: true });
    return;
  }

  if (event.key !== "Escape") return;
  if (lineDemoModal?.classList.contains("is-open")) {
    closeLineDemo();
    return;
  }
  closeMenu();
});
