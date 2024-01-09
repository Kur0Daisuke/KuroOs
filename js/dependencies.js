const animals = [
    "Aardvark",
    "Albatross",
    "Alligator",
    "Alpaca",
    "Ant",
    "Anteater",
    "Antelope",
    "Ape",
    "Armadillo",
    "Donkey",
    "Baboon",
    "Badger",
    "Barracuda",
    "Bat",
    "Bear",
    "Beaver",
    "Bee",
    "Bison",
    "Boar",
    "Buffalo",
    "Butterfly",
    "Camel",
    "Capybara",
    "Caribou",
    "Cassowary",
    "Cat",
    "Caterpillar",
    "Cattle",
    "Chamois",
    "Cheetah",
    "Chicken",
    "Chimpanzee"
]

const TerminalColors = [
    "black",
    "blue",
    "green",
    "aqua",
    "red",
    "purple",
    "yellow",
    "white",
    "gray",
    "lightblue",
    "lightgreen",
    "lightaqua",
    "lightred",
    "lightpurple",
    "lightyellow",
    "brightwhite"
]

let KeyPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.key == "space") KeyPressed = true;
})
document.addEventListener("keyup", (e) => {
    if (e.key == "space") KeyPressed = false;
})