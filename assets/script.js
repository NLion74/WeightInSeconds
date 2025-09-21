document.addEventListener("DOMContentLoaded", () => {
    const G = 6.674e-11;
    const c = 3e8;

    function formatDecimal(x, decimals = 20) {
        return x.toFixed(decimals);
    }

    function formatScientific(x, sig = 3) {
        if (x === 0) return "0";
        const exp = Math.floor(Math.log10(Math.abs(x)));
        const mantissa = (x / Math.pow(10, exp)).toFixed(sig - 1);
        return `${mantissa} × 10^${exp}`;
    }

    function timeDilationPerSecond(M, r) {
        return (G * M) / (r * c * c);
    }

    function timeDilationLifetime(M, r, lifetimeYears) {
        const secondsLifetime = lifetimeYears * 365.25 * 24 * 60 * 60;
        return (secondsLifetime * G * M) / (r * c * c);
    }

    const toggleBtn = document.getElementById("toggleAdvanced");
    const advancedDiv = document.getElementById("advanced");

    if (toggleBtn && advancedDiv) {
        toggleBtn.addEventListener("click", () => {
            advancedDiv.style.display =
                advancedDiv.style.display === "none" ? "block" : "none";
        });
    }

    const calcBtn = document.getElementById("calculate");
    if (calcBtn) {
        calcBtn.addEventListener("click", () => {
            const mass =
                parseFloat(document.getElementById("mass").value) || 70;
            const distance =
                parseFloat(document.getElementById("distance")?.value) || 0.5;
            const lifetime =
                parseFloat(document.getElementById("lifetime")?.value) || 80;

            const dtSec = timeDilationPerSecond(mass, distance);
            const dtLife = timeDilationLifetime(mass, distance, lifetime);

            document.getElementById(
                "perSecond"
            ).innerText = `You weigh ${formatDecimal(
                dtSec,
                25
            )} seconds per second (≈${formatScientific(dtSec)} s)`;

            document.getElementById(
                "overLifetime"
            ).innerText = `Over a lifetime of ${lifetime} years that means you weigh: ${formatDecimal(
                dtLife,
                25
            )} seconds (≈${formatScientific(dtLife)} s)`;

            const funExamplesElem = document.getElementById("funExamples");
            if (
                mass > 1000 ||
                dtLife <= 0 ||
                dtLife > 1 ||
                distance <= 0.49 ||
                lifetime >= 101
            ) {
                funExamplesElem.innerHTML = `
                    <h3>Interpretation:</h3>
                    <p>That certainly is more than you weigh in kilograms! We'll still calculate the numbers, but no interpretation for you ;)</p>
                `;
            } else {
                const femtoseconds = dtLife / 1e-15;
                const lightDistance = dtLife * c;
                const micrometers = lightDistance * 1e6;

                const atomicExponent = Math.floor(Math.log10(dtLife));
                const atomicComparison = `≈10^${atomicExponent} s`;

                funExamplesElem.innerHTML = `
                    <h3>Interpretation:</h3>
                    <p>Hmm, so you can't really make sense of these numbers? Let me help you!</p>
                    <ul>
                        <li>One femtosecond is 10⁻¹⁵ s. Over your lifetime, you weigh about ${femtoseconds.toFixed(
                            2
                        )} femtoseconds.</li>
                        <li>An atomic clock can notice ~10⁻⁹ s over a lifetime. You are at about ${atomicComparison}. You're invisible to it!</li>
                        <li>Light travels at ~299,792,458 m/s. The total effect over ${lifetime} years corresponds to light traveling about ${micrometers.toFixed(
                    2
                )} μm.</li>
                        <li>That's less than the thickness of a human hair (~50–100 μm).</li>
                        <li>Even over a lifetime, your mass slows time by an amount equivalent to light traveling less than the width of a hair.</li>
                    </ul>
                `;
            }

            document.getElementById("results").style.display = "block";
        });
    }
});
