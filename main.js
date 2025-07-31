// ===== DOM ELEMENT SELECTORS =====
// Get references to main UI elements
let oldPlayerButton = document.querySelector(".control-buttons .old-player");
let memoryGameBlocks = document.querySelector(".memory-game-blocks");
let infoContainer = document.querySelector(".info-container");
let triesElement = document.querySelector(".tries span");
let pointsElement = document.querySelector(".points span");

// ===== GAME CONFIGURATION =====
let countdownInterval; // Store reference to countdown timer
// Time limits for each category in seconds
const timeLimit = {
  animals: 105,
  countries: 240,
  emoji: 90,
  fruits: 135,
  programming: 270,
  socialMedia: 65,
  sports: 150,
  tools: 135,
  vegetables: 120,
};

// ===== GAME STATE VARIABLES =====
let selectedCategory = ""; // Currently selected game category
let categoryLabel = ""; // Display name for selected category
let lastPlayerId = null; // Store the last player ID for generating unique IDs
let lastPlayerUsername = null; // Store the last player username for continuing games
// Available category options for the user
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
};
let duration = 1000; // Delay duration after flipping two blocks
let blocks; // Array of game blocks
let blocksContainer; // Container element for game blocks
let username; // Player's name
let countdownElement; // Countdown timer element
let users = []; // Array to store user data

// ===== LEADERBOARD DOM ELEMENTS =====
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

