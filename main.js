// Define global variables
let memoryGameBlocks = document.querySelector(".memory-game-blocks");
let infoContainer = document.querySelector(".info-container");
let triesElement = document.querySelector(".tries span");
let pointsElement = document.querySelector(".points span");
let countdownInterval;
const timeLimit = {
  animals: 135,
  countries: 270,
  emoji: 120,
  fruits: 180,
  programming: 270,
  socialMedia: 90,
  sports: 170,
  tools: 165,
  vegetables: 195,
}; // Time limits for each category in seconds
let selectedCategory = "";
let categoryLabel = "";
let lastPlayerId = null; // To store the last player ID for generating unique IDs
let inputOptions = {
  animals: "Animals",
  countries: "Countries",
  emoji: "Emoji",
  fruits: "Fruits",
  programming: "Programming",
  socialMedia: "Social media",
  sports: "Sports",
  tools: "Tools",
  vegetables: "Vegetables",
}; // Available category options for the user
let duration = 1000; // Delay duration after flipping two blocks
let blocks;
let blocksContainer;
let username; // Player's name
let countdownElement; // Countdown timer element
let users = []; // Array to store user data

// Leaderboard Variables
let leaderboardContainer = document.querySelector(".leaderboard-container");
let leaderboardContent = document.querySelector(".leaderboard-content");
let leaderboardControls = document.querySelector(".leaderboard-controls");
let clearLeaderboardButton = document.querySelector(".danger");
let leaderboardTable = document.querySelector(".leaderboard-table tbody");
let emptyLeaderboard = document.querySelector(".empty-state");
let backToMenuButtonInLeaderboard = document.querySelector(
  ".leaderboard-controls .menu"
);
let backToMenuButtonInEmptyState = document.querySelector(".empty-state .menu");

// Handle clear leaderboard button click
clearLeaderboardButton.addEventListener("click", () => {
  // Play click sound
  playAudio("click");

  // Show confirmation dialog
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    showClass: {
      popup: `
      animate__animated
      animate__fadeInDown
      animate__faster
    `,
    },
    hideClass: {
      popup: `
      animate__animated
      animate__fadeOutUp
      animate__faster
    `,
    },
  }).then((result) => {
    if (result.isConfirmed) {
      document.querySelector(".loading-dots").classList.remove("hidden");
      let deleteWaitTime;
      let players = Array.from(leaderboardTable.children);
      if (players.length <= 5) {
        deleteWaitTime = 850;
      } else if (players.length <= 10) {
        deleteWaitTime = 750;
      } else {
        deleteWaitTime = 500;
      }
      players.forEach((player, index) => {
        setTimeout(() => {
          player.remove();

          if (index === players.length - 1) {
            setTimeout(() => {
              document.querySelector(".loading-dots").classList.add("hidden");
              Swal.fire({
                title: "Deleted!",
                text: "All leaderboard players have been deleted.",
                icon: "success",
                showClass: {
                  popup: `
      animate__animated
      animate__zoomIn
      animate__faster
    `,
                },
                hideClass: {
                  popup: `
      animate__animated
      animate__zoomOut
      animate__faster
    `,
                },
              });

              // Clear local storage
              localStorage.removeItem("users");
              users = [];

              // Update leaderboard display
              addUsersToPageFrom(users);
            }, 500);
          }
        }, deleteWaitTime * (index + 1));
      });
    }
  });
});

// Check if there are tasks in local storage
if (localStorage.getItem("users")) {
  users = JSON.parse(localStorage.getItem("users"));
}

