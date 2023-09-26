// Main blackjack script
// Created by: Honkyrot on 09/23/2023 (hey thats my birthday!)
// inspired by https://github.com/therealgman2016 to make this

//game variables
let player_hand = [];
let dealer_hand = [];
let player_turn = true;

//player variables
let money = 1000;
let bet = 0;

//gameplay variables
let game_active = false;
let game_over = false;
let player_score = 0;
let dealer_score = 0;

//misc variables
let total_resets = 0;
let total_wins = 0;
let total_losses = 0;

//card deck objects!
const card_deck = [
    {src:'hearts-r02.svg', value:2, suit:"hearts"}, {src:'hearts-r03.svg', value:3, suit:"hearts"}, {src:'hearts-r04.svg', value:4, suit:"hearts"},
    {src:'hearts-r05.svg', value:5, suit:"hearts"}, {src:'hearts-r06.svg', value:6, suit:"hearts"}, {src:'hearts-r07.svg', value:7, suit:"hearts"},
    {src:'hearts-r08.svg', value:8, suit:"hearts"}, {src:'hearts-r09.svg', value:9, suit:"hearts"}, {src:'hearts-r10.svg', value:10, suit:"hearts"},
    {src:'hearts-J.svg', value:10, suit:"hearts"}, {src:'hearts-Q.svg', value:10, suit:"hearts"}, {src:'hearts-K.svg', value:10, suit:"hearts"},
    {src:'hearts-A.svg', value:11, suit:"hearts"},
    {src:'diamonds-r02.svg', value:2, suit:"diamonds"}, {src:'diamonds-r03.svg', value:3, suit:"diamonds"}, {src:'diamonds-r04.svg', value:4, suit:"diamonds"},
    {src:'diamonds-r05.svg', value:5, suit:"diamonds"}, {src:'diamonds-r06.svg', value:6, suit:"diamonds"}, {src:'diamonds-r07.svg', value:7, suit:"diamonds"},
    {src:'diamonds-r08.svg', value:8, suit:"diamonds"}, {src:'diamonds-r09.svg', value:9, suit:"diamonds"}, {src:'diamonds-r10.svg', value:10, suit:"diamonds"},
    {src:'diamonds-J.svg', value:10, suit:"diamonds"}, {src:'diamonds-Q.svg', value:10, suit:"diamonds"}, {src:'diamonds-K.svg', value:10, suit:"diamonds"},
    {src:'diamonds-A.svg', value:11, suit:"diamonds"},
    {src:'clubs-r02.svg', value:2, suit:"clubs"}, {src:'clubs-r03.svg', value:3, suit:"clubs"}, {src:'clubs-r04.svg', value:4, suit:"clubs"},
    {src:'clubs-r05.svg', value:5, suit:"clubs"}, {src:'clubs-r06.svg', value:6, suit:"clubs"}, {src:'clubs-r07.svg', value:7, suit:"clubs"},
    {src:'clubs-r08.svg', value:8, suit:"clubs"}, {src:'clubs-r09.svg', value:9, suit:"clubs"}, {src:'clubs-r10.svg', value:10, suit:"clubs"},
    {src:'clubs-J.svg', value:10, suit:"clubs"}, {src:'clubs-Q.svg', value:10, suit:"clubs"}, {src:'clubs-K.svg', value:10, suit:"clubs"},
    {src:'clubs-A.svg', value:11, suit:"clubs"},
    {src:'spades-r02.svg', value:2, suit:"spades"}, {src:'spades-r03.svg', value:3, suit:"spades"}, {src:'spades-r04.svg', value:4, suit:"spades"},
    {src:'spades-r05.svg', value:5, suit:"spades"}, {src:'spades-r06.svg', value:6, suit:"spades"}, {src:'spades-r07.svg', value:7, suit:"spades"},
    {src:'spades-r08.svg', value:8, suit:"spades"}, {src:'spades-r09.svg', value:9, suit:"spades"}, {src:'spades-r10.svg', value:10, suit:"spades"},
    {src:'spades-J.svg', value:10, suit:"spades"}, {src:'spades-Q.svg', value:10, suit:"spades"}, {src:'spades-K.svg', value:10, suit:"spades"},
    {src:'spades-A.svg', value:11, suit:"spades"}
];
const down_card = {src:'blue.svg', value:0, suit:"back"};

