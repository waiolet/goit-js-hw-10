import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const buttonEl = document.querySelector('[data-start]');
buttonEl.setAttribute('disabled', '');
let userSelectedDate;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (selectedDates[0] < Date.now()) {
      buttonEl.setAttribute('disabled', '');
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topCenter',
      });
    } else {
      buttonEl.removeAttribute('disabled');
    }
  },
});

buttonEl.addEventListener('click', onClickStartTimer);
const addLeadingZero = value => String(value).padStart(2, '0');

function updateTimerDisplay(timeLeft) {
  const { days, hours, minutes, seconds } = convertMs(timeLeft);

  const daysEl = document.querySelector('[data-days]');
  const hoursEl = document.querySelector('[data-hours]');
  const minutesEl = document.querySelector('[data-minutes]');
  const secondsEl = document.querySelector('[data-seconds]');

  daysEl.textContent = days;
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

let intervalID;
function onClickStartTimer() {
  const input = document.querySelector('#datetime-picker');

  intervalID = setInterval(() => {
    const currentTime = Date.now();
    const timeLeft = userSelectedDate - currentTime;

    if (timeLeft >= 0) {
      updateTimerDisplay(timeLeft);
      buttonEl.setAttribute('disabled', '');
      input.setAttribute('disabled', '');
    } else if (timeLeft <= 0) {
      clearInterval(intervalID);
      input.removeAttribute('disabled');
      buttonEl.removeAttribute('disabled');
    }
  }, 1000);
}