// Handle how to play button click
let howToPlayButton = document.querySelector(".how-to-play-text");
let languageButtons = document.querySelectorAll(".lang-btn");

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playAudio("click");
    if (button.dataset.lang === "en") {
      howToPlayButton.textContent = "How To Play?";
      // Show how to play instructions
      setTimeout(() => {
        Swal.fire({
          title: "🧠 How to Play",
          html: `
    <div class="instructions-content" style="font-family: 'Cairo', sans-serif;">
      <p style="text-align:left">
      <strong>Welcome to the Memory Game!</strong> Your goal is to match all pairs of blocks before time runs out. Here's how it works:
      <br><br>
      <strong>🔹 Enter Your Name:</strong> Start by entering your name so your score can appear on the leaderboard.<br><br>
      <strong>🔹 Choose a Category:</strong> Select your favorite category — like Animals, Countries, Sports, Tools, and more. Each category has a different time limit, so choose wisely!<br><br>
      <strong>🔹 Memorize and Match:</strong> The game board will show a set of blocks with hidden images. Click two blocks at a time to flip and reveal the images. If they match, they stay revealed. If not, they’ll flip back — so try to remember their positions!<br><br>
      <strong>🔹 Beat the Timer:</strong> Match all the pairs before the countdown ends. The faster you match, the better your score!<br><br>
      <strong>Scoring:</strong><br>
      ✅ Each correct match gives you points.<br>
      ❌ Each wrong attempt increases your tries count.<br><br>
      <strong>🏆 Leaderboard:</strong> After the game, your name, time, score, and tries will be saved to the leaderboard — compete with others and climb to the top!<br><br>
      <em>Tip:</em> The fewer mistakes and the faster you finish, the higher you rank. Good luck! 🍀
      </p>
    </div>
    `,
          width: 600,
          confirmButtonText: "Got it!",
          customClass: {
            confirmButton: "cairo-confirm-button",
          },
          showClass: {
            popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
          },
          hideClass: {
            popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
          },
        });
      }, 500);
    } else {
      howToPlayButton.textContent = "كيفية اللعب؟";
      howToPlayButton.style.fontFamily = "'Cairo', sans-serif";
      setTimeout(() => {
        Swal.fire({
          title: "🧠 كيفية اللعب",
          html: `
        <div class="instructions-content" style="text-align:right; direction:rtl; font-family: 'Cairo', sans-serif;">
          <p>
            <strong>مرحبًا بك في لعبة الذاكرة!</strong> هدفك هو مطابقة كل أزواج الكروت قبل نفاد الوقت. إليك كيفية اللعب:
            <br><br>
            <strong>🔹 أدخل اسمك:</strong> ابدأ بكتابة اسمك ليظهر في لوحة المتصدرين.<br><br>
            <strong>🔹 اختر فئة:</strong> اختر الفئة التي تفضلها مثل الحيوانات، البلدان، الرياضة، الأدوات، وغيرها. كل فئة لها وقت مختلف.<br><br>
            <strong>🔹 احفظ وطابق:</strong> سيتم عرض مجموعة من البطاقات تحتوي على صور مخفية. انقر على بطاقتين في كل مرة. إذا تطابقتا، تبقيان مكشوفتين. إذا لم تتطابقا، ستعودان إلى وضع الإخفاء — لذا حاول تذكر الأماكن!<br><br>
            <strong>🔹 تغلب على الوقت:</strong> طابق جميع الأزواج قبل انتهاء العداد. كلما أسرعت، زادت نقاطك!<br><br>
            <strong>نظام النقاط:</strong><br>
            ✅ كل تطابق صحيح يمنحك نقطة.<br>
            ❌ كل محاولة خاطئة تزيد عدد المحاولات.<br><br>
            <strong>🏆 لوحة المتصدرين:</strong> بعد انتهاء اللعبة، سيتم حفظ اسمك والوقت والنقاط وعدد المحاولات في لوحة المتصدرين — نافس الآخرين وتصدر القائمة!<br><br>
            <em>نصيحة:</em> كلما قل عدد الأخطاء وسرِعت في المطابقة، زادت فرصك في الفوز. حظًا موفقًا! 🍀
          </p>
        </div>
      `,
          width: 600,
          confirmButtonText: "حسناً",
          customClass: {
            confirmButton: "cairo-confirm-button",
          },
          showClass: {
            popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
          },
          hideClass: {
            popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
          },
        });
      }, 500);
    }
  });
});

