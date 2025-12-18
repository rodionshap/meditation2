// Timer logic: play start audio immediately and play `/audio/near_end.mp3`
// as warning 2 minutes before end.
const btn15 = document.getElementById('btn15');
const btn30 = document.getElementById('btn30');
const btnCustom = document.getElementById('btnCustom');
const btnCancel = document.getElementById('btnCancel');
const display = document.getElementById('display');
const startAudio = document.getElementById('startAudio');
const warnAudio = document.getElementById('warnAudio');
const customMinutes = document.getElementById('customMinutes');

let intervalId = null;
let warningTimeout = null;
let endTimeout = null;
let endTime = null;

function playAudioElement(el) {
	if (!el) return;
	el.currentTime = 0;
	const p = el.play();
	if (p && p.catch) {
		p.catch((err) => {
			console.warn('Audio play failed:', err);
		});
	}
}

function startTimer(minutes) {
	stopTimer();
	const ms = Math.max(1, Number(minutes)) * 60 * 1000;
	endTime = Date.now() + ms;

	// play start audio immediately
	playAudioElement(startAudio);

	// schedule warning 2 minutes before end (or immediately if too short)
	const warnBefore = 2 * 60 * 1000;
	const warnDelay = Math.max(0, ms - warnBefore);
	warningTimeout = setTimeout(() => {
		playAudioElement(warnAudio);
	}, warnDelay);

	// schedule end: clear timers and update UI
	endTimeout = setTimeout(() => {
		stopTimer();
		display.textContent = 'Beendet';
	}, ms);

	intervalId = setInterval(updateDisplay, 500);
	updateButtons(true);
	updateDisplay();
}

function updateDisplay() {
	if (!endTime) {
		display.textContent = 'Bereit';
		return;
	}
	const remaining = Math.max(0, endTime - Date.now());
	const mins = Math.floor(remaining / 60000);
	const secs = Math.floor((remaining % 60000) / 1000);
	display.textContent = `${String(mins).padStart(2, '0')}:${String(
		secs
	).padStart(2, '0')}`;
}

function stopTimer() {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
	if (warningTimeout) {
		clearTimeout(warningTimeout);
		warningTimeout = null;
	}
	if (endTimeout) {
		clearTimeout(endTimeout);
		endTimeout = null;
	}
	endTime = null;
	updateButtons(false);
}

function updateButtons(running) {
	btn15.disabled = running;
	btn30.disabled = running;
	btnCustom.disabled = running;
	customMinutes.disabled = running;
	btnCancel.disabled = !running;
}

btn15.addEventListener('click', () => startTimer(15));
btn30.addEventListener('click', () => startTimer(30));
btnCustom.addEventListener('click', () => {
	const v = Number(customMinutes.value);
	if (!v || v <= 0) {
		alert('Bitte gültige Minuten eingeben.');
		return;
	}
	startTimer(v);
});
btnCancel.addEventListener('click', () => {
	stopTimer();
	display.textContent = 'Abgebrochen';
});

// initialize
updateButtons(false);