// ===== CLEAR LEADERBOARD FUNCTIONALITY =====
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
    // If user confirms deletion
    if (result.isConfirmed) {
      // Show loading animation
      document.querySelector(".loading-dots").classList.remove("hidden");

      let deleteWaitTime;
      let players = Array.from(leaderboardTable.children);

      // Set deletion timing based on number of players
      if (players.length <= 5) {
        deleteWaitTime = 750;
      } else if (players.length <= 10) {
        deleteWaitTime = 650;
      } else {
        deleteWaitTime = 500;
      }

      // Delete each player with staggered timing for visual effect
      players.forEach((player, index) => {
        setTimeout(() => {
          player.remove();

          // After deleting the last player
          if (index === players.length - 1) {
            setTimeout(() => {
              // Hide loading animation
              document.querySelector(".loading-dots").classList.add("hidden");

              // Show success message
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

              // Clear local storage and reset users array
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

// ===== DATA INITIALIZATION =====
// Check if there are saved users in local storage
if (localStorage.getItem("users"))
  users = JSON.parse(localStorage.getItem("users"));

// ===== HOW TO PLAY FUNCTIONALITY =====
// Handle how to play button click and language selection
let howToPlayButton = document.querySelector(".how-to-play-text");
let languageButtons = document.querySelectorAll(".lang-btn");

// Add event listeners to language buttons
languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playAudio("click");

    // Handle English language selection
    if (button.dataset.lang === "en") {
      howToPlayButton.textContent = "How To Play?";

      // Show English instructions
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
      <strong>🔹 Memorize and Match:</strong> The game board will show a set of blocks with hidden images. Click two blocks at a time to flip and reveal the images. If they match, they stay revealed. If not, they'll flip back — so try to remember their positions!<br><br>
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
      // Handle Arabic language selection
      howToPlayButton.textContent = "كيفية اللعب؟";
      howToPlayButton.style.fontFamily = "'Cairo', sans-serif";

      // Show Arabic instructions
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

// ===== START GAME FUNCTIONALITY =====
// Handle start game button click
document
  .querySelector(".control-buttons .start-game")
  .addEventListener("click", () => {
    // Play click sound
    playAudio("click");

    // Prompt user for their name
    Swal.fire({
      title: "What's Your Name?",
      input: "text",
      inputLabel: "Username",
      inputPlaceholder: "Write Here...",
      position: "top",
      showCancelButton: true,
    }).then((result) => {
      // If user confirms name input
      if (result.isConfirmed) {
        username = result.value?.trim();

        // Handle empty username by generating default name
        if (!username) {
          if (localStorage.getItem("users")) {
            let usersFromStorage = JSON.parse(localStorage.getItem("users"));
            let count = 1;

            // Count existing "Unknown" users to generate unique name
            usersFromStorage.forEach((user) => {
              if (user.username.toLowerCase().startsWith("unknown")) {
                count++;
              }
              if (count > 1) {
                username = `Unknown${count}`;
              }
            });
            username = count === 1 ? "Unknown" : `Unknown${count}`;
          } else {
            username = "Unknown";
          }
        } else {
          // Format username with proper capitalization
          if (username.length === 2) username = username.toUpperCase();
          else username = username[0].toUpperCase() + username.slice(1);
        }
        // Start the main game
        mainGame();
      }
    });
  });

// ===== OLD PLAYER FUNCTIONALITY =====
// Show/hide old player button based on saved data
localStorage.getItem("users")
  ? oldPlayerButton.classList.remove("hidden")
  : oldPlayerButton.classList.add("hidden");

// Handle Old Player Button Click
oldPlayerButton.addEventListener("click", () => {
  playAudio("click");

  // Prompt for player ID
  Swal.fire({
    title: "Enter your ID",
    input: "text",
    inputLabel: "Please type your ID to continue:",
    inputPlaceholder: "xxxx",
    showCancelButton: true,
    confirmButtonText: "Continue",
    inputAttributes: {
      maxlength: 4,
      inputmode: "numeric",
      pattern: "\\d{4}",
    },
    // Validate ID format and existence
    inputValidator: (value) => {
      if (!/^\d{4}$/.test(value)) {
        return "ID must be exactly 4 digits (e.g. 1234)";
      }
      let players = JSON.parse(localStorage.getItem("users"));
      const id = value;
      let filteredPlayers = players.filter((player) => {
        return player.id == id;
      });
      if (filteredPlayers.length === 0) {
        return "This ID is not registered. Please try again.";
      }
      return null;
    },
  }).then((result) => {
    // If ID is validated and confirmed
    if (result.isConfirmed) {
      let players = JSON.parse(localStorage.getItem("users"));
      const id = result.value;
      let playerFound = players.find((player) => player.id == id);

      // Set player data for continuing game
      lastPlayerId = playerFound.id;
      lastPlayerUsername = playerFound.username;
      username = playerFound.username;

      // Show loading animation
      document.querySelector(".loading-dots").classList.remove("hidden");
      document
        .querySelectorAll(".control-buttons *")
        .forEach((button) => button.classList.add("hidden"));

      // Random loading time for better UX
      let randomTimeArray = [1000, 1500, 2000];
      let randomTime = Math.floor(Math.random() * randomTimeArray.length);
      randomMilliseconds = randomTimeArray[randomTime];

      setTimeout(() => {
        // Show buttons again and hide loading
        document
          .querySelectorAll(".control-buttons *")
          .forEach((button) => button.classList.remove("hidden"));
        document.querySelector(".loading-dots").classList.add("hidden");

        // Welcome back message
        Swal.fire({
          title: `Welcome Back! ${playerFound.username}`,
          width: 600,
          padding: "3em",
          color: "#716add",
          position: "top",
          background:
            "#fff url('https://sweetalert2.github.io/images/trees.png')",
          showConfirmButton: false,
          showCancelButton: false,
          timer: 2000,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        }).then(() => mainGame()); // Start main game after welcome message
      }, randomMilliseconds);
    }
  });
});

// ===== LEADERBOARD BUTTON FUNCTIONALITY =====
// Handle leaderboard button click
document
  .querySelector(".control-buttons .leaderboard-button")
  .addEventListener("click", () => {
    // Play click sound
    playAudio("click");

    // Remove control buttons
    document
      .querySelectorAll(".control-buttons > *")
      .forEach((span) => span.remove());

    // Show loading animation
    document.querySelector(".loading-dots").classList.remove("hidden");

    // Random loading time for better UX
    let randomTimeArray = [250, 350, 450, 500, 750, 1000, 1500];
    let randomTime = Math.floor(Math.random() * randomTimeArray.length);
    randomMilliseconds = randomTimeArray[randomTime];

    // Show leaderboard after loading
    setTimeout(() => showLeaderboard(), randomMilliseconds);
  });

// ===== SELECT MENU INTERACTION =====
// Toggle select menu open icon when clicked
document.addEventListener("click", (e) => {
  const selectEl = document.querySelector(".swal2-select");
  if (!selectEl) return false;

  // Toggle opened class on select element
  if (e.target === selectEl) {
    selectEl.classList.toggle("opened");
  } else {
    selectEl.classList.remove("opened");
  }
});

// ===== GAME BLOCK FLIPPING LOGIC =====
// Flip a block on click
function flipBlock(selectedBlock) {
  // Add flipped class to show the block
  selectedBlock.classList.add("is-flipped");

  // Get all currently flipped blocks
  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );

  // Only allow checking when two blocks are flipped
  if (allFlippedBlocks.length === 2) {
    stopClicking(); // Prevent additional clicks during check
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// ===== MAIN GAME FUNCTION =====
function mainGame(showControlButtons = true) {
  let background;

  // Create control buttons container if needed
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
    confirmButtonText: "Go!",
    inputValidator: (value) =>
      value ? undefined : "You need to choose something!",
    customClass: {
      popup: "elegant-popup",
    },
    showClass: {
      popup: "animate__animated animate__fadeIn",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOut",
    },
  }).then((categoryResult) => {
    // If category is selected
    if (categoryResult.isConfirmed) {
      resetGame(true); // Reset game state for new game

      // Set player and category information
      document.querySelector(".name span").innerHTML = username;
      selectedCategory = categoryResult.value;
      categoryLabel = inputOptions[selectedCategory];
      document.querySelector(".category span").innerHTML = categoryLabel;

      // Generate game blocks based on selected category
      let images = document.querySelectorAll(
        `.images-container .${selectedCategory} img`
      );

      // Create two blocks for each image (for matching pairs)
      for (let i = 0; i < images.length; i++) {
        for (let repeat = 1; repeat <= 2; repeat++) {
          // Create game block element
          let gameBlock = document.createElement("div");
          gameBlock.className = "game-block";
          gameBlock.dataset.technology = images[i].src
            .split("/")
            .pop()
            .split(".")[0];

          // Create front face (hidden side)
          let frontDiv = document.createElement("div");
          frontDiv.classList.add("face", "front");

          // Create back face (image side)
          let backDiv = document.createElement("div");
          backDiv.classList.add("face", "back");

          // Add image to back face
          let image = document.createElement("img");
          image.src = images[i].src;

          // Assemble the block
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

      // Start countdown timer
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
      shuffle(orderRange); // Randomize block positions

      // Apply shuffled order and add click event listeners
      blocks.forEach((block, index) => {
        block.style.order = orderRange[index];
        block.addEventListener("click", () => flipBlock(block));
      });

      // Initialize leaderboard data
      getDataFromLocalStorage();
      addUsersToPageFrom(users);
    } else {
      // If cancelled and no control buttons exist, reload page
      if (!document.querySelector(".control-buttons")) {
        window.location.reload();
      }
    }
  });
}

// ===== GAME RESET FUNCTION =====
function resetGame(keepControlButtons = false) {
  // Reset game UI and values before restarting
  pointsElement.innerHTML = 0;
  triesElement.innerHTML = 0;
  document.querySelector(".memory-game-blocks").innerHTML = "";
  document.querySelector(".name span").innerHTML = "";
  document.querySelector(".category span").innerHTML = "";
  clearInterval(countdownInterval);

  // Reset game state variables
  blocks = [];
  blocksContainer = null;
  selectedCategory = "";
  categoryLabel = "";
  clearInterval(countdownInterval);

  // Remove control buttons unless specified to keep them
  if (!keepControlButtons) {
    let existingControlButtons = document.querySelector(".control-buttons");
    if (existingControlButtons) {
      existingControlButtons.remove();
    }
  }
}

// ===== CLICK PREVENTION DURING CHECK =====
// Prevent user from clicking during block matching check
function stopClicking() {
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

// ===== BLOCK MATCHING LOGIC =====
// Check if two flipped blocks match
function checkMatchedBlocks(firstBlock, secondBlock) {
  // If blocks have the same data attribute (match)
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    // Increase points
    pointsElement.innerHTML = parseInt(pointsElement.innerHTML) + 1;

    // Remove flipped class and add matched class
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");
    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    // Play success sound and stop other sounds
    playAudio("success");
    let failSound = document.getElementById("fail");
    failSound.pause();
    let lastMinutes = document.getElementById("last-minutes");
    lastMinutes.pause();
    clearInterval(countdownInterval);
  } else {
    // If blocks don't match, increase tries count
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

    // Flip blocks back after delay
    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);

    // Play fail sound
    playAudio("fail");
  }

  // Check if all blocks are matched (game complete)
  let allMatchedBlocks = blocks.filter((matchedBlock) =>
    matchedBlock.classList.contains("has-match")
  );

  // If all blocks matched, game is won
  if (allMatchedBlocks.length === blocks.length) {
    // Add user data to leaderboard
    addUserToArray(
      username,
      categoryLabel,
      countdownElement.textContent,
      pointsElement.innerHTML,
      triesElement.innerHTML
    );

    clearInterval(countdownInterval);
    playAudio("good-result");

    // Show congratulations dialog
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
        // Add custom "Back to Menu" button
        didOpen: () => {
          const samePlayerBtn = document.createElement("button");
          samePlayerBtn.innerText = "Back To Menu";

          samePlayerBtn.className = "swal2-confirm swal2-styled same-player";
          samePlayerBtn.setAttribute("type", "button");

          const confirmBtn = Swal.getConfirmButton();
          confirmBtn.parentElement.appendChild(samePlayerBtn);

          samePlayerBtn.addEventListener("click", () => {
            // Reset player data for new player
            lastPlayerId = null;
            lastPlayerUsername = null;
            window.location.reload();
          });
        },
      }).then((result) => {
        // Handle user choice after winning
        if (result.isConfirmed) {
          mainGame(false); // Play again with same player
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          showLeaderboard(); // Show leaderboard
        }
      });
    }, 400);
  }
}

// ===== COUNTDOWN TIMER FUNCTION =====
// Countdown timer function
function countdown(duration) {
  countdownElement = document.querySelector(".info-container .countdown");
  let minutes, seconds;

  // Update countdown every second
  countdownInterval = setInterval(function () {
    // Calculate minutes and seconds
    minutes = parseInt(duration / 60);
    seconds = parseInt(duration % 60);

    // Format with leading zeros
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    // Update countdown display
    countdownElement.innerHTML = `<span class="minutes">${minutes}</span>:<span class="seconds">${seconds}</span>`;

    // Check if time's up
    if (minutes === "00" && seconds === "00") {
      // Add user data even if time runs out
      addUserToArray(
        username,
        categoryLabel,
        countdownElement.textContent,
        pointsElement.innerHTML,
        triesElement.innerHTML
      );

      // Play timeout sound and show time's up dialog
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
        // Add custom "Back to Menu" button
        didOpen: () => {
          const samePlayerBtn = document.createElement("button");
          samePlayerBtn.innerText = "Back To Menu";

          samePlayerBtn.className = "swal2-confirm swal2-styled same-player";
          samePlayerBtn.setAttribute("type", "button");

          const confirmBtn = Swal.getConfirmButton();
          confirmBtn.parentElement.appendChild(samePlayerBtn);

          samePlayerBtn.addEventListener("click", () => {
            // Reset player data for new player
            lastPlayerId = null;
            lastPlayerUsername = null;
            window.location.reload();
          });
        },
      }).then((result) => {
        // Handle user choice after timeout
        if (result.isConfirmed) {
          mainGame(false); // Play again with same player
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          showLeaderboard(); // Show leaderboard
        }
      });
    } else if (minutes === "00" && seconds === "08") {
      // Play warning sound when 8 seconds left
      playAudio("last-minutes");
    }

    // Decrease duration
    --duration;
    if (duration < 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
}

// ===== ACCESSIBILITY FUNCTION =====
// Set alt attribute for all back images (for accessibility)
function setAltForImages() {
  let allImages = Array.from(
    document.querySelectorAll(".memory-game-blocks .game-block .back img")
  );

  // Set descriptive alt text for each image
  allImages.forEach((image) => {
    image.alt = `${image.parentElement.parentElement.dataset.technology
      .slice(0, 1)
      .toUpperCase()}${image.parentElement.parentElement.dataset.technology.slice(
      1
    )}`;
  });
}

// ===== AUDIO FUNCTION =====
// Play Audio Using The Id Of The Audio Element
function playAudio(id) {
  let sound = document.getElementById(id);
  sound.pause(); // Stop any currently playing instance
  sound.currentTime = 0; // Reset to beginning
  sound.play(); // Play the sound
}

// ===== USER DATA MANAGEMENT =====
// Add user data to the users array
function addUserToArray(username, category, timeLeft, points, tries) {
  // Create a user object with game results
  const user = {
    username: lastPlayerUsername ? lastPlayerUsername : username,
    id: lastPlayerId ? lastPlayerId : generateSafeId(),
    category: category,
    timeLeft: timeLeft,
    points: points,
    tries: tries,
  };

  // Update player tracking variables
  lastPlayerId = user.id;
  lastPlayerUsername = user.username;

  // Add user to users array
  users.push(user);

  // Update UI and storage
  addUsersToPageFrom(users);
  addUsersToLocalStorageFrom(users);
}

// ===== LEADERBOARD DISPLAY FUNCTION =====
// Display users on the leaderboard page
function addUsersToPageFrom(arrayOfUsers) {
  // If there are saved users, show leaderboard
  if (localStorage.getItem("users")) {
    // Show leaderboard container with animation
    leaderboardContainer.classList.remove("hidden");
    emptyLeaderboard.classList.add("hidden");
    leaderboardContainer.classList.add("fade-in-up");

    // Show leaderboard content and controls
    leaderboardContent.classList.remove("hidden");
    leaderboardControls.classList.remove("hidden");

    // Show menu and clear buttons when not in game
    if (memoryGameBlocks.classList.contains("hidden")) {
      backToMenuButtonInLeaderboard.classList.remove("hidden");
      clearLeaderboardButton.classList.remove("hidden");
    }

    // Hide controls when in game
    if (memoryGameBlocks && !memoryGameBlocks.classList.contains("hidden"))
      leaderboardControls.classList.add("hidden");

    // Center leaderboard
    if (memoryGameBlocks.classList.contains("hidden")) {
      document.body.style.display = "flex";
      document.body.style.justifyContent = "center";
      document.body.style.alignItems = "center";
    }

    // Clear existing leaderboard entries
    leaderboardTable.innerHTML = "";

    // Sort users by points in descending order (highest first)
    arrayOfUsers.sort((a, b) => b.points - a.points);

    // Create leaderboard rows for each user
    arrayOfUsers.forEach((user, index) => {
      let row = document.createElement("tr");

      // First place gets gold medal
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
        // Second place gets silver medal
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
        // Third place gets bronze medal
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
        // All other places get regular formatting
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

      // Add row to leaderboard table
      leaderboardTable.appendChild(row);
    });
  } else {
    // If no users, show empty state
    leaderboardContainer.classList.remove("hidden");
    leaderboardContent.classList.add("hidden");
    emptyLeaderboard.classList.remove("hidden");
    leaderboardContainer.classList.add("fade-in-up");
    leaderboardControls.classList.add("hidden");

    // Center the empty state if game is hidden
    if (memoryGameBlocks.classList.contains("hidden")) {
      document.body.style.display = "flex";
      document.body.style.justifyContent = "center";
      document.body.style.alignItems = "center";
    }
  }

  // Add event listener for back to menu button
  backToMenuButtonInLeaderboard.addEventListener("click", () => {
    playAudio("click");
    window.location.reload(); // Reload page to return to menu
  });
}

// ===== LOCAL STORAGE FUNCTIONS =====
// Save users array to local storage
function addUsersToLocalStorageFrom(arrayOfUsers) {
  localStorage.setItem("users", JSON.stringify(arrayOfUsers));
}

// Load users data from local storage
function getDataFromLocalStorage() {
  let data = localStorage.getItem("users");
  if (data) {
    let users = JSON.parse(data);
    addUsersToPageFrom(users);
  }
}

// ===== LEADERBOARD DISPLAY FUNCTION =====
// Show the leaderboard screen
function showLeaderboard() {
  // Hide loading animation if present
  if (document.querySelector(".loading-dots")) {
    document.querySelector(".loading-dots").classList.add("hidden");
  }

  // Remove control buttons
  const controlButtons = document.querySelector(".control-buttons");
  if (controlButtons) controlButtons.remove();

  // Hide game elements
  infoContainer.classList.add("hidden");
  memoryGameBlocks.classList.add("hidden");

  // Load and display leaderboard data
  getDataFromLocalStorage();
  addUsersToPageFrom(users);

  // Show back to menu button for empty state
  backToMenuButtonInEmptyState.classList.remove("hidden");
  backToMenuButtonInEmptyState.addEventListener("click", () => {
    playAudio("click");
    window.location.reload(); // Reload page to return to menu
  });

  // Allow page scrolling
  document.body.style.overflow = "auto";
}

// ===== UTILITY FUNCTIONS =====
// Shuffle array items using Fisher-Yates algorithm
function shuffle(array) {
  let current = array.length,
    temp,
    random;

  // While there are elements to shuffle
  while (current > 0) {
    // Pick a random remaining element
    random = Math.floor(Math.random() * current);
    current--;

    // Swap it with the current element
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }

  return array;
}

// Generate a safe unique ID for players
function generateSafeId(length = 4) {
  // Use timestamp for uniqueness
  const timePart = Date.now()
    .toString()
    .slice(-Math.floor(length / 2));

  // Add random component
  const randomPart = Math.floor(Math.random() * Math.pow(10, length / 2))
    .toString()
    .padStart(length - timePart.length, "0");

  // Combine timestamp and random parts
  return timePart + randomPart;
}
