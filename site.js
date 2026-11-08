/* PurrGame — общий скрипт сайта */

/* 1) Язык по устройству (ru/be/kk → русский, иначе английский); выбор кнопкой RU/EN запоминается.
      Выполняется сразу, до отрисовки страницы. */
(function () {
  var l = null, h = document.documentElement;
  try { l = localStorage.getItem("pg_site_lang"); } catch (e) {}
  if (l !== "ru" && l !== "en") {
    var n = (navigator.languages && navigator.languages[0]) || navigator.language || "ru";
    l = /^(ru|be|kk)/i.test(n) ? "ru" : "en";
  }
  h.setAttribute("data-lang", l); h.lang = l;
  document.title = h.getAttribute("data-t-" + l) || document.title;
})();

/* 2) Ссылки на оплату Platega — вставьте свои. Пока значение пустое, кнопка ведёт на страницу подписки (демо). */
var PAY = { trial: "", m1: "", m3: "", m6: "" };
var NAMES = {
  trial: ["Пробный период · 3 дня", "Trial period · 3 days"], m1: ["1 месяц", "1 month"],
  m3: ["3 месяца", "3 months"], m6: ["6 месяцев", "6 months"]
};

function ls(k, v) {
  try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {}
  return null;
}

document.addEventListener("DOMContentLoaded", function () {
  var h = document.documentElement;

  /* переключатель языка */
  var lb = document.getElementById("lang");
  if (lb) lb.addEventListener("click", function () {
    var en = h.getAttribute("data-lang") !== "en", l = en ? "en" : "ru";
    h.setAttribute("data-lang", l); h.lang = l;
    document.title = h.getAttribute("data-t-" + l) || document.title;
    try { localStorage.setItem("pg_site_lang", l); } catch (e) {}
  });

  /* кнопки «Купить» → оплата Platega или страница подписки (другой файл) */
  document.querySelectorAll(".buy").forEach(function (a) {
    var key = a.getAttribute("data-plan");
    a.href = PAY[key] || ("subscription.html?plan=" + key);
    a.addEventListener("click", function () { ls("pg_plan", key); ls("pg_cancel", null); });
  });

  /* страница подписки */
  var box = document.getElementById("mysub");
  if (box) {
    var p = new URLSearchParams(location.search).get("plan");
    if (p && NAMES[p]) { ls("pg_plan", p); ls("pg_cancel", null); history.replaceState(null, "", location.pathname); }
    var nameEl = document.getElementById("subname"), ask = document.getElementById("ask"),
        done = document.getElementById("done"), cancelBtn = document.getElementById("cancelBtn"), nosub = document.getElementById("nosub");
    var show = function () {
      var plan = ls("pg_plan"), canceled = ls("pg_cancel") === "1", has = plan && NAMES[plan];
      box.classList.toggle("on", !!has); nosub.classList.toggle("on", !has);
      if (!has) return;
      nameEl.innerHTML = '<span class="ru">Тариф: ' + NAMES[plan][0] + '</span><span class="en">Plan: ' + NAMES[plan][1] + '</span>';
      cancelBtn.style.display = canceled ? "none" : "";
      ask.classList.remove("on"); done.classList.toggle("on", canceled);
    };
    cancelBtn.addEventListener("click", function () { ask.classList.add("on"); cancelBtn.style.display = "none"; });
    document.getElementById("no").addEventListener("click", function () { ask.classList.remove("on"); cancelBtn.style.display = ""; });
    document.getElementById("yes").addEventListener("click", function () { ls("pg_cancel", "1"); show(); });
    show();
  }
});
