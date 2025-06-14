export function showFormattedDate(date, locale = "en-US", options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function convertBase64ToBlob(
  base64Data,
  contentType = "",
  sliceSize = 512
) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

export function convertBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function setupSkipToContent(element, mainContent) {
  element.addEventListener("click", () => mainContent.focus());
}

export const transitionHelper = (updateDOM, skipTransition = false) => {
  if (skipTransition || !document.startViewTransition) {
    const contentElement = document.getElementById("main-content");
    if (contentElement) {
      contentElement.classList.add("fade-transition");
      contentElement.classList.remove("fade-in");
    }

    const updateCallbackDone = Promise.resolve(updateDOM()).then(() => {
      requestAnimationFrame(() => {
        if (contentElement) {
          contentElement.classList.add("fade-in");
        }
      });
    });

    return {
      ready: Promise.reject(Error("View transition unsupported.")),
      updateCallbackDone,
      finished: updateCallbackDone,
    };
  }

  const transition = document.startViewTransition(updateDOM);

  transition.ready.catch((err) => {
    if (err.message !== "View transition unsupported.") {
      console.error(err);
    }
  });

  return transition;
};

export function sleep(time = 500) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function isServiceWorkerAvailable() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.bundle.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.log("Registration Service Worker failed:", error);
        });
    });
  }

  return "serviceWorker" in navigator;
}

export async function registerServiceWorker() {
  if (!isServiceWorkerAvailable()) {
    console.log("Service worker API unsupported.");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/sw.bundle.js"
    );
    console.log("service worker has been installed", registration);
  } catch (error) {
    console.log("Failed to install service worker:", error);
  }
}
