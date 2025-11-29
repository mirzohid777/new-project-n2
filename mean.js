// =============================
// INDEX 1
// =============================

$(document).ready(function () {
  let transactions = [];
  let currentLang = "uz";
  let currentTheme = "light";
  let currentFilter = "all";
  let searchQuery = "";
  let lastNotificationShown = null;

  const translations = {
    uz: {
      pageTitle: "Kunlik Daromad va Xarajat Tizimi",
      balanceLabel: "Umumiy Balans",
      incomeLabel: "Daromad",
      expenseLabel: "Xarajat",
      formTitle: "Yangi Kiritma",
      descLabel: "Tavsif",
      amountLabel: "Summa",
      dateLabel: "Sana",
      btnIncome: "+ Daromad",
      btnExpense: "- Xarajat",
      btnPayment: "💰 Sarqi/To'lov",
      historyTitle: "Tarix",
      remainingLabel: "Qoldiq",
      profileTitle: "Mening Profilim",
      themeLabel: "Rang Tanlash",
      langLabel: "Til Tanlash",
      lightText: "Oq",
      darkText: "Qora",
      emptyText: "Hali hech narsa yo'q",
      descPlaceholder: "Masalan: Ish haqi",
      amountPlaceholder: "0",
      todayIncomeLabel: "Bugungi Kirim",
      todayExpenseLabel: "Bugungi Chiqim",
      filterTitle: "Qidirish va Filtr",
      searchPlaceholder: "Tavsif bo'yicha qidirish...",
      filterAll: "Hammasi",
      filterIncome: "Daromad",
      filterExpense: "Xarajat",
      filterToday: "Bugun",
      filterWeek: "Bu hafta",
      filterMonth: "Bu oy",
      weeklyNotification:
        "💰 HAR HAFTALIK ESLATMA: Platformani yaratgan yosh dasturchiga haftada bir marta to'lov qilishingiz SHART! Iltimos, bugun to'lovni amalga oshiring!",
    },
    ru: {
      pageTitle: "Система Ежедневных Доходов и Расходов",
      balanceLabel: "Общий Баланс",
      incomeLabel: "Доход",
      expenseLabel: "Расход",
      formTitle: "Новая Запись",
      descLabel: "Описание",
      amountLabel: "Сумма",
      dateLabel: "Дата",
      btnIncome: "+ Доход",
      btnExpense: "- Расход",
      btnPayment: "💰 Оплата",
      historyTitle: "История",
      remainingLabel: "Остаток",
      profileTitle: "Мой Профиль",
      themeLabel: "Выбрать Тему",
      langLabel: "Выбрать Язык",
      lightText: "Светлая",
      darkText: "Темная",
      emptyText: "Пока ничего нет",
      descPlaceholder: "Например: Зарплата",
      amountPlaceholder: "0",
      todayIncomeLabel: "Сегодняшний Доход",
      todayExpenseLabel: "Сегодняшний Расход",
      filterTitle: "Поиск и Фильтр",
      searchPlaceholder: "Поиск по описанию...",
      filterAll: "Все",
      filterIncome: "Доход",
      filterExpense: "Расход",
      filterToday: "Сегодня",
      filterWeek: "Эта неделя",
      filterMonth: "Этот месяц",
      weeklyNotification:
        "💰 ЕЖЕНЕДЕЛЬНОЕ НАПОМИНАНИЕ: Вы ОБЯЗАНЫ оплачивать молодому разработчику платформы раз в неделю! Пожалуйста, сделайте оплату сегодня!",
    },
  };

  function checkNotifications() {
    const now = new Date();
    const today = now.toDateString();

    try {
      const lastShown = localStorage.getItem("lastNotificationShown");
      if (lastShown === today) {
        return;
      }
    } catch (e) {
      console.log("Notification check failed");
    }

    const dayOfWeek = now.getDay();

    const daysSinceStart = Math.floor(
      (now - new Date(2025, 0, 1)) / (1000 * 60 * 60 * 24)
    );

    if (dayOfWeek === 1 || dayOfWeek === 5 || daysSinceStart % 2 === 0) {
      const t = translations[currentLang];
      showNotification(t.weeklyNotification);

      try {
        localStorage.setItem("lastNotificationShown", today);
      } catch (e) {
        console.log("Notification save failed");
      }
    }
  }

  function showNotification(message) {
    const $banner = $("#notificationBanner");
    $("#notificationText").text(message);
    $banner.addClass("show");

    setTimeout(() => {
      $banner.removeClass("show");
    }, 15000);
  }

  function updateLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    $("#pageTitle").text(t.pageTitle);
    $("#balanceLabel").text(t.balanceLabel);
    $("#incomeLabel").text(t.incomeLabel);
    $("#expenseLabel").text(t.expenseLabel);
    $("#formTitle").text(t.formTitle);
    $("#descLabel").text(t.descLabel);
    $("#amountLabel").text(t.amountLabel);
    $("#dateLabel").text(t.dateLabel);
    $("#btnIncome").text(t.btnIncome);
    $("#btnExpense").text(t.btnExpense);
    $("#btnPayment").text(t.btnPayment);
    $("#historyTitle").text(t.historyTitle);
    $("#profileTitle").text(t.profileTitle);
    $("#themeLabel").text(t.themeLabel);
    $("#langLabel").text(t.langLabel);
    $("#lightText").text(t.lightText);
    $("#darkText").text(t.darkText);
    $("#remainingLabel").text(t.remainingLabel);
    $("#todayIncomeLabel").text(t.todayIncomeLabel);
    $("#todayExpenseLabel").text(t.todayExpenseLabel);
    $("#filterTitle").text(t.filterTitle);
    $("#searchBox").attr("placeholder", t.searchPlaceholder);
    $("#filterAll").text(t.filterAll);
    $("#filterIncome").text(t.filterIncome);
    $("#filterExpense").text(t.filterExpense);
    $("#filterToday").text(t.filterToday);
    $("#filterWeek").text(t.filterWeek);
    $("#filterMonth").text(t.filterMonth);
    $("#description").attr("placeholder", t.descPlaceholder);

    if (transactions.length === 0) {
      $("#emptyText").text(t.emptyText);
    }
  }

  function updateTheme(theme) {
    currentTheme = theme;
    if (theme === "dark") {
      $("body").addClass("dark");
      $("#darkTheme").addClass("active");
      $("#lightTheme").removeClass("active");
    } else {
      $("body").removeClass("dark");
      $("#lightTheme").addClass("active");
      $("#darkTheme").removeClass("active");
    }

    try {
      localStorage.setItem("appTheme", theme);
    } catch (e) {
      console.log("Theme save failed");
    }
  }

  function loadTheme() {
    try {
      const savedTheme = localStorage.getItem("appTheme");
      if (savedTheme) {
        updateTheme(savedTheme);
      }
    } catch (e) {
      console.log("Theme load failed");
    }
  }

  function calculateBalance() {
    let totalIncome = 0;
    let totalExpense = 0;
    let todayIncome = 0;
    let todayExpense = 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
        if (
          t.timestamp >= todayStart.getTime() &&
          t.timestamp <= todayEnd.getTime()
        ) {
          todayIncome += t.amount;
        }
      } else {
        totalExpense += t.amount;
        if (
          t.timestamp >= todayStart.getTime() &&
          t.timestamp <= todayEnd.getTime()
        ) {
          todayExpense += t.amount;
        }
      }
    });

    const balance = totalIncome - totalExpense;
    const currency = currentLang === "uz" ? " so'm" : " сум";

    $("#totalBalance").text(formatNumber(balance) + currency);
    $("#totalIncome").text(formatNumber(totalIncome) + currency);
    $("#totalExpense").text(formatNumber(totalExpense) + currency);
    $("#totalRemaining").text(formatNumber(balance) + currency);
    $("#todayIncomeValue").text(formatNumber(todayIncome) + currency);
    $("#todayExpenseValue").text(formatNumber(todayExpense) + currency);

    saveToDatabase();
  }

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function renderTransactions() {
    const $list = $("#transactionList");

    let filtered = [...transactions];

    if (searchQuery) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (currentFilter !== "all") {
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime();
      const todayEnd = todayStart + 86400000 - 1;

      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).getTime();

      filtered = filtered.filter((t) => {
        if (currentFilter === "income") return t.type === "income";
        if (currentFilter === "expense") return t.type === "expense";
        if (currentFilter === "today")
          return t.timestamp >= todayStart && t.timestamp <= todayEnd;
        if (currentFilter === "week") return t.timestamp >= weekStart.getTime();
        if (currentFilter === "month") return t.timestamp >= monthStart;
        return true;
      });
    }

    if (filtered.length === 0) {
      const emptyText =
        currentLang === "uz" ? "Hech narsa topilmadi" : "Ничего не найдено";
      $list.html(`<p class="empty-state">${emptyText}</p>`);
      return;
    }

    $list.empty();

    const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);

    sorted.forEach((t, index) => {
      const sign = t.type === "income" ? "+" : "-";
      const currency = currentLang === "uz" ? " so'm" : " сум";

      const $item = $(`
                <div class="transaction-item ${t.type}">
                    <div class="transaction-info">
                        <div class="transaction-desc">${t.description}</div>
                        <div class="transaction-date">
                            <span>${formatDateTime(t.timestamp)}</span>
                        </div>
                    </div>
                    <div class="transaction-amount ${t.type}">
                        ${sign} ${formatNumber(t.amount)}${currency}
                    </div>
                    <button class="delete-btn" data-id="${t.id}">×</button>
                </div>
            `);

      $list.append($item);
    });

    $(".delete-btn").click(function () {
      const id = $(this).data("id");
      deleteTransaction(id);
    });
  }

  function formatDateTime(timestamp) {
    const date = new Date(timestamp);

    const daysUz = [
      "Yakshanba",
      "Dushanba",
      "Seshanba",
      "Chorshanba",
      "Payshanba",
      "Juma",
      "Shanba",
    ];
    const daysRu = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
    const days = currentLang === "uz" ? daysUz : daysRu;

    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${dayName}, ${day}.${month}.${year} - ${hours}:${minutes}`;
  }

  function deleteTransaction(id) {
    const confirmText =
      currentLang === "uz"
        ? "Rostdan ham o'chirmoqchimisiz?"
        : "Вы действительно хотите удалить?";

    if (confirm(confirmText)) {
      transactions = transactions.filter((t) => t.id !== id);
      calculateBalance();
      renderTransactions();
    }
  }

  function addTransaction(type) {
    const description = $("#description").val().trim();
    const amount = parseFloat($("#amount").val());

    if (!description || !amount || amount <= 0) {
      const msg =
        currentLang === "uz"
          ? "Iltimos, barcha maydonlarni to'ldiring!"
          : "Пожалуйста, заполните все поля!";
      alert(msg);
      return;
    }

    const transaction = {
      id: Date.now(),
      type: type,
      description: description,
      amount: amount,
      timestamp: Date.now(),
    };

    transactions.push(transaction);

    $("#description").val("");
    $("#amount").val("");

    calculateBalance();
    renderTransactions();
  }

  function saveToDatabase() {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (e) {
      console.log("Database save failed");
    }
  }

  function loadFromDatabase() {
    try {
      const saved = localStorage.getItem("transactions");
      if (saved) {
        transactions = JSON.parse(saved);
      }
    } catch (e) {
      console.log("Database load failed");
    }
  }

  $("#btnIncome").click(function () {
    addTransaction("income");
  });

  $("#btnExpense").click(function () {
    addTransaction("expense");
  });

  $("#btnPayment").click(function () {
    const description = $("#description").val().trim();
    const amount = parseFloat($("#amount").val());

    if (!description) {
      $("#description").val("Sarqi/To'lov - Dasturchiga to'lov");
    }

    if (!amount || amount <= 0) {
      const msg =
        currentLang === "uz"
          ? "Iltimos, summani kiriting!"
          : "Пожалуйста, введите сумму!";
      alert(msg);
      return;
    }

    const confirmMsg =
      currentLang === "uz"
        ? `${formatNumber(amount)} so'm to'lovni amalga oshirmoqchimisiz?`
        : `Вы хотите совершить оплату на ${formatNumber(amount)} сум?`;

    if (confirm(confirmMsg)) {
      const paymentDesc =
        $("#description").val().trim() ||
        (currentLang === "uz" ? "Sarqi/To'lov" : "Оплата");

      const transaction = {
        id: Date.now(),
        type: "expense",
        description: "💰 " + paymentDesc,
        amount: amount,
        timestamp: Date.now(),
      };

      transactions.push(transaction);

      $("#description").val("");
      $("#amount").val("");

      calculateBalance();
      renderTransactions();

      const successMsg =
        currentLang === "uz"
          ? "To'lov muvaffaqiyatli amalga oshirildi!"
          : "Оплата успешно выполнена!";
      alert(successMsg);
    }
  });

  $("#lightTheme").click(function () {
    updateTheme("light");
  });

  $("#darkTheme").click(function () {
    updateTheme("dark");
  });

  $("#languageSelect").change(function () {
    updateLanguage($(this).val());
    renderTransactions();
    calculateBalance();
  });

  $("#mobileProfileBtn").click(function () {
    $("#sidebar").addClass("active");
    $("#sidebarOverlay").addClass("active");
  });

  $("#sidebarOverlay").click(function () {
    $("#sidebar").removeClass("active");
    $("#sidebarOverlay").removeClass("active");
  });

  $("#closeSidebarBtn").click(function (e) {
    e.stopPropagation();
    $("#sidebar").removeClass("active");
    $("#sidebarOverlay").removeClass("active");
  });

  $("#closeNotif").click(function () {
    $("#notificationBanner").removeClass("show");
  });

  $("#searchBox").on("input", function () {
    searchQuery = $(this).val();
    renderTransactions();
  });

  $(".filter-btn").click(function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    currentFilter = $(this).data("filter");
    renderTransactions();
  });

  calculateBalance();
  renderTransactions();
  checkNotifications();
  loadTheme();
  loadFromDatabase();

  setInterval(checkNotifications, 60000);
});

// =============================
// INDEX 2
// =============================

const swiper = new Swiper(".swiper", {
  direction: "horizontal",
  loop: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  scrollbar: {
    el: ".swiper-scrollbar",
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

// =============================
// INDEX 3
// =============================
$(document).ready(function () {
  let utilitiesData = JSON.parse(localStorage.getItem("utilitiesData")) || [];
  let selectedUtilityId = null;

  const utilityIcons = {
    "Issiq Suv": "💧",
    "Sovuq Suv": "💦",
    Elektr: "⚡",
    Gaz: "🔥",
    Internet: "📡",
    Telefon: "📞",
    Axlat: "🗑️",
    "Uy-Soliq": "🏢",
  };

  function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function generatePaymentId() {
    return (
      "PAY-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 9).toUpperCase()
    );
  }

  function renderUtilities() {
    const displayArea = $("#utilitiesDisplayArea");
    displayArea.empty();

    utilitiesData.forEach((utility) => {
      const totalAmount = utility.payments
        ? utility.payments.reduce((sum, p) => sum + p.amount, 0)
        : 0;

      const paymentsCount = utility.payments ? utility.payments.length : 0;

      const utilityCard = $(`
                        <div class="utility-box" data-utility-id="${
                          utility.id
                        }">
                            <button class="remove-utility-btn" data-utility-id="${
                              utility.id
                            }">×</button>
                            <div class="utility-title">${
                              utilityIcons[utility.type] || "📋"
                            } ${utility.type}</div>
                            <div class="utility-house-info">🏠 Uy: ${
                              utility.houseNumber
                            }</div>
                            <div class="utility-total">${formatCurrency(
                              totalAmount
                            )} so'm</div>
                            <div class="utility-payments-count">📊 To'lovlar: ${paymentsCount}</div>
                        </div>
                    `);

      displayArea.append(utilityCard);
    });

    const addNewCard = $(`
                    <div class="add-new-box" id="openAddUtilityPopupBtn">
                        <div class="add-icon-large">+</div>
                    </div>
                `);
    displayArea.append(addNewCard);

    $(".utility-box").click(function (e) {
      if (!$(e.target).hasClass("remove-utility-btn")) {
        const utilityId = $(this).data("utility-id");
        displayPaymentsHistory(utilityId);
      }
    });

    $(".remove-utility-btn").click(function (e) {
      e.stopPropagation();
      const utilityId = $(this).data("utility-id");
      if (confirm("Haqiqatan ham bu xizmatni o'chirmoqchimisiz?")) {
        utilitiesData = utilitiesData.filter((u) => u.id !== utilityId);
        localStorage.setItem("utilitiesData", JSON.stringify(utilitiesData));
        renderUtilities();
      }
    });

    $("#openAddUtilityPopupBtn").click(function () {
      $("#addUtilityPopup").fadeIn(300);
    });
  }

  function displayPaymentsHistory(utilityId) {
    selectedUtilityId = utilityId;
    const utility = utilitiesData.find((u) => u.id === utilityId);

    if (!utility) return;

    $("#historyPopupTitle").text(`${utility.type} - Uy ${utility.houseNumber}`);

    const historyContainer = $("#paymentsHistoryContainer");
    historyContainer.empty();

    if (!utility.payments || utility.payments.length === 0) {
      historyContainer.html(
        "<div class=\"no-data-message\">Hali hech qanday to'lov yo'q.<br>Yangi to'lov qo'shing.</div>"
      );
    } else {
      let runningTotal = 0;

      const sortedPayments = [...utility.payments].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      sortedPayments.forEach((payment, index) => {
        const date = new Date(payment.date);
        const formattedDate = date.toLocaleString("uz-UZ", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const previousTotal = sortedPayments
          .slice(index + 1)
          .reduce((sum, p) => sum + p.amount, 0);

        const currentTotal = previousTotal + payment.amount;
        const difference = payment.amount;

        const paymentCard = $(`
                            <div class="payment-record">
                                <div class="payment-datetime">📅 ${formattedDate}</div>
                                <div class="payment-sum">${formatCurrency(
                                  currentTotal
                                )} so'm <span style="color: #4caf50; font-size: 0.8em;">+${formatCurrency(
          difference
        )} so'm</span></div>
                                <div class="payment-id-text">ID: ${
                                  payment.id
                                }</div>
                            </div>
                        `);
        historyContainer.append(paymentCard);
      });
    }

    $("#paymentsHistoryPopup").fadeIn(300);
  }

  $(".close-popup-btn").click(function () {
    $(this).closest(".popup-backdrop").fadeOut(300);
  });

  $(window).click(function (e) {
    if ($(e.target).hasClass("popup-backdrop")) {
      $(".popup-backdrop").fadeOut(300);
    }
  });

  $("#utilityCreationForm").submit(function (e) {
    e.preventDefault();

    const type = $("#utilityTypeSelector").val();
    const houseNumber = $("#houseNumberField").val().trim();
    const amount = parseFloat($("#initialPaymentAmount").val());

    if (!type || !houseNumber || !amount || amount <= 0) {
      alert("Iltimos, barcha maydonlarni to'g'ri to'ldiring!");
      return;
    }

    const newUtility = {
      id: Date.now(),
      type: type,
      houseNumber: houseNumber,
      payments: [
        {
          id: generatePaymentId(),
          amount: amount,
          date: new Date().toISOString(),
        },
      ],
    };

    utilitiesData.push(newUtility);
    localStorage.setItem("utilitiesData", JSON.stringify(utilitiesData));

    $("#utilityCreationForm")[0].reset();
    $("#addUtilityPopup").fadeOut(300);
    renderUtilities();
  });

  $("#openAddPaymentPopupBtn").click(function () {
    const utility = utilitiesData.find((u) => u.id === selectedUtilityId);
    if (utility) {
      $("#addPaymentPopupTitle").text(`${utility.type} uchun to'lov`);
    }
    $("#paymentsHistoryPopup").fadeOut(300);
    $("#addPaymentPopup").fadeIn(300);
  });

  $("#paymentCreationForm").submit(function (e) {
    e.preventDefault();

    const amount = parseFloat($("#newPaymentAmountField").val());

    if (!amount || amount <= 0) {
      alert("Iltimos, to'g'ri summa kiriting!");
      return;
    }

    const utility = utilitiesData.find((u) => u.id === selectedUtilityId);

    if (utility) {
      const newPayment = {
        id: generatePaymentId(),
        amount: amount,
        date: new Date().toISOString(),
      };

      if (!utility.payments) {
        utility.payments = [];
      }

      utility.payments.push(newPayment);
      localStorage.setItem("utilitiesData", JSON.stringify(utilitiesData));

      $("#paymentCreationForm")[0].reset();
      $("#addPaymentPopup").fadeOut(300);
      renderUtilities();
      displayPaymentsHistory(selectedUtilityId);
    }
  });

  renderUtilities();
});
