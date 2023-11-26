var updateInterval;
var intervalId;
var idxH = 0;
var idxM = 0;

function permutations(arr, len) {
  if (len === 1) {
    return arr.map(item => [item]);
  }

  const result = [];

  arr.forEach((item, index) => {
    const remaining = [...arr.slice(0, index), ...arr.slice(index + 1)];
    const remainingPermutations = permutations(remaining, len - 1);
    const permutationsWithItem = remainingPermutations.map(permutation => [item, ...permutation]);
    result.push(...permutationsWithItem);
  });

  return result;
}

function generatePermutations() {
  const arr = Array(60);
  for (var i=0; i<arr.length; i++) arr[i] = [];

  const nums = permutations([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
  const ops = permutations(['+','-','*','/'], 2);

  for (var i=0; i<nums.length; i++) {
    for (var j=0; j<ops.length; j++) {
      const eq = nums[i][0] + ops[j][0] + nums[i][1] + ops[j][1] + nums[i][2];
      const ans = parseFloat(eval(eq));
      if (ans >= 0 && ans < 60 && ans % 1 == 0) arr[ans].push(eq.replace("*", "x"));
    }
  }
  return arr;
}
const equations = [];
const perms = generatePermutations();


/*** main ***/
function update() {
  const today = new Date();
  const h = today.getHours();
  const m = today.getMinutes();

  idxH = (idxH + randInt(perms[h].length - 1)) % perms[h].length;
  idxM = (idxM + randInt(perms[m].length - 1)) % perms[m].length;

  for (var i=0; i < 5; i++) {
    $("#h" + i).text(perms[h][idxH].charAt(i));
    $("#m" + i).text(perms[m][idxM].charAt(i));
  }
}

function randInt(n) {
  // [0, n) の整数を返す
  return Math.floor(Math.random() * n);
}

/*** config ***/
const configInterval = document.getElementsByName('interval')
const configColor = document.getElementsByName('color')

function updateConfigs() {
  for (var i=0; i<configInterval.length; i++) {
    if (configInterval[i].checked) {
      var val = parseInt(configInterval[i].value || 10);
      if (val != updateInterval) updateInterval = val;
      break;
    }
  }

  for (var i=0; i<configColor.length; i++) {
    if (configColor[i].checked) {
      var val = configColor[i].value;
      document.documentElement.setAttribute('data-theme-mode', val)
      break;
    }
  }

  init();
}

/*** Set event listener ***/
const infoWindow = document.getElementById("overlay-info");
const closeIcon = document.querySelector('.close-icon');

infoWindow.addEventListener("click", function (e) {
  if (e.target == infoWindow)
    infoWindow.classList.remove("is-open");
  else
    updateConfigs();
});

closeIcon.addEventListener('click', function (e) {
  infoWindow.classList.remove("is-open");
});

function openInfo() {
  infoWindow.classList.add("is-open");
}

/*** initialize ***/
function init() {
  if (intervalId) clearInterval(intervalId);

  update();
  intervalId = setInterval(update, updateInterval * 1000);
}

updateInterval = 10;
init();
