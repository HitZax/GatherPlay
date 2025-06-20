window.deceptionComponents = {
    sceneTiles: [
        { id: 1, name: "CAUSE OF DEATH", type: "cause", options: [
            "Suffocation", // 窒息 
            "Severe Injury", // 重傷 
            "Loss of Blood", // 失血 
            "Poisoning", // 中毒 
            "Accident", // 意外 
            "Illness/Disease" // 病發 
        ]},
        { id: 2, name: "LOCATION OF CRIME", type: "location", options: [
            "Pub", // 酒吧 
            "Bookstore", // 書店 
            "Restaurant", // 餐廳 
            "Hotel", // 酒店 
            "Hospital", // 醫院 
            "Building Site" // 地盤 
        ]},
        { id: 3, name: "CORPSE CONDITION", type: "scene", options: [
            "Still Warm", // 
            "Decayed", // 腐爛 
            "Incomplete", // 殘缺 
            "Intact", // 完整 
            "Twisted", // 扭曲 
            "Partial" // 局部 
        ]},
        { id: 4, name: "DURATION OF CRIME", type: "scene", options: [
            "Instantaneous", // 瞬間 
            "Brief", // 短暫 
            "Gradual", // 逐漸 
            "Prolonged", // 
            "Few Days", // 
            "Unclear" // 
        ]},
        { id: 5, name: "WEATHER", type: "scene", options: [
            "Sunny", // 晴朗 
            "Stormy", // 雷雨 
            "Dry", // 乾燥 
            "Humid", // 潮濕 
            "Cold", // 寒冷 
            "Hot" // 炎熱 
        ]},
        { id: 6, name: "ON CORPSE", type: "scene", options: [
            "Head", // 
            "Chest", // 胸部 
            "Hand", // 手部 
            "Leg", // 腿部 
            "All over", // 全身 
            "Stiff" // 偏硬 
        ]},
        { id: 7, name: "DAY OF THE WEEK", type: "scene", options: [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Weekend"
        ]},
        { id: 8, name: "TIME OF DAY", type: "scene", options: [
            "Morning", "Noon", "Afternoon", "Evening", "Night", "Midnight"
        ]},
        { id: 9, name: "VICTIM'S CLOTHES", type: "scene", options: [
            "Formal Wear", "Casual Wear", "Uniform", "Sportswear", "Pajamas", "Underwear"
        ]},
        { id: 10, name: "VICTIM'S GENDER", type: "scene", options: [
            "Male", "Female", "Unknown", "Androgynous"
        ]},
        { id: 11, name: "VICTIM'S AGE", type: "scene", options: [
            "Child", "Teenager", "Young Adult", "Middle-Aged", "Elderly", "Unknown"
        ]},
        { id: 12, name: "CRIME SCENE CONDITION", type: "scene", options: [
            "Messy", "Orderly", "Destroyed", "Untouched", "Bloody", "Clean"
        ]},
        { id: 13, name: "SOUNDS HEARD", type: "scene", options: [
            "Silence", "Screaming", "Struggle", "Music", "Animal Noises", "Traffic"
        ]},
        { id: 14, name: "LIGHTING", type: "scene", options: [
            "Bright", "Dim", "Dark", "Natural Light", "Artificial Light", "Flickering"
        ]},
        { id: 15, name: "ODOR", type: "scene", options: [
            "Foul", "Sweet", "Metallic", "Chemical", "Familiar", "None"
        ]},
        { id: 16, name: "VICTIM'S STATUS", type: "scene", options: [
            "Alone", "With Others", "Traveling", "Working", "Sleeping", "Eating"
        ]}
    ],
    clueCards: [
        // As per the rulebook, there are 200 clue cards, with "Skull" being an example.
        // The list below is an expansion for variety and reasonableness.
        "Skull", "Wallet", "Lipstick", "Glove", "Watch", "Ring", "Notebook", "Key", "Umbrella",
        "Scarf", "Sunglasses", "Cigarette", "Photograph", "Ticket", "Pen", "Book", "Map",
        "Necklace", "Earring", "Handbag", "Badge", "Phone", "Camera", "Glass Shards", "Broken Mirror",
        "Clothing Fiber", "Shoes", "Jewelry Box", "Document", "Tablet", "Laptop", "Briefcase", "Bottle",
        "Cup", "Chair", "Table", "Lamp", "Plant", "Flower", "Ashtray", "Statuette", "Vase",
        "Painting", "Car Key", "ID Card", "Coin", "Pill Bottle", "Syringe", "Lighter", "Matches",
        "Comb", "Brush", "Hairpin", "Shampoo Bottle", "Soap Bar", "Towel", "Perfume Bottle", "Cologne",
        "Razor", "Toothbrush", "Toothpaste", "Bandage", "First Aid Kit", "Toolbox", "Measuring Tape",
        "Screwdriver", "Hammer", "Pliers", "Wrench", "Saw", "Drill Bit", "Tape", "Glue Tube",
        "Rope Fragment", "Chain", "Wire", "Cable Tie", "Duct Tape", "Zip Tie", "Handcuffs", "Mask",
        "Hoodie", "Hat", "Cap", "Glasses", "Contact Lens Case", "Passport", "Plane Ticket", "Train Ticket",
        "Bus Ticket", "Receipt", "Bill", "Postcard", "Letter", "Newspaper", "Magazine", "Brochure",
        "Menu", "Wine Glass", "Beer Bottle", "Soda Can", "Plastic Bag", "Shopping Bag", "Trash Bag",
        "Food Wrapper", "Leftovers", "Fruit", "Vegetable", "Meat", "Bread Crumbs", "Cake Slice", "Candy Wrapper",
        "Chocolate Bar", "Drink Carton", "Juice Box", "Milk Carton", "Water Bottle", "Coffee Cup", "Tea Bag",
        "Sugar Packet", "Salt Shaker", "Pepper Shaker", "Condiment Packet", "Napkin", "Tissue",
        "Paper Towel", "Sponge", "Cleaning Spray Bottle", "Disinfectant Wipes", "Bleach Bottle", "Rubber Gloves",
        "Bucket", "Mop", "Broom", "Dustpan", "Vacuum Cleaner", "Iron", "Ironing Board",
        "Laundry Detergent", "Fabric Softener", "Clothes Hanger", "Sewing Kit", "Needle", "Thread Spool",
        "Button", "Zipper", "Shoelace", "Belt", "Tie", "Bowtie", "Cufflinks", "Socks",
        "Underwear", "Bra", "Pantyhose", "Swimsuit", "T-shirt", "Shirt", "Sweater", "Jacket",
        "Coat", "Dress", "Skirt", "Pants", "Shorts", "Jeans", "Uniform Patch", "Apron",
        "Chef Hat", "Gown", "Stethoscope", "Scalpel", "Crutches", "Wheelchair", "Pills",
        "Prescription Bottle", "Thermometer", "Blood Pressure Cuff", "X-ray Film", "Medical Chart",
        "File Folder", "USB Drive", "External Hard Drive", "CD", "DVD", "Charger", "Headphones",
        "Speaker", "Microphone", "Webcam", "Router", "Modem", "Keyboard", "Mouse", "Monitor",
        "Printer Cartridge", "Scanner", "Projector", "Remote Control", "Batteries", "Light Bulb",
        "Candle", "Flashlight", "Hard Hat", "Safety Vest", "Blueprint", "Level Tool",
        "Paint Can", "Paint Brush", "Roller", "Drop Cloth", "Ladder", "Construction Cone",
        "Cement Bag", "Brick", "Tile Fragment", "Wood Plank", "Metal Pipe", "Wire Cutter",
        "Electrical Tape", "Fuse", "Circuit Breaker", "Outlet", "Switch", "Extension Cord",
        "Power Strip", "Air Freshener", "Insect Repellent Spray", "Pest Trap", "Hand Sanitizer",
        "Cotton Balls", "Q-tips", "Makeup Palette", "Hair Spray Can", "Hair Gel", "Mousse Bottle",
        "Curling Iron", "Hair Dryer", "Hair Straightener", "Hairbrush", "Tweezers", "Nail Clippers",
        "Nail File", "Nail Polish Bottle", "Lotion Bottle", "Sunscreen Tube", "Aftershave Bottle",
        "Deodorant", "Body Wash Bottle", "Bath Bomb", "Bubble Bath Bottle", "Rubber Duck", "Toy Car",
        "Puzzle Piece", "Board Game Box", "Playing Cards", "Dice", "Chess Piece", "Checkers Piece",
        "Domino", "Jigsaw Puzzle Box", "Coloring Book", "Crayon", "Marker", "Colored Pencil",
        "Pencil Sharpener", "Eraser", "Ruler", "Protractor", "Compass", "Calculator",
        "Glue Stick", "Construction Paper", "Stickers", "Glitter", "Feather", "Pipe Cleaner",
        "Googly Eyes", "Yarn", "Knitting Needles", "Crochet Hook", "Fabric Swatch", "Thread Spool",
        "Sewing Machine", "Pins", "Pincushion", "Thimble", "Dress Form", "Mannequin Part",
        "Cash Register Tape", "Credit Card", "Bar Code Scanner", "Shopping Cart",
        "Shopping Basket", "Price Tag", "Security Tag", "Alarm Clock", "Bedside Lamp", "Pillow",
        "Blanket", "Duvet", "Sheet", "Mattress Tag", "Nightstand", "Dresser Drawer", "Wardrobe Door",
        "Closet Door", "Shoe Rack", "Watch Box", "Tie Rack", "Belt Rack", "Coat Rack",
        "Umbrella Stand", "Doormat", "Rug", "Carpet Sample", "Curtain Rod", "Blind Slat",
        "Window Pane", "Door Knob", "Lock", "Key (house)", "Mailbox", "Plant Pot",
        "Flower Petals", "Candle Holder", "Picture Frame", "Statue Fragment", "Figurine",
        "Collectible Item", "Souvenir", "Trophy", "Award", "Medal", "Certificate",
        "Diploma", "License", "Permit", "Name Tag", "Work Uniform"
    ],
    meansCards: [
        // As per the rulebook, there are 90 means cards, with "Axe" being an example.
        // The list below is an expansion for variety and reasonableness.
        "Axe", "Poison", "Knife", "Gun", "Rope", "Pillow", "Baseball Bat", "Scissors", "Wrench",
        "Hammer", "Fire", "Electricity", "Drowning", "Suffocation", "Explosion", "Vehicle", "Pesticide",
        "Chainsaw", "Drill", "Crowbar", "Bottle", "Ashtray", "Vase", "Statuette", "Candlestick",
        "Frying Pan", "Rolling Pin", "Blunt Object", "Sharp Object", "Broken Glass", "Ice Pick",
        "Syringe", "Pills", "Chemicals", "Acid", "Gas", "Smoke", "Allergens", "Venom",
        "Garrote", "Wire", "Belt", "Scarf", "Tie", "Socks", "Stockings", "Plastic Bag",
        "Duct Tape", "Pillow Case", "Blanket", "Curtain", "Chain", "Heavy Object", "Falling Object",
        "Push", "Stab", "Shoot", "Strangulation", "Beating", "Drowning (intentional)", "Burning",
        "Electrocution", "Explosive Device", "Car", "Truck", "Motorcycle", "Bicycle", "Boat",
        "Plane", "Train", "Bus", "Tram", "Subway", "Elevator", "Escalator", "Stairs",
        "Balcony Fall", "Window Fall", "Roof Fall", "Ladder", "Scaffolding Collapse", "Construction Equipment",
        "Industrial Machine", "Farm Equipment", "Sports Equipment", "Musical Instrument",
        "Kitchen Utensil", "Garden Tool", "Office Supply", "Medical Instrument", "Lab Equipment",
        "Pet Animal", "Wild Animal", "Insect Swarm", "Spider Bite", "Snake Bite", "Plant Toxin", "Fungus",
        "Dehydration", "Starvation", "Exposure", "Hypothermia", "Heatstroke", "Disease",
        "Overdose", "Underdose", "Drug Reaction", "Allergic Reaction", "Food Poisoning",
        "Radiation", "Vacuum", "Pressure", "Sound", "Light", "Vibration",
        "Sleep Deprivation", "Psychological Trauma", "Hypnosis", "Mind Control", "Magic Trick",
        "Curse", "Supernatural Event", "Alien Attack", "Robot Malfunction", "AI Gone Rogue",
        "Time Travel Paradox", "Dimension Collapse", "Cosmic Event", "Natural Disaster",
        "Earthquake", "Tsunami", "Volcanic Eruption", "Flood", "Tornado", "Hurricane",
        "Blizzard", "Landslide", "Avalanche", "Wildfire", "Dust Storm", "Meteorite Impact"
    ]
};