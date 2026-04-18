const state = {
  selectedType: "short",
  debounceTimer: null,
};

const elements = {
  form: document.getElementById("generatorForm"),
  optionCards: document.querySelectorAll(".option-card"),
  urlInput: document.getElementById("urlInput"),
  submitButton: document.getElementById("submitButton"),
  statusMessage: document.getElementById("statusMessage"),
  loadingSpinner: document.getElementById("loadingSpinner"),
  resultsSection: document.getElementById("resultsSection"),
  resultBackdrop: document.getElementById("resultBackdrop"),
  shortResult: document.getElementById("shortResult"),
  qrResult: document.getElementById("qrResult"),
  shortUrlLink: document.getElementById("shortUrlLink"),
  copyButton: document.getElementById("copyButton"),
  shareShortButton: document.getElementById("shareShortButton"),
  qrImage: document.getElementById("qrImage"),
  downloadButton: document.getElementById("downloadButton"),
  shareQrButton: document.getElementById("shareQrButton"),
  bothToggle: document.getElementById("bothToggle"),
  formHeading: document.getElementById("formHeading"),
  closeResultsButton: document.getElementById("closeResultsButton"),
};

function getRequestType() {
  return elements.bothToggle.checked ? "both" : state.selectedType;
}

function getPrimaryLabel(type) {
  return type === "qr" ? "QR code" : "short URL";
}

function setActiveType(type) {
  state.selectedType = type;

  elements.optionCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.type === type);
  });

  updateFormCopy();
  clearResults();
  setStatus(`Ready to generate ${elements.bothToggle.checked ? "both outputs" : `a ${getPrimaryLabel(type)}`}.`, "success");
}

function updateFormCopy() {
  elements.formHeading.textContent = elements.bothToggle.checked
    ? `Generate your ${state.selectedType === "qr" ? "QR code and short URL" : "short URL and QR code"}`
    : `Generate your ${getPrimaryLabel(state.selectedType)}`;
}

function setLoading(isLoading) {
  elements.submitButton.disabled = isLoading;
  elements.submitButton.textContent = isLoading ? "Generating..." : "Generate now";
  elements.loadingSpinner.classList.toggle("hidden", !isLoading);
}

function setStatus(message, type = "") {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status ${type}`.trim();
}

function clearResults() {
  elements.resultsSection.classList.add("hidden");
  elements.resultsSection.setAttribute("aria-hidden", "true");
  elements.resultsSection.querySelector(".results").classList.remove("has-both");
  elements.shortResult.classList.add("hidden");
  elements.qrResult.classList.add("hidden");
  elements.shortResult.classList.remove("centered-panel");
  elements.qrResult.classList.remove("centered-panel");
  elements.shortUrlLink.removeAttribute("href");
  elements.shortUrlLink.textContent = "";
  elements.qrImage.removeAttribute("src");
  elements.downloadButton.removeAttribute("href");
}

function revealResults() {
  elements.resultsSection.classList.remove("hidden");
  elements.resultsSection.setAttribute("aria-hidden", "false");
  elements.resultsSection.classList.remove("panel-enter");
  void elements.resultsSection.offsetWidth;
  elements.resultsSection.classList.add("panel-enter");
}

function renderResults(data) {
  clearResults();
  revealResults();
  const resultsGrid = elements.resultsSection.querySelector(".results");
  const hasShort = Boolean(data.shortUrl);
  const hasQr = Boolean(data.qrCodeDataUrl);

  if (hasShort && hasQr) {
    resultsGrid.classList.add("has-both");
  }

  if (hasShort) {
    elements.shortResult.classList.remove("hidden");
    elements.shortUrlLink.href = data.shortUrl;
    elements.shortUrlLink.textContent = data.shortUrl;
  }

  if (hasQr) {
    elements.qrResult.classList.remove("hidden");
    elements.qrResult.classList.add("centered-panel");
    elements.qrImage.src = data.qrCodeDataUrl;
    elements.downloadButton.href = data.qrCodeDataUrl;
  }

  if (hasQr && !hasShort) {
    elements.qrResult.classList.add("centered-panel");
  }

  if (hasShort && !hasQr) {
    elements.shortResult.classList.add("centered-panel");
  }
}

async function shareContent({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      setStatus("Share sheet opened.", "success");
      return;
    } catch (error) {
      if (error && error.name === "AbortError") {
        return;
      }
    }
  }

  if (url) {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Share is not available here, so the link was copied instead.", "success");
      return;
    } catch {
      setStatus("Share is not supported in this browser.", "error");
      return;
    }
  }

  setStatus("Share is not supported in this browser.", "error");
}

async function generateAsset(url) {
  setLoading(true);
  setStatus("Generating your result...");

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        type: getRequestType(),
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || "Unable to process this URL.");
    }

    renderResults(payload.data);
    setStatus(payload.message, "success");
  } catch (error) {
    clearResults();
    setStatus(error.message, "error");
  } finally {
    setLoading(false);
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const url = elements.urlInput.value.trim();

  if (!url) {
    setStatus("Please enter a URL first.", "error");
    clearResults();
    return;
  }

  generateAsset(url);
}

elements.optionCards.forEach((card) => {
  card.addEventListener("click", () => setActiveType(card.dataset.type));
});

elements.bothToggle.addEventListener("change", () => {
  updateFormCopy();
  clearResults();
  setStatus(
    elements.bothToggle.checked
      ? `Ready to generate both outputs with ${getPrimaryLabel(state.selectedType)} as the primary view.`
      : `Ready to generate a ${getPrimaryLabel(state.selectedType)}.`,
    "success"
  );
});

elements.form.addEventListener("submit", handleSubmit);

elements.urlInput.addEventListener("input", () => {
  if (state.debounceTimer) {
    window.clearTimeout(state.debounceTimer);
  }

  state.debounceTimer = window.setTimeout(() => {
    const value = elements.urlInput.value.trim();

    if (!value) {
      setStatus("Paste a URL to start.", "");
      clearResults();
    }
  }, 180);
});

elements.copyButton.addEventListener("click", async () => {
  const value = elements.shortUrlLink.textContent;

  if (!value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    setStatus("Copied!", "success");
  } catch {
    setStatus("Copy failed. Please copy the link manually.", "error");
  }
});

elements.shareShortButton.addEventListener("click", async () => {
  const url = elements.shortUrlLink.getAttribute("href");

  if (!url) {
    return;
  }

  await shareContent({
    title: "Smart URL Tool link",
    text: "Here is your shortened URL.",
    url,
  });
});

elements.shareQrButton.addEventListener("click", async () => {
  const url =
    elements.downloadButton.getAttribute("href") ||
    elements.shortUrlLink.getAttribute("href");

  if (!url) {
    return;
  }

  await shareContent({
    title: "Smart URL Tool QR code",
    text: "Here is the generated QR code link.",
    url,
  });
});

elements.closeResultsButton.addEventListener("click", clearResults);
elements.resultBackdrop.addEventListener("click", clearResults);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.resultsSection.classList.contains("hidden")) {
    clearResults();
  }
});

updateFormCopy();
setStatus("Ready to generate a short URL.", "success");
