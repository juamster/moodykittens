/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
let kittenMood = ""
let kittenNames = ["Madison", "Dario", "ModMax", "FluffyPur", "Spotify", "Whiskey"]

/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()  // stops loading of the page upon submit
  let form = event.target
  let kittenName = form.name.value

  /* if the user doesn't choose a name, pick one */
  if (kittenName == "") {
    let num = Math.floor(Math.random() * 5)
    kittenName = kittenNames[num]
    alert("No name selected, I'll pick! Meet " + kittenName)
  }

  if (kittens.find(k => k.name == kittenName)) {
    alert("Can't have two kittens with the same name")
  } else {


    let thisId = generateId()
    let theKitten = {
      id: thisId,
      name: kittenName,
      mood: "tolerant",
      affection: 5
    }

    kittens.push(theKitten)
    saveKittens()
  }
  form.reset()
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  drawKittens();
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let savedKittens = JSON.parse(window.localStorage.getItem("kittens"))
  if (savedKittens) {
    kittens = savedKittens
  }
  // drawKittens();
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  loadKittens()
  let template = ""

  kittens.forEach(kitten => {
    let showDelete = "hidden"
    let showButtons = ""
    if (kitten.mood == "gone") {
      showDelete = ""
      showButtons = "hidden"
    }
    template += `
      <div id="cat-card" class="kitten p-2 ${kitten.mood}">
        <img src="https://robohash.org/${kitten.name}?set=set4" height="100" alt="meow">
          <p>Name: ${kitten.name}</p>
          <p> mood: ${kitten.mood} </p>
          <p> Tolerance: ${kitten.affection} </p>   
          <div id="cat-buttons" class="align-items-center ${showButtons}">
            <button onclick="pet('${kitten.id}')">Pet Me</button>
            <button onclick="catnip('${kitten.id}')">Catnip</button>
          </div>
          <div id="delete-cat" class="align-items-center ${showDelete}">
            <button onclick="deleteKitten('${kitten.id}')">Delete Kitty</button>
          </div>
        </div>
   `
  })
  document.getElementById("kittens").innerHTML = template
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  let thisKitten = findKittenById(id)
  let i = Math.floor(Math.random() * 10)
  if (i > 7) {
    thisKitten.affection++
  } else {
    thisKitten.affection--
  }
  setKittenMood(thisKitten)
  saveKittens()

}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let thisKitten = findKittenById(id)
  thisKitten.mood = "tolerant"
  thisKitten.affection = 5
  saveKittens()
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  document.getElementById("cat-card").classList.remove(kitten.mood)
  if (kitten.affection > 6) {
    kitten.mood = "happy"
  } else if (kitten.affection <= 0) {
    kitten.mood = "gone"
  } else if (kitten.affection <= 3) {
    kitten.mood = "angry"
  } else {
    kitten.mood = "tolerant"
  }
  document.getElementById("cat-card").classList.add(kitten.mood)

  saveKittens()
}
/**
 * Deletes the kitten from the storage
 * Called with a kitten id and removes the kitten
 * saveKittens is called (which will then call draw)
 * @param {string} id 
 */
function deleteKitten(id) {

  let index = kittens.findIndex(kitten => kitten.id == id)
  if (index == -1) {
    throw new Error("Invalid Kitten id")
  }
  kittens.splice(index, 1)
  saveKittens()

}

function getStarted() {
  document.getElementById("welcome").remove();
  drawKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}
