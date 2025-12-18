// Simplified timer: only 15-minute button remains.
const btn15 = document.getElementById('btn15');
const display = document.getElementById('display');
const startAudio = document.getElementById('startAudio');

let intervalId = null;
let endTimeout = null;
let endTime = null;

function playAudioElement(el) {
	if (!el) return;
	el.currentTime = 0;
	const p = el.play();
	if (p && p.catch) p.catch(() => {});
}

function startTimer15() {
	stopTimer();
	const ms = 15 * 60 * 1000;
	endTime = Date.now() + ms;

	// play the single audio (audio/new.mp3)
	playAudioElement(startAudio);

	endTimeout = setTimeout(() => {
		stopTimer();
		display.textContent = 'Beendet';
	}, ms);

	intervalId = setInterval(updateDisplay, 500);
	updateDisplay();
	btn15.disabled = true;
}

function updateDisplay() {
	if (!endTime) {
		display.textContent = 'Bereit';
		return;
	}
	const remaining = Math.max(0, endTime - Date.now());
	const mins = Math.floor(remaining / 60000);
	const secs = Math.floor((remaining % 60000) / 1000);
	display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function stopTimer() {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
	if (endTimeout) {
		clearTimeout(endTimeout);
		endTimeout = null;
	}
	endTime = null;
	btn15.disabled = false;
}

btn15.addEventListener('click', startTimer15);

// initialize
updateDisplay();