// Handle start game button click
document
  .querySelector(".control-buttons .start-game")
  .addEventListener("click", () => {
    // Play click sound
    playAudio("click");

    // Ask for player's name
    Swal.fire({
      title: "What's Your Name?",
      input: "text",
      inputLabel: "Username",
      inputPlaceholder: "Write Here...",
      position: "top",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        username = result.value?.trim();
        if (!username) {
          if (localStorage.getItem("users")) {
            let usersFromStorage = JSON.parse(localStorage.getItem("users"));
            let count = 1;
            usersFromStorage.forEach((user) => {
              if (user.username.toLowerCase().startsWith("unknown")) {
                count++;
              }
              if (count > 1) {
                username = `Unknown${count}`;
              }
            });
          } else {
            username = "Unknown";
          }
        } else {
          if (username.length === 2) username = username.toUpperCase();
          else username = username[0].toUpperCase() + username.slice(1);
        }
        mainGame();
      }
    });
  });

// Handle leaderboard button click
document
  .querySelector(".control-buttons .leaderboard-button")
  .addEventListener("click", () => {
    // Play click sound
    playAudio("click");

    document
      .querySelectorAll(".control-buttons > *")
      .forEach((span) => span.remove());

    document.querySelector(".loading-dots").classList.remove("hidden");

    let randomTimeArray = [250, 350, 450, 500, 750, 1000, 1500];
    let randomTime = Math.floor(Math.random() * randomTimeArray.length);
    randomMilliseconds = randomTimeArray[randomTime];

    setTimeout(() => showLeaderboard(), randomMilliseconds);
  });

// Toggle select menu open icon when clicked
document.addEventListener("click", (e) => {
  const selectEl = document.querySelector(".swal2-select");
  if (!selectEl) return false;
  if (e.target === selectEl) {
    selectEl.classList.toggle("opened");
  } else {
    selectEl.classList.remove("opened");
  }
});