//ids
const dealer_hand_container = document.getElementById("dealers_hand_container");
const player_hand_container = document.getElementById("players_hand_container");
const player_score_text = document.getElementById("player_hand_value");
const dealer_score_text = document.getElementById("dealer_hand_value");
const bet_amount_text = document.getElementById("bet_amount");
const bet_amount_percent_text = document.getElementById("bet_amount_percent");
const money_amount_text = document.getElementById("money_amount");
const custom_bet_input = document.getElementById("custom_bet_input");

const hit_button = document.getElementById("hit_button");
const stand_button = document.getElementById("stand_button");
const double_button = document.getElementById("double_button");
const split_button = document.getElementById("split_button");

const bet_5_percent_button = document.getElementById("bet_5_percent_button");
const bet_10_percent_button = document.getElementById("bet_10_percent_button");
const bet_25_percent_button = document.getElementById("bet_25_percent_button");
const bet_50_percent_button = document.getElementById("bet_50_percent_button");
const custom_bet_button = document.getElementById("custom_bet_button");

const reset_button = document.getElementById("reset_button");
const start_button = document.getElementById("start_button");

//message ids woaw
let messages = [];
let message_max_length = 6;

for (let i = 1; i <= message_max_length; i++) {
    messages[i] = document.getElementById(`game_message_${i}`);
}

// sleep function
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

//push a message to the output box, max 7 messages
function push_message(message) {
    for (let i = message_max_length; i >= 2; i--) {
        messages[i].innerHTML = messages[i - 1].innerHTML;
    }
    messages[1].innerHTML = message;
}

// sets the bets
function set_bet(amount) {
    bet = amount;
    push_message(`Bet set to \$${bet}`);
    bet_amount_text.innerHTML = `\$${bet}`;
    bet_amount_percent_text.innerHTML = `${Math.floor((bet / money) * 100)}%`;
}

// betting functions
function bet_5_percent() {
    set_bet(Math.floor(money * 0.05));
}

function bet_10_percent() {
    set_bet(Math.floor(money * 0.1));
}

function bet_25_percent() {
    set_bet(Math.floor(money * 0.25));
}

function bet_50_percent() {
    set_bet(Math.floor(money * 0.5));
}

function set_custom_bet() {
    let custom_amount = custom_bet_input.value;
    if (custom_amount > money) {
        push_message("You don't have that much money!");
        return;
    }
    custom_amount = Math.floor(custom_amount);  // make sure its an integer
    set_bet(custom_amount);
}

// game functions

// picks a random card from the deck
function get_random_card() {
    let random_card = Math.floor(Math.random() * card_deck.length);
    let card = card_deck[random_card];

    return card;
}

// starts the game
function start_game() {
    if (game_active) {
        push_message("Game is already active!");
        return;
    }
    push_message("Game started! Select your choice.");

    activate_action_buttons();
    deactivate_betting_buttons();
    start_button.disabled = true;
    split_button.disabled = true;  // disable split button until we know if the player has a split

    dealer_first_start();
}

