// Shared UI utility helpers used by the legacy app shell.
(function () {
    function incrementTransaction(count) {
        return (count || 0) + 1;
    }

    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function bindSliderButtons(sliderId, incrementId, decrementId, changeCallback) {
        const slider = document.getElementById(sliderId);
        document.getElementById(incrementId).addEventListener(
            "click",
            () => {
                if (Number(slider.value) < Number(slider.max)) {
                    slider.value = Number(slider.value) + 1;
                    changeCallback();
                }
            },
            false
        );
        document.getElementById(decrementId).addEventListener(
            "click",
            () => {
                if (Number(slider.value) > Number(slider.min)) {
                    slider.value = Number(slider.value) - 1;
                    changeCallback();
                }
            },
            false
        );
    }

    function setLoadingMessage(message) {
        const el = document.getElementById("loading-status-message");
        if (message) {
            el.textContent = message;
            el.style.display = "block";
        } else {
            el.style.display = "none";
            el.textContent = "";
        }
    }

    window.LARCoreUiUtils = {
        incrementTransaction,
        debounce,
        bindSliderButtons,
        setLoadingMessage,
    };
})();
