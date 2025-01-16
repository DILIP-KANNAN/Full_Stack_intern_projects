const buttons = document.querySelectorAll('.b');
const container = document.querySelector('.bt-hold');
buttons.forEach((button) => {
  button.addEventListener('mouseenter', () => {
    buttons.forEach((btn) => btn.classList.remove('expanded'));
    button.classList.add('expanded');
    let infoBox = document.querySelector('.info-box');
    if (!infoBox) {
      infoBox = document.createElement('div');
      infoBox.classList.add('info-box');
      button.appendChild(infoBox);
    }
    infoBox.textContent = button.getAttribute('data-info');
  });
  button.addEventListener('mouseleave', () => {
    button.classList.remove('expanded');
    const infoBox = document.querySelector('.info-box');
    if (infoBox) {
      infoBox.remove();
    }
    container.classList.remove('faded');
  });
});


function updateLiveTime() {
    const now = new Date();
    const formattedTime = now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    document.getElementById("liveTime").innerText = `
    Current Time: 
    ${formattedTime}
    `;
}
setInterval(updateLiveTime, 1000);


function calculateDetails() {
    const dobDateInput = document.getElementById("dobDate").value;
    const dobTimeInput = document.getElementById("dobTime").value;

    if (!dobDateInput || !dobTimeInput) {
      document.getElementById("result").innerText = "Please enter both date and time of birth.";
      return;
    }

    const dob = new Date(`${dobDateInput}T${dobTimeInput}`);
    const now = new Date();

    if (dob > now) {
      document.getElementById("result").innerText = "The date of birth cannot be in the future!";
      return;
    }
    const diffMilliseconds = now - dob;
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = diffDays / 30.44; 
    const diffYears = Math.floor(diffMonths / 12);

    const remainingMonths = Math.floor(diffMonths % 12);
    const remainingDays = Math.floor(diffDays % 30.44);
    const remainingHours = Math.floor(diffHours % 24);
    const remainingMinutes = Math.floor(diffMinutes % 60);
    document.getElementById("result").innerHTML = `
      <p><strong>You have lived:</strong></p>
      <p>${diffYears} years, ${remainingMonths} months, ${remainingDays} days</p>
      <p>${diffMonths} total months</p>
      <p>${diffDays} total days</P>
      <p>${diffHours} total hours</p>
      <p>${diffMinutes} total minutes</p>
    `;
}


function updateCountdown() {
    const now = new Date();
    const nextYear = now.getFullYear() + 1;
    const newYear = new Date(`${nextYear}-01-01T00:00:00`);
    const timeDiff = newYear - now;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    document.getElementById("countdown").innerHTML = `
      <p class="time">${days} Days</p>
      <p class="time">${hours} Hours</p>
      <p class="time">${minutes} Minutes</p>
      <p class="time">${seconds} Seconds</p>
    `;
}
setInterval(updateCountdown, 1000);
updateCountdown();