// Flip a block on click
function flipBlock(selectedBlock) {
  selectedBlock.classList.add("is-flipped");
  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );

  // Only allow checking when two blocks are flipped
  if (allFlippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

function mainGame(showControlButtons = true) {
  let background;
  if (showControlButtons && !document.querySelector(".control-buttons")) {
    background = document.createElement("div");
    background.className = "control-buttons";
    document.body.appendChild(background);
  }
  // Ask player to choose a category
  Swal.fire({
    title: "Select Category",
    input: "select",
    inputOptions: inputOptions,
    inputPlaceholder: "Select a category",
    showCancelButton: true,
    inputValidator: (value) =>
      value ? undefined : "You need to choose something!",
  }).then((categoryResult) => {
    if (categoryResult.isConfirmed) {
      resetGame(true); // Reload the page to start a new game

      document.querySelector(".name span").innerHTML = username;
      selectedCategory = categoryResult.value;
      categoryLabel = inputOptions[selectedCategory];
      document.querySelector(".category span").innerHTML = categoryLabel;

      // Generate game blocks based on selected category
      let images = document.querySelectorAll(
        `.images-container .${selectedCategory} img`
      );

      for (let i = 0; i < images.length; i++) {
        for (let repeat = 1; repeat <= 2; repeat++) {
          let gameBlock = document.createElement("div");
          gameBlock.className = "game-block";
          gameBlock.dataset.technology = images[i].src
            .split("/")
            .pop()
            .split(".")[0];

          let frontDiv = document.createElement("div");
          frontDiv.classList.add("face", "front");

          let backDiv = document.createElement("div");
          backDiv.classList.add("face", "back");

          let image = document.createElement("img");
          image.src = images[i].src;

          backDiv.appendChild(image);
          gameBlock.append(frontDiv, backDiv);
          memoryGameBlocks.appendChild(gameBlock);
        }
      }

      // Set alt text for accessibility
      setAltForImages();

      // Remove the start screen
      if (document.querySelector(".control-buttons"))
        document.querySelector(".control-buttons").remove();

      document.body.style.overflow = "auto";

      // Start background game sound
      playAudio("start-game");

      // Start countdown
      countdown(timeLimit[selectedCategory]);

      // Randomly choose "?" or "!" for front blocks
      let marks = ["question-mark", "exclamation"];
      let randomMark = Math.floor(Math.random() * marks.length);
      let fronts = document.querySelectorAll(
        ".memory-game-blocks .game-block .front"
      );
      fronts.forEach((front) => {
        front.classList.remove(...marks);
        front.classList.add(marks[randomMark]);
      });

      // Prepare blocks and shuffle them
      blocksContainer = document.querySelector(".memory-game-blocks");
      blocks = Array.from(blocksContainer.children);
      let orderRange = Array.from(Array(blocks.length).keys());
      shuffle(orderRange);

      // Apply shuffled order and add click event
      blocks.forEach((block, index) => {
        block.style.order = orderRange[index];
        block.addEventListener("click", () => flipBlock(block));
      });

      getDataFromLocalStorage();
      addUsersToPageFrom(users);
    } else {
      if (!document.querySelector(".control-buttons")) {
        window.location.reload();
      }
    }
  });
}

function resetGame(keepControlButtons = false) {
  // Reset game UI and values before restarting
  pointsElement.innerHTML = 0;
  triesElement.innerHTML = 0;
  document.querySelector(".memory-game-blocks").innerHTML = "";
  document.querySelector(".name span").innerHTML = "";
  document.querySelector(".category span").innerHTML = "";
  clearInterval(countdownInterval);
  blocks = [];
  blocksContainer = null;
  selectedCategory = "";
  categoryLabel = "";
  clearInterval(countdownInterval);

  if (!keepControlButtons) {
    let existingControlButtons = document.querySelector(".control-buttons");
    if (existingControlButtons) {
      existingControlButtons.remove();
    }
  }
}

// Prevent user from clicking during check
function stopClicking() {
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

// Check if two flipped blocks match
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    pointsElement.innerHTML = parseInt(pointsElement.innerHTML) + 1;
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");
    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    playAudio("success");
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);

    playAudio("fail");
  }

  // If all blocks matched, end game with success message
  let allMatchedBlocks = blocks.filter((matchedBlock) =>
    matchedBlock.classList.contains("has-match")
  );

  if (allMatchedBlocks.length === blocks.length) {
    addUserToArray(
      username,
      categoryLabel,
      countdownElement.textContent,
      pointsElement.innerHTML,
      triesElement.innerHTML
    );

    clearInterval(countdownInterval);

    playAudio("good-result");

    setTimeout(() => {
      Swal.fire({
        imageUrl: "icons/congratulation.png",
        imageWidth: 84,
        imageHeight: 84,
        title: "🎉 Congratulations!",
        text: "You matched all the blocks correctly!",
        confirmButtonText: "Same Player",
        cancelButtonText: "Leaderboard",
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          popup: "animate__animated animate__jackInTheBox",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
        didOpen: () => {
          const samePlayerBtn = document.createElement("button");
          samePlayerBtn.innerText = "New Player";

          samePlayerBtn.className = "swal2-confirm swal2-styled same-player";
          samePlayerBtn.setAttribute("type", "button");

          const confirmBtn = Swal.getConfirmButton();
          confirmBtn.parentElement.appendChild(samePlayerBtn);

          samePlayerBtn.addEventListener("click", () => {
            lastPlayerId = null; // Reset lastPlayerId for new player
            window.location.reload();
          });
        },
      }).then((result) => {
        if (result.isConfirmed) {
          mainGame(false);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          showLeaderboard();
        }
      });
    }, 400);
  }
}