// passes 2 cards to the dealer & player on start, dealer's first card is hidden
function dealer_first_start() {
    let card1 = get_random_card();
    let card2 = get_random_card();

    dealer_hand.push(card1, card2);

    setTimeout(() => {
        visualize_card(down_card, dealer_hand_container);
    }, 50);
    
    setTimeout(() => {
        visualize_card(card1, dealer_hand_container);
    }, 100);
    
    dealer_score += card1.value + card2.value;

    dealer_score_text.innerHTML = card1.value + "?";

    let card3 = get_random_card();
    let card4 = get_random_card();

    player_hand.push(card3, card4);

    setTimeout(() => {
        visualize_card(card3, player_hand_container);
    }, 150);
    
    setTimeout(() => {
        visualize_card(card4, player_hand_container);
    }, 200);

    player_score += card3.value + card4.value;

    player_score_text.innerHTML = player_score;

    split_check();
}

// hit function
function action_hit() {
    visualize_card(get_random_card(), player_hand_container); // test
}

// checks if the player has a split their hand
function split_check() {
    if (player_hand[0].value == player_hand[1].value) {
        split_button.disabled = false;
    }
}


// makes a card element
function visualize_card(card, container) {
    let card_img = document.createElement("img");
    card_img.src = `cards/${card.src}`;
    card_img.classList.add("card");
    card_img.style.opacity = "0";
    card_img.style.right = "-100px";

    container.appendChild(card_img);

    setTimeout(() => {
        card_img.style.opacity = "1";
        card_img.style.right = "0px";
    }, 50);

}

// activation functions

function activate_action_buttons() {
    hit_button.disabled = false;
    stand_button.disabled = false;
    double_button.disabled = false;
    split_button.disabled = false;

    hit_button.style.backgroundColor = "white";
    stand_button.style.backgroundColor = "white";
    double_button.style.backgroundColor = "white";
    split_button.style.backgroundColor = "white";
}

function deactivate_action_buttons() {
    hit_button.disabled = true;
    stand_button.disabled = true;
    double_button.disabled = true;
    split_button.disabled = true;

    hit_button.style.backgroundColor = "gray";
    stand_button.style.backgroundColor = "gray";
    double_button.style.backgroundColor = "gray";
    split_button.style.backgroundColor = "gray";
}

function activate_betting_buttons() {
    bet_5_percent_button.disabled = false;
    bet_10_percent_button.disabled = false;
    bet_25_percent_button.disabled = false;
    bet_50_percent_button.disabled = false;
    custom_bet_button.disabled = false;

    bet_5_percent_button.style.backgroundColor = "white";
    bet_10_percent_button.style.backgroundColor = "white";
    bet_25_percent_button.style.backgroundColor = "white";
    bet_50_percent_button.style.backgroundColor = "white";
    custom_bet_button.style.backgroundColor = "white";
}

function deactivate_betting_buttons() {
    bet_5_percent_button.disabled = true;
    bet_10_percent_button.disabled = true;
    bet_25_percent_button.disabled = true;
    bet_50_percent_button.disabled = true;
    custom_bet_button.disabled = true;

    bet_5_percent_button.style.backgroundColor = "gray";
    bet_10_percent_button.style.backgroundColor = "gray";
    bet_25_percent_button.style.backgroundColor = "gray";
    bet_50_percent_button.style.backgroundColor = "gray";
    custom_bet_button.style.backgroundColor = "gray";
}

// resets the game
function reset_game() {
    player_hand = [];
    dealer_hand = [];
    player_turn = true;
    game_over = false;
    player_score = 0;
    dealer_score = 0;
    amount = 1000;
    bet = 0;

    dealer_hand_container.innerHTML = "";
    player_hand_container.innerHTML = "";

    player_score_text.innerHTML = "";
    dealer_score_text.innerHTML = "";

    bet_amount_text.innerHTML = "Bet Amount: \$0";
    bet_amount_percent_text.innerHTML = "Percent: 0%";

    money_amount_text.innerHTML = `Money: \$${money}`;

    deactivate_action_buttons();
    activate_betting_buttons();
    start_button.disabled = false;

    push_message("Game restarted to default.");
}


// general start functions
deactivate_action_buttons();
activate_betting_buttons();
push_message("Welcome to Blackjack!");
push_message("Start the game with any bet.");