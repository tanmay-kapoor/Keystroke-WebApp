const keystrokes = {};
const alphanumeric = "abcdefghijklmnopqrstuvwxyz1234567890";
const punctuation = ".?!,:;'\"-(){}[]";
const sentenceEndingPunctuation = ".?!";

let startTime,
    prevKeyTime,
    totalKeystrokes = 0,
    totalPauseTime = 0,
    totalPauses = 0,
    wastedTime = 0;

let slider, rangeValues, stressLevel;
const sliderExists =
    document.getElementById("sliderExists").value === "yes" ? 1 : 0;

document.getElementById("text").addEventListener("keydown", function (e) {
    const key = e.key.toLowerCase();

    // 1st keydown event
    if (!prevKeyTime) {
        prevKeyTime = Date.now();
        startTime = prevKeyTime;
        increaseKeystrokeCounter(key);
    } else {
        const timeBetweenTwoKeys = Date.now() - prevKeyTime;

        // long pressing a key generates keydown events with 30-50 millisec intervals
        if (timeBetweenTwoKeys > 50) {
            increaseKeystrokeCounter(key);
        }

        // user pauses for 1 or more second
        if (timeBetweenTwoKeys >= 1000) {
            totalPauseTime += Date.now() - prevKeyTime;
            totalPauses++;
        }
    }

    prevKeyTime = Date.now();
});

if (sliderExists) {
    slider = document.getElementById("stressLevel");
    rangeValues = {
        0: "Stress Level: 0",
        1: "Stress Level: 1",
        2: "Stress Level: 2",
        3: "Stress Level: 3",
    };

    slider.addEventListener("change", (e) => {
        document.getElementById("rangeText").innerText =
            rangeValues[slider.value];
    });
}

document.getElementById("submitButton").addEventListener("click", (e) => {
    const submitPressedTime = Date.now(); // timestamp when alert is displayed

    const text = document.getElementById("text").value;
    const words = text.split(/\s+/g);

    if (words.length < 10) {
        alert("Type atleast 10 words before submitting");
        wastedTime += Date.now() - submitPressedTime; // adding to the time spent in reading alert
    } else {
        const totalInputTime = submitPressedTime - (wastedTime + startTime);
        if (sliderExists) {
            stressLevel = Number(slider.value);
        }

        const data = {
            text,
            keystrokes,
            totalInputTime,
            totalKeystrokes,
            totalPauseTime,
            totalPauses,
        };

        if (sliderExists) {
            if (
                !confirm(
                    "Is your Stress level correct?\nClick Cancel if you would like to edit something."
                )
            ) {
                wastedTime += Date.now() - submitPressedTime; // adding to the time spent in confirming stress level
            } else {
                axios
                    .post(`/type-data?token=${token}`, { stressLevel, ...data })
                    .then(() => {
                        alert("Data recorded!");
                        window.location = "/";
                    })
                    .catch((err) => console.log(err));
            }
        } else {
            axios
                .post(`/stress-detection?token=${token}`, data)
                .then((res) => {
                    const message =
                        res.data.stressLevel == 1
                            ? "Looks like you're stressed! Take a break"
                            : "No stress detected!";
                    alert(message);
                    window.location = "/";
                })
                .catch((err) => console.log(err));
        }
    }
});

function increaseKeystrokeCounter(key) {
    if (alphanumeric.includes(key)) {
        keystrokes["alphanumeric"] = keystrokes["alphanumeric"] + 1 || 1;
    } else if (sentenceEndingPunctuation.includes(key)) {
        keystrokes["sentenceEndingPunctuation"] =
            keystrokes["sentenceEndingPunctuation"] + 1 || 1;
        keystrokes["punctuation"] = keystrokes["punctuation"] + 1 || 1;
    } else if (punctuation.includes(key)) {
        keystrokes["punctuation"] = keystrokes["punctuation"] + 1 || 1;
    } else {
        keystrokes[key] = keystrokes[key] + 1 || 1;
    }

    totalKeystrokes++;
}