// Countdown timer function
function countdown(duration) {
  countdownElement = document.querySelector(".info-container .countdown");
  let minutes, seconds;

  countdownInterval = setInterval(function () {
    minutes = parseInt(duration / 60);
    seconds = parseInt(duration % 60);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    countdownElement.innerHTML = `<span class="minutes">${minutes}</span>:<span class="seconds">${seconds}</span>`;

    // Time's up
    if (minutes === "00" && seconds === "00") {
      addUserToArray(
        username,
        categoryLabel,
        countdownElement.textContent,
        pointsElement.innerHTML,
        triesElement.innerHTML
      );

      playAudio("timeout");
      Swal.fire({
        imageUrl: "icons/clock.png",
        imageWidth: 84,
        imageHeight: 84,
        title: "Time's Up!",
        text: "You ran out of time. Try again!",
        showCancelButton: true,
        confirmButtonText: "Same Player",
        cancelButtonText: "Leaderboard",
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown",
        },
        didOpen: () => {
          const samePlayerBtn = document.createElement("button");
          samePlayerBtn.innerText = "New Player";

          samePlayerBtn.className = "swal2-confirm swal2-styled same-player";
          samePlayerBtn.setAttribute("type", "button");

          const confirmBtn = Swal.getConfirmButton();
          confirmBtn.parentElement.appendChild(samePlayerBtn);

          samePlayerBtn.addEventListener("click", () => {
            lastPlayerId = null; // Reset lastPlayerId for new player
            window.location.reload();
          });
        },
      }).then((result) => {
        if (result.isConfirmed) {
          mainGame(false);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          showLeaderboard();
        }
      });
    } else if (minutes === "00" && seconds === "08") {
      playAudio("last-minutes");
    }

    --duration;
    if (duration < 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
}

// Set alt attribute for all back images (for accessibility)
function setAltForImages() {
  let allImages = Array.from(
    document.querySelectorAll(".memory-game-blocks .game-block .back img")
  );

  allImages.forEach((image) => {
    image.alt = `${image.parentElement.parentElement.dataset.technology
      .slice(0, 1)
      .toUpperCase()}${image.parentElement.parentElement.dataset.technology.slice(
      1
    )}`;
  });
}

// Play Audio Using The Id Of The Audio Element
function playAudio(id) {
  let sound = document.getElementById(id);
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

function addUserToArray(username, category, timeLeft, points, tries) {
  // Create a user object
  const user = {
    username: username,
    id: lastPlayerId ? lastPlayerId : generateSafeId(),
    category: category,
    timeLeft: timeLeft,
    points: points,
    tries: tries,
  };

  // Update lastPlayerId for generating unique IDs
  lastPlayerId = user.id;

  // Push user to users array
  users.push(user);

  // Add Users To Page
  addUsersToPageFrom(users);

  // Add Users To Local Storage
  addUsersToLocalStorageFrom(users);
}

function addUsersToPageFrom(arrayOfUsers) {
  if (localStorage.getItem("users")) {
    // document.body.style.display = "block";

    leaderboardContainer.classList.remove("hidden");
    emptyLeaderboard.classList.add("hidden");
    leaderboardContainer.classList.add("fade-in-up");

    leaderboardContent.classList.remove("hidden");

    leaderboardControls.classList.remove("hidden");

    if (memoryGameBlocks.classList.contains("hidden")) {
      backToMenuButtonInLeaderboard.classList.remove("hidden");
      clearLeaderboardButton.classList.remove("hidden");
    }

    if (memoryGameBlocks && !memoryGameBlocks.classList.contains("hidden"))
      leaderboardControls.classList.add("hidden");

    leaderboardTable.innerHTML = ""; // Clear existing leaderboard

    // Sort users by points in descending order
    arrayOfUsers.sort((a, b) => b.points - a.points);

    arrayOfUsers.forEach((user, index) => {
      let row = document.createElement("tr");
      if (index === 0) {
        row.innerHTML = `
        <td class="rank-cell rank-1"><span class="medal">🥇</span>${
          index + 1
        }</td>
        <td class="username-cell">${user.username}</td>
        <td><span class="id-cell">${user.id}</span></td>
        <td><span class="category-tag">${user.category}</span></td>
        <td><span class="time-badge">${user.timeLeft}</span></td>
        <td class="points-cell">${user.points}</td>
        <td class="tries-cell">${user.tries}</td>
      `;
      } else if (index === 1) {
        row.innerHTML = `
        <td class="rank-cell rank-2"><span class="medal">🥈</span>${
          index + 1
        }</td>
        <td class="username-cell">${user.username}</td>
        <td><span class="id-cell">${user.id}</span></td>
        <td><span class="category-tag">${user.category}</span></td>
        <td><span class="time-badge">${user.timeLeft}</span></td>
        <td class="points-cell">${user.points}</td>
        <td class="tries-cell">${user.tries}</td>
      `;
      } else if (index === 2) {
        row.innerHTML = `
        <td class="rank-cell rank-3"><span class="medal">🥉</span>${
          index + 1
        }</td>
        <td class="username-cell">${user.username}</td>
        <td><span class="id-cell">${user.id}</span></td>
        <td><span class="category-tag">${user.category}</span></td>
        <td><span class="time-badge">${user.timeLeft}</span></td>
        <td class="points-cell">${user.points}</td>
        <td class="tries-cell">${user.tries}</td>
      `;
      } else {
        row.innerHTML = `
        <td class="rank-cell">${index + 1}</td>
        <td class="username-cell">${user.username}</td>
        <td><span class="id-cell">${user.id}</span></td>
        <td><span class="category-tag">${user.category}</span></td>
        <td><span class="time-badge">${user.timeLeft}</span></td>
        <td class="points-cell">${user.points}</td>
        <td class="tries-cell">${user.tries}</td>
      `;
      }

      leaderboardTable.appendChild(row);
    });
  } else {
    leaderboardContainer.classList.remove("hidden");

    leaderboardContent.classList.add("hidden");

    emptyLeaderboard.classList.remove("hidden");
    leaderboardContainer.classList.add("fade-in-up");

    leaderboardControls.classList.add("hidden");

    if (memoryGameBlocks.classList.contains("hidden")) {
      document.body.style.display = "flex";
      document.body.style.justifyContent = "center";
      document.body.style.alignItems = "center";
    }
  }

  backToMenuButtonInLeaderboard.addEventListener("click", () => {
    // Play click sound
    playAudio("click");

    // Reload the page to go back to the menu
    window.location.reload();
  });
}

function addUsersToLocalStorageFrom(arrayOfUsers) {
  localStorage.setItem("users", JSON.stringify(arrayOfUsers));
}

function getDataFromLocalStorage() {
  let data = localStorage.getItem("users");
  if (data) {
    let users = JSON.parse(data);
    addUsersToPageFrom(users);
  }
}

function showLeaderboard() {
  if (document.querySelector(".loading-dots")) {
    document.querySelector(".loading-dots").classList.add("hidden");
  }
  const controlButtons = document.querySelector(".control-buttons");
  if (controlButtons) controlButtons.remove();
  infoContainer.classList.add("hidden");
  memoryGameBlocks.classList.add("hidden");
  getDataFromLocalStorage();
  addUsersToPageFrom(users);

  backToMenuButtonInEmptyState.classList.remove("hidden");
  backToMenuButtonInEmptyState.addEventListener("click", () => {
    // Play click sound
    playAudio("click");

    // Reload the page to go back to the menu
    window.location.reload();
  });

  document.body.style.overflow = "auto";
}

// Shuffle array items
function shuffle(array) {
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }

  return array;
}

function generateSafeId(length = 4) {
  const timePart = Date.now()
    .toString()
    .slice(-Math.floor(length / 2));
  const randomPart = Math.floor(Math.random() * Math.pow(10, length / 2))
    .toString()
    .padStart(length - timePart.length, "0");
  return timePart + randomPart;
}
