export const INSIDER_WORDS = {
  easy: [
    "Apple", "Banana", "Cat", "Dog", "House", "Car", "Tree", "Sun", "Moon", "Star",
    "Book", "Pen", "Chair", "Table", "Shoe", "Hat", "Ball", "Cup", "Phone", "Clock",
    "Bike", "Boat", "Fish", "Bird", "Egg", "Milk", "Bread", "Cake", "Water", "Fire",
    "Key", "Door", "Bed", "Lamp", "Bag", "Box", "TV", "Fan", "Rain", "Snow",
    "Cloud", "Wind", "Beach", "Sand", "Rock", "Grass", "Flower", "Leaf", "Road", "Bridge",
    "Bus", "Train", "Plane", "Ship", "Truck", "Baby", "Hand", "Foot", "Eye", "Nose",
    "Mouth", "Ear", "Hair", "Leg", "Arm", "Head", "Heart", "Smile", "Cry", "Jump",
    "Run", "Walk", "Swim", "Eat", "Drink", "Sleep", "Sing", "Dance", "Laugh", "Play",
    "Stop", "Go", "Red", "Blue", "Green", "Yellow", "Black", "White", "Big", "Small",
    "Hot", "Cold", "Fast", "Slow", "Happy", "Sad", "Old", "New", "Good", "Bad"
  ],
  medium: [
    "Doctor", "Teacher", "Chef", "Pilot", "Artist", "Writer", "Scientist", "Engineer", "Musician", "Actor",
    "Police", "Firefighter", "Soldier", "Farmer", "Dancer", "Athlete", "Magician", "Detective", "Sailor", "Astronaut",
    "Hospital", "School", "Restaurant", "Airport", "Library", "Museum", "Theater", "Stadium", "Church", "Temple",
    "Mountain", "Forest", "Desert", "Island", "Volcano", "Waterfall", "Cave", "Glacier", "Oasis", "Canyon",
    "Computer", "Camera", "Robot", "Drone", "Microphone", "Headphones", "Watch", "Glasses", "Umbrella", "Wallet",
    "Guitar", "Piano", "Violin", "Drum", "Trumpet", "Flute", "Harp", "Saxophone", "Accordion", "Xylophone",
    "Diamond", "Gold", "Silver", "Ruby", "Emerald", "Sapphire", "Pearl", "Crystal", "Amethyst", "Opal",
    "Spaceship", "Rocket", "Satellite", "UFO", "Comet", "Meteor", "Black hole", "Galaxy", "Star", "Planet",
    "Dragon", "Unicorn", "Mermaid", "Phoenix", "Werewolf", "Vampire", "Zombie", "Ghost", "Witch", "Wizard",
    "Castle", "Palace", "Pyramid", "Statue", "Fountain", "Windmill", "Lighthouse", "Igloo", "Tent", "Skyscraper"
  ],
  hard: [
    "Quantum", "Algorithm", "Nanotechnology", "Biomechanics", "Cryptography", "Metamorphosis", "Photosynthesis", "Symbiosis", "Ecosystem", "Paleontology",
    "Hieroglyph", "Calligraphy", "Cartography", "Philately", "Numismatics", "Archeology", "Anthropology", "Astrophysics", "Neuroscience", "Genetics",
    "Doppelganger", "Poltergeist", "Banshee", "Mythology", "Kraken", "Leviathan", "Basilisk", "Chimera", "Cerberus", "Minotaur",
    "Sphinx", "Griffin", "Pegasus", "Centaur", "Hydra", "Gorgon", "Cyclops", "Yeti", "Legend", "Folklore",
    "Hologram", "Teleportation", "Technology", "Universe", "Singularity", "Dystopia", "Utopia", "Surrealism", "Existentialism", "Philosophy",
    "Alchemy", "Secret", "Brotherhood", "Mysticism", "Zen", "Taoism", "Stoicism", "Wisdom", "Meditation", "Nostalgia",
    "Solitude", "Petrichor", "Ethereal", "Serendipity", "Threshold", "Mysterious", "Temporary", "Essential", "Melancholy", "Rebellion",
    "Jealousy", "Wanderlust", "Loneliness", "Connection", "Urgency", "Sunlight", "Purpose", "Beauty", "Passion", "Longing",
    "Democracy", "Evaluation", "Medicine", "Phobia", "Celebration",
    "Onomatopoeia", "Palindrome", "Anagram", "Oxymoron", "Euphemism", "Paradox", "Hyperbole", "Irony", "Metaphor", "Literature"
  ]
} as const;

export type WordDifficulty = keyof typeof INSIDER_WORDS | 'mixed';
