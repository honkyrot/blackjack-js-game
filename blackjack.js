// Main blackjack script
// Created by: Honkyrot on 09/23/2023 (hey thats my birthday!)
// inspired by https://github.com/therealgman2016 to make this

//game variables
let dealer_hand = [];
let player_turn = true;

// player hand
let player_hand = [];
let player_hand_variables = [];  // variables like if it busted, won, etc
// player_hand_variables in the format of
// {bet: 0, hit: 0, stand: false, double: false, split: false, surrender: false, bust: false, win: false, blackjack: false, twenty_one: false, disabled: false}
let players_hand_count = 0; // for split
let current_player_index = 0; // for split
let maximum_hands = 20; // current max hands, 1 by default
var current_player_hand;
var assigned_player_div; // for adding cards
// formatted hand as
//[[hand1],[hand2]]

let total_player_score = 0;
let player_score = [];

//player variables
let money = 10000;
let starting_money = 10000;
let total_betted = 0;  // all hands combined
let bet = 0;
let bet_percent = 0;
let potential_earnings = 0; // how much you can earn (or lose)

//gameplay variables
let game_active = false;
let game_over = false;
let dealer_score = 0;
let automatic_bet = false;  // if true, the bet will be automatically set to the last bet percentage

// temp gameplay variables
let temp_hands_won = 0;
let temp_hands_lost = 0;
let temp_hands_pushed = 0;
let temp_hands_blackjack = 0;
let temp_hands_busted = 0;
let temp_hands_surrendered = 0;
let temp_hands_doubled = 0;
let temp_hands_split = 0;

// deck settings
let infinite_deck = false;  // if true, the game will use an infinite deck, voiding the card counting system
let deck_count = 8;  // how many decks to use, only works if infinite_deck is false
let deck_count_max = 8;  // max amount of decks to use, only works if infinite_deck is false
let minimum_cards_left = 20;  // minimum amount of cards left before the deck is reshuffled, only works if infinite_deck is false

//misc variables
let total_resets = 0;
let total_wins = 0;
let total_pushes = 0;
let total_losses = 0;
let total_banruptcy = 0;  // when you lose all your money

// cheat variables
let cheat_double_earnings = false;  // if true, you will earn double the money on wins
let cheat_max_hands = 0;  // if > 1, you can have more than 2 hands, acts like you've already split
let cheat_max_hands_enabled = false; 

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

let temp_deck = [];
const down_card = {src:'blue.svg', value:0, suit:"back"};

//ids
const dealer_hand_container = document.getElementById("dealers_hand_container");
const players_hand_container = document.getElementById("players_hand_container");
const player_hand_container = document.getElementById("players_hands_extra");
const player_score_text = document.getElementById("player_hand_value");
const dealer_score_text = document.getElementById("dealer_hand_value");
const bet_amount_text = document.getElementById("bet_amount");
const bet_amount_percent_text = document.getElementById("bet_amount_percent");
const money_amount_text = document.getElementById("money_amount");
const custom_bet_input = document.getElementById("custom_bet_input");
const automatic_bet_text = document.getElementById("automatic_betting_text");
const deck_size_text = document.getElementById("deck_size");

const hit_button = document.getElementById("hit_button");
const stand_button = document.getElementById("stand_button");
const double_button = document.getElementById("double_button");
const split_button = document.getElementById("split_button");
const surrender_button = document.getElementById("surrender_button");
// alt for dynamic hands
const hit_button_2 = document.getElementById("hit_button_2");
const stand_button_2 = document.getElementById("stand_button_2");
const double_button_2 = document.getElementById("double_button_2");
const split_button_2 = document.getElementById("split_button_2");

const bet_5_percent_button = document.getElementById("bet_5_percent_button");
const bet_10_percent_button = document.getElementById("bet_10_percent_button");
const bet_25_percent_button = document.getElementById("bet_25_percent_button");
const bet_50_percent_button = document.getElementById("bet_50_percent_button");
const bet_75_percent_button = document.getElementById("bet_75_percent_button");
const bet_100_percent_button = document.getElementById("bet_100_percent_button");
const custom_bet_button = document.getElementById("custom_bet_button");

const reset_button = document.getElementById("reset_button");
const start_button = document.getElementById("start_button");

const playing_board = document.getElementById("playing_board");
const background_div = document.getElementById("background_gradient");
const background_div_loss = document.getElementById("background_gradient_overlay_loss");
const background_div_win = document.getElementById("background_gradient_overlay_win");

const stats_games_played = document.getElementById("games_played");
const stats_wins = document.getElementById("games_won");
const stats_losses = document.getElementById("games_lost");
const stats_pushes = document.getElementById("games_pushed");
const stats_win_percent = document.getElementById("win_percentage");
const stats_banruptcy = document.getElementById("banruptcy_count");
const stats_dropdown_button = document.getElementById("game_stats_dropdown_button");
const stats_dropdown_panel = document.getElementById("game_stats_dropdown_panel");

const game_settings_dropdown_panel = document.getElementById("game_settings_dropdown");
const game_card_settings = document.getElementById("game_card_settings");
const game_starting_amount_div = document.getElementById("starting_amount_div");
const game_custom_deck_input = document.getElementById("custom_deck_input");
const game_custom_hands_input = document.getElementById("hands_starting_div");
const game_current_hand_selection_box = document.getElementById("current_hand_selection_box");
// more constants in data_export.js for data exporting


//message ids woaw
let messages = [];
let message_max_length = 7;

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
        messages[i].innerHTML = messages[i - 1].innerHTML.toLocaleString();
    }
    messages[1].innerHTML = message.toLocaleString();
}

// sets the bets
function set_bet(amount) {
    bet = amount;
    push_message(`Bet set to \$${bet}`);
    bet_amount_text.innerHTML = `\$${bet.toLocaleString()}`;
    bet_amount_percent_text.innerHTML = `${Math.floor((bet / money) * 100)}%`;

    if (automatic_bet) {
        automatic_bet_text.innerHTML = `Automatic Betting: (${bet_percent}%)`;
    }
}

// quick betting functions
function bet_5_percent() {
    bet_percent = 5;
    set_bet(Math.floor(money * 0.05));
}

function bet_10_percent() {
    bet_percent = 10;
    set_bet(Math.floor(money * 0.1));
}

function bet_25_percent() {
    bet_percent = 25;
    set_bet(Math.floor(money * 0.25));
}

function bet_50_percent() {
    bet_percent = 50;
    set_bet(Math.floor(money * 0.5));
}

function bet_75_percent() {
    bet_percent = 75;
    set_bet(Math.floor(money * 0.75));
}

function bet_100_percent() {
    bet_percent = 100;
    set_bet(money);
}

// sets your custom bet
function set_custom_bet() {
    let custom_amount = custom_bet_input.value;
    if (custom_amount > money) {
        push_message("You don't have that much money!");
        return;
    }
    custom_amount = Math.floor(custom_amount);  // make sure its an integer
    custom_amount = Math.abs(custom_amount);  // make sure its positive
    set_bet(custom_amount);
}

// animate money
function animate_money(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = "\$" + Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// set money
function set_money(amount) {
    money = 0;
    animate_money(money_amount_text, money, money + amount, 500);
    money = amount;
    money = Math.round(money);
}

// increment money instead of setting it
function increment_money(amount) {
    animate_money(money_amount_text, money, money + amount, 500);
    money += amount;
    money = Math.round(money);
}

// game functions

// picks a random card from the deck
function get_random_card() {
    let random_card = Math.floor(Math.random() * temp_deck.length);
    let card = temp_deck[random_card];

    temp_deck.splice(random_card, 1);  // remove the card from the deck

    //console.log(card, temp_deck.length)

    return card;
}

// starts the game
function start_game() {
    total_resets++;  // add to the total resets

    create_deck();

    dealer_hand_container.innerHTML = "";
    players_hand_container.innerHTML = "";

    if (game_active) {  // check
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

// pushes a card to the player's hand,
// if the hand doesn't exist, it will create a new hand
// if the hand does exist, it will push the card to the hand
// only function that creates a new hand
function push_player_card(index, card) {
    if (player_hand[index] == undefined) {
        player_hand[index] = [];

        player_hand_variables[index] = {bet: 0, hit: 0, stand: false,
        double: false, split: false,
        surrender: false, bust: false,
        win: false, blackjack: false,
        twenty_one: false, disabled: false};

        player_hand_variables[index].bet = bet / maximum_hands;  // set the bet for the hand

        current_player_hand = player_hand[index];
        current_player_hand.push(card);
        players_hand_count++;

        var div_hand = document.createElement("div");
        div_hand.classList.add("extra_players_hand_container");
        div_hand.id = `players_hand_container_${index}`;
        div_hand.style.left = "50%";
        div_hand.style.translateX = "-50%";
        players_hand_container.appendChild(div_hand);

        players_hand_container.style.height = `${players_hand_count * 200}px`;

        var score_text = document.createElement("p");
        score_text.innerHTML = `Hand Value: <span id=\"player_hand_value_${index}\">0</span>`;
        score_text.style = "margin: 0px; padding: 0px; font-size: 16px; text-align: center; color: black;";
        div_hand.appendChild(score_text);

        assigned_player_div = div_hand;
    }
    else
    {
        current_player_hand = player_hand[index];
        current_player_hand.push(card);

        assigned_player_div = document.getElementById(`players_hand_container_${index}`);
    }
    current_player_index = index;
}

// returns the current player's score text
function get_current_player_score_text() {
    return document.getElementById(`player_hand_value_${current_player_index}`);
}

function add_to_player_score(index, amount) {
    if (player_score[index] == undefined) {
        player_score[index] = 0;
        player_score[index] += amount;
    }
    else
    {
        player_score[index] += amount;
    }
    get_current_player_score_text().innerHTML = player_score[index];
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

    for (let hands_index = 0; hands_index < maximum_hands; hands_index++) {
        setTimeout(() => {
            let card3 = get_random_card();
            let card4 = get_random_card();

            push_player_card(hands_index, card3);
            push_player_card(hands_index, card4);

            visualize_card(card3, assigned_player_div);
            visualize_card(card4, assigned_player_div);

            add_to_player_score(hands_index, card3.value + card4.value);

            check_ace(player_hand[hands_index], player_score[hands_index], true);
            update_gui();
        }
        , 50 * hands_index);

        //check_ace(player_hand, player_score, true);
    }

    setTimeout(() => {
        set_player_index(0);  // reset the current player index

        split_check(0);
    }, 50 * maximum_hands);
    
    //player_hand.push(card3, card4);
    //player_score += card3.value + card4.value;

    //var player_score_text = get_current_player_score_text();
    //player_score_text.innerHTML = player_score;

    check_ace(dealer_hand, dealer_score, false);

    //split_check();
    check_scores(true);
    update_gui();
}

// updates all the text in every player's hand
function update_players_hands() {
    for (let i = 0; i < players_hand_count; i++) {
        var score_text = document.getElementById(`player_hand_value_${i}`);
        score_text.innerHTML = player_score[i];
    }
}

// set player's index
function set_player_index(index) {
    current_player_index = index;
    current_player_hand = player_hand[index];
    assigned_player_div = document.getElementById(`players_hand_container_${index}`);
}

// quick function to update scores and text
function update_gui() {
    update_players_hands(); 
    money_amount_text.innerHTML = `\$${money.toLocaleString()}`;
    deck_size_text.innerHTML = temp_deck.length;

    // dealer score check
    //if (dealer_hand.length == 2) {
    //    dealer_score_text.innerHTML = dealer_hand[0].value + "?";
    //} else {
    //    dealer_score_text.innerHTML = dealer_score;
    //}

    // update stats
    stats_games_played.innerHTML = total_resets;
    stats_wins.innerHTML = total_wins;
    stats_losses.innerHTML = total_losses;
    stats_pushes.innerHTML = total_pushes;
    stats_win_percent.innerHTML = `${Math.floor((total_wins / total_resets) * 100)}%`;
    stats_banruptcy.innerHTML = total_banruptcy;
}

// check ace function
function check_ace(hand, score, player = true) {
    var temp_score = score; // in case theres multiple aces
    if (temp_score > 21) {
        //console.log(dealer_hand, player_hand)
        for (let i = 0; i < hand.length; i++) {
            var card = hand[i];
            if (card.value == 11) {
                card.value = 1;
                //console.log(card_deck)
                if (player) {  // subtract 10 from the player's score
                    player_score[current_player_index] -= 10;
                }
                else{
                    dealer_score -= 10;
                }
                temp_score -= 10;
                update_gui();
                //console.log("Ace changed to 1 for someone." + player)
                break;
            }
        }
    }
}

// push a message to be plastered on the hand, usually used when the hand cannot be used anymore like a bust or win
function push_hand_message(index, message, sub_message = "", custom_color = "white") {
    var hand_div = document.getElementById(`players_hand_container_${index}`)
    var message_div = document.createElement("div");
    message_div.classList.add("hand_message");

    message_div.innerHTML = '<p style="font-size: 4vw; margin-bottom: 0px; color: ' + custom_color + ';">' + message + "</p>";

    if (sub_message != "") {
        message_div.innerHTML += '<br><p style="font-size: 2vw; margin-top: 0px; color: ' + custom_color + ';">' + sub_message + "</p>";
    }
    hand_div.appendChild(message_div);
}

// check if specific hand has a split
function split_check(index) {
    if (player_hand_variables[index].split == false && player_hand_variables[index].hit == 0) {
        if (player_hand[index][0].value == player_hand[index][1].value) {
            split_button.disabled = false;
            split_button_2.disabled = false;
        }
        else
        {
            split_button.disabled = true;
            split_button_2.disabled = true;
        }
    } 
    else
    {
        split_button.disabled = true;
        split_button_2.disabled = true;
    }
}

// shifts the player's hand to the next hand down, if there is no hand, it will go to the dealer's hand
function change_hands() {
    if (current_player_index < players_hand_count - 1) {
        set_player_index(current_player_index + 1);
        game_current_hand_selection_box.style.top = `${current_player_index * 190}px`;

        // reset the buttons
        double_button.disabled = false;
        double_button_2.disabled = false;
        split_button.disabled = false;
        split_button_2.disabled = false;

        // do checks
        split_check(current_player_index);
    }
    else
    {
        player_turn = false;
        dealer_turn();
    }

    console.log("Changed hands to " + current_player_index);
}

// you lose, you lost the bet and the hand, but you can still play if you have more hands
function bust(index) {
    temp_hands_busted++;
    push_hand_message(index, "BUST", "Lost: \$" + player_hand_variables[index].bet, "pink");
    potential_earnings -= player_hand_variables[index].bet;

    change_hands();
}

// checks the final scores
function check_final_scores() {
    // look through all hands and compare them to the dealer's hand
    if (dealer_score > 21) {
        for (let i = 0; i < players_hand_count; i++) {
            // make sure hand is still valid
            if (!player_hand_variables[i].disabled) { 
                player_hand_variables[i].win = true;
                player_hand_variables[i].disabled = true;
                temp_hands_won++;
                push_hand_message(i, "WIN", "Won: \$" + player_hand_variables[i].bet, "lightgreen");
                potential_earnings += player_hand_variables[i].bet;
            }
        }

        push_message("Dealer busted!");
    }
    else
    {
        for (let i = 0; i < players_hand_count; i++) {
            // make sure hand is still valid
            if (!player_hand_variables[i].disabled) { 
                // check if the player's hand is greater than the dealer's hand
                if (player_score[i] > dealer_score) {
                    player_hand_variables[i].win = true;
                    player_hand_variables[i].disabled = true;
                    temp_hands_won++;
                    push_hand_message(i, "WIN", "Won: \$" + player_hand_variables[i].bet, "lightgreen");
                    potential_earnings += player_hand_variables[i].bet;
                }
                // push check
                else if (player_score[i] == dealer_score) {
                    player_hand_variables[i].disabled = true;
                    temp_hands_pushed++;
                    push_hand_message(i, "PUSH", "", "white");
                }
                // dealer wins
                else
                {
                    player_hand_variables[i].disabled = true;
                    temp_hands_lost++;
                    push_hand_message(i, "LOST", "Lost: \$" + player_hand_variables[i].bet, "pink");
                    potential_earnings -= player_hand_variables[i].bet;
                }
            }
        }
    }

    // money betting part
    if (potential_earnings > 0) {
        push_message("You won: \$" + potential_earnings);
        increment_money(potential_earnings);

        if (cheat_double_earnings) {  // double earnings cheat
            increment_money(potential_earnings);
        }

        total_wins++;

        transition_win_background();
    }
    else if (potential_earnings < 0) {
        push_message("You lost: \$" + Math.abs(potential_earnings));
        increment_money(potential_earnings);

        total_losses++;

        transition_loss_background();
    }
    else
    {
        push_message("You broke even!");

        total_pushes++;
    }

    reset_able = true;
}

// checks the player's score by looping through all the hands
// if final_score is true, it will check the final score
function check_scores() {
    for (let i = 0; i < players_hand_count; i++) {
        check_ace(player_hand[i], player_score[i], true);
    }
    check_ace(dealer_hand, dealer_score, false);

    // check if the player busted
    for (let i = 0; i < players_hand_count; i++) {
        if (player_score[i] > 21 && !player_hand_variables[i].bust) {
            player_hand_variables[i].bust = true;
            player_hand_variables[i].disabled = true;
            temp_hands_busted++;
            bust(i);
        }
        else if (player_score[i] == 21 && player_hand_variables[i].twenty_one == false) {
            player_hand_variables[i].twenty_one = true;
        }
    }
}

var reset_able = true;

// checks the final scores
// function check_final_scores() {
//     reset_able = true;
//     dealer_score_text.innerHTML = dealer_score;
//     if (player_score > dealer_score) {
//         player_win();
//     }
//     else if (player_score < dealer_score && dealer_score <= 21) {
//         bust();
//     }
//     else {
//         push();
//     }
// }

// hit function
function action_hit() {
    var new_card = get_random_card();
    visualize_card(new_card, assigned_player_div);
    push_player_card(current_player_index, new_card);
    add_to_player_score(current_player_index, new_card.value);

    // disable double if the player has
    double_button.disabled = true;
    double_button_2.disabled = true;

    split_check(current_player_index);

    update_gui();
    check_scores();
    //double_button.disabled = true;  // disable double button after first hit

    player_hand_variables[current_player_index].hit++;
}

// stand function
function action_stand() {
    player_hand_variables[current_player_index].stand = true;
    change_hands();
}

function action_surrender() {
    player_hand_variables[current_player_index].surrender = true;
    push_hand_message(current_player_index, "SURRENDER", "Lost: \$" + Math.floor(player_hand_variables[current_player_index].bet / 2), "pink");
    potential_earnings -= Math.floor(player_hand_variables[current_player_index].bet / 2);
    change_hands();
}

let cards_drawn = 0;

// dealer action function
function dealer_action() {
    dealer_score_text.innerHTML = dealer_score;
    setTimeout(() => {
        if (dealer_score < 17) {
            var new_card = get_random_card();
            visualize_card(new_card, dealer_hand_container);
            dealer_hand.push(new_card);
            dealer_score += new_card.value;
            update_gui();
            check_scores();
            cards_drawn++;
            dealer_action();
        }
        else
        {
            if (!game_over) {
                setTimeout(() => {
                    check_final_scores();
                }, 100);
            }
        }
    }, (1000));
}

// dealer turn function
function dealer_turn() {
    deactivate_action_buttons();

    // reveal dealer's first card
    dealer_hand_container.innerHTML = "";
    visualize_card(dealer_hand[0], dealer_hand_container);
    visualize_card(dealer_hand[1], dealer_hand_container);
    dealer_score_text.innerHTML = dealer_score;

    if (dealer_score < 17) {
        cards_drawn = 0;
        dealer_action();
    }
    else{
        check_final_scores();
    }

    update_gui();
}

// checks if the player has a split their hand

// makes a card element
function visualize_card(card, container) {
    let card_img = document.createElement("img");
    card_img.src = `cards/${card.src}`;
    card_img.classList.add("card");
    card_img.style.opacity = "0";
    card_img.style.right = "-100px";

    container.appendChild(card_img);
    var viewport_width = playing_board.clientWidth;
    container.style.left = ((viewport_width / 2) - (container.childElementCount * 56)) - 12 + "px";

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
    surrender_button.disabled = false;
    hit_button_2.disabled = false;
    stand_button_2.disabled = false;
    double_button_2.disabled = false;
    split_button_2.disabled = false;

    hit_button.style.backgroundColor = "white";
    stand_button.style.backgroundColor = "white";
    double_button.style.backgroundColor = "white";
    split_button.style.backgroundColor = "white";
    surrender_button.style.backgroundColor = "white";
    hit_button_2.style.backgroundColor = "white";
    stand_button_2.style.backgroundColor = "white";
    double_button_2.style.backgroundColor = "white";
    split_button_2.style.backgroundColor = "white";
}

function deactivate_action_buttons() {
    hit_button.disabled = true;
    stand_button.disabled = true;
    double_button.disabled = true;
    split_button.disabled = true;
    surrender_button.disabled = true;
    hit_button_2.disabled = true;
    stand_button_2.disabled = true;
    double_button_2.disabled = true;
    split_button_2.disabled = true;

    hit_button.style.backgroundColor = "gray";
    stand_button.style.backgroundColor = "gray";
    double_button.style.backgroundColor = "gray";
    split_button.style.backgroundColor = "gray";
    surrender_button.style.backgroundColor = "gray";
    hit_button_2.style.backgroundColor = "gray";
    stand_button_2.style.backgroundColor = "gray";
    double_button_2.style.backgroundColor = "gray";
    split_button_2.style.backgroundColor = "gray";
}

function activate_betting_buttons() {
    bet_5_percent_button.disabled = false;
    bet_10_percent_button.disabled = false;
    bet_25_percent_button.disabled = false;
    bet_50_percent_button.disabled = false;
    bet_75_percent_button.disabled = false;
    bet_100_percent_button.disabled = false;
    custom_bet_button.disabled = false;

    bet_5_percent_button.style.backgroundColor = "rgb(100, 100, 255)";
    bet_10_percent_button.style.backgroundColor = "rgb(127, 127, 255)";
    bet_25_percent_button.style.backgroundColor = "white";
    bet_50_percent_button.style.backgroundColor = "white";
    bet_75_percent_button.style.backgroundColor = "rgb(255, 127, 127)";
    bet_100_percent_button.style.backgroundColor = "rgb(255, 0, 0)";
    custom_bet_button.style.backgroundColor = "white";
}

function deactivate_betting_buttons() {
    bet_5_percent_button.disabled = true;
    bet_10_percent_button.disabled = true;
    bet_25_percent_button.disabled = true;
    bet_50_percent_button.disabled = true;
    bet_75_percent_button.disabled = true;
    bet_100_percent_button.disabled = true;
    custom_bet_button.disabled = true;

    bet_5_percent_button.style.backgroundColor = "gray";
    bet_10_percent_button.style.backgroundColor = "gray";
    bet_25_percent_button.style.backgroundColor = "gray";
    bet_50_percent_button.style.backgroundColor = "gray";
    bet_75_percent_button.style.backgroundColor = "gray";
    bet_100_percent_button.style.backgroundColor = "gray";
    custom_bet_button.style.backgroundColor = "gray";
}

// automatic bet toggle
function automatic_bet_toggle() {
    automatic_bet = !automatic_bet;
    if (automatic_bet) {
        push_message("Automatic bet enabled.");
    }
    else
    {
        push_message("Automatic bet disabled.");
    }
}

// create a deck of cards or reset the deck
function create_deck() {
    if (infinite_deck) {
        temp_deck = card_deck;
        // temp_deck = card_deck.slice();  // copy the deck to the temp deck
        temp_deck = structuredClone(card_deck);  // copy the deck to the temp deck, new method
    }
    else
    {
        var deck_length = temp_deck.length;
        var temp_temp_deck = [];

        // check if the deck is too small and needs to be refreshed
        if (deck_length <= minimum_cards_left) {
            temp_deck = [];
            // create a new deck
            for (let i = 0; i < deck_count; i++) {
                temp_temp_deck = structuredClone(card_deck);
                temp_deck = temp_deck.concat(temp_temp_deck);
            }

            push_message("Deck refreshed.");
        }
    }
}

// resets the game
function reset_game() {
    if (reset_able || game_over) {
        reset_able = false
        game_over = false;

        // if data saving is enabled, call the data saving function
        if (data_save) {
            save_current_data_entry();  
        }

        // clear all timeouts, hacky way to do it
        var highest_timeout_id = setTimeout(";");
        for (var i = 0 ; i < highest_timeout_id ; i++) {
            clearTimeout(i); 
        }

        player_hand = [];  // empty hands
        dealer_hand = [];
        player_turn = true;
        player_score = [];
        dealer_score = 0;
        potential_earnings = 0;
        //amount = 1000;

        temp_hands_won = 0;
        temp_hands_lost = 0;
        temp_hands_pushed = 0;
        temp_hands_blackjack = 0;
        temp_hands_busted = 0;
        temp_hands_surrendered = 0;
        temp_hands_doubled = 0;
        temp_hands_split = 0;

        players_hand_count = 0;
        current_player_index = 0;  // would use the function but next lines empty the div
        current_player_hand = [];
        assigned_player_div = [];

        dealer_hand_container.style.left = "50%";
        //players_hand_container.style.left = "50%";
        players_hand_container.style.height = "200px";

        dealer_hand_container.innerHTML = "";
        players_hand_container.innerHTML = "";
        //player_score_text.innerHTML = "";
        dealer_score_text.innerHTML = "";

        bet_amount_text.innerHTML = "\$0";
        bet_amount_percent_text.innerHTML = "0%";

        game_current_hand_selection_box.style.top = "0px";

        money_amount_text.innerHTML = `\$${money.toLocaleString()}`;

        deactivate_action_buttons();
        activate_betting_buttons();
        start_button.disabled = false;

        reset_background();
        push_message("Game restarted to default.");

        create_deck();
        
        
        // if player broke, give them a small grant and reset, also give them a banruptcy stat
        if (money <= 0) {
            push_message("You're broke! Game over.");
            push_message("You get a small grant of \$10,000 to start over.");
            //money = 10000;
            set_money(starting_money);
            total_banruptcy++;
        }

        // automatic bet
        if (automatic_bet) {
            if (bet_percent == 0) {
            }
            else
            {
                set_bet(Math.floor(money * (bet_percent / 100)));
            }
        }

        update_gui();
    }
}

// makes the background red
function transition_loss_background() {
    //background_div.style.opacity = "0";
    background_div_loss.style.opacity = "1";
    background_div_win.style.opacity = "0";
}

// makes the background green
function transition_win_background() {
    //background_div.style.opacity = "0";
    background_div_loss.style.opacity = "0";
    background_div_win.style.opacity = "1";
}

function reset_background() {
    //background_div.style.opacity = "1";
    background_div_loss.style.opacity = "0";
    background_div_win.style.opacity = "0";
}

// dropdown menu functions
var dropdown_visible = false;
function game_stats_dropdown_button() {
    if (dropdown_visible) {
        stats_dropdown_panel.style.display = "none";
    }
    else
    {
        stats_dropdown_panel.style.display = "block";
    }
    dropdown_visible = !dropdown_visible;
}

// game settings dropdown
var game_settings_dropdown_visible = false;
function toggle_game_panel() {
    if (game_settings_dropdown_visible) {
        game_settings_dropdown_panel.style.display = "none";
    }
    else
    {
        game_settings_dropdown_panel.style.display = "block";
    }
    game_settings_dropdown_visible = !game_settings_dropdown_visible;
}

// card counting toggle
function card_counting_toggle() {
    infinite_deck = !infinite_deck;
    if (infinite_deck) {
        push_message("∞ deck enabled.");
        game_card_settings.style = "display: none;";
    }
    else
    {
        push_message("∞ deck disabled.");
        game_card_settings.style = "display: block;";
    }
}

// custom amount settings
var custom_starting_amount = false;
function starting_amount_toggle() {
    if (custom_starting_amount) {
        game_starting_amount_div.style = "display: none;";
    }
    else
    {
        game_starting_amount_div.style = "display: block;";
    }
    custom_starting_amount = !custom_starting_amount;
}

// for some inputs that need to save
function apply_game_settings() {
    push_message("Game settings applied.");

    // deck
    deck_count = document.getElementById("custom_deck_input").value;
    deck_count = Math.floor(deck_count);
    deck_count = Math.abs(deck_count);
    if (deck_count > deck_count_max) {
        deck_count = deck_count_max;
    }
    else if (deck_count < 1) {
        deck_count = 1;
    }

    // starting money
    starting_money = document.getElementById("starting_amount_input").value;
    starting_money = Math.abs(Math.floor(starting_money));
    set_money(starting_money);
}

// double earnings toggle
function double_earnings_toggle() {
    if (cheat_double_earnings) {
        push_message("(cheat) disabled double earnings.");
    }
    else
    {
        push_message("(cheat) enabled double earnings.");
    }
    cheat_double_earnings = !cheat_double_earnings;
}

// multiple hands toggle
function hands_starting_toggle() {
    if (cheat_max_hands_enabled) {
        push_message("(cheat) disabled multiple hands.");
        game_custom_hands_input.style = "display: none;";
        cheat_max_hands = 0;
    }
    else
    {
        push_message("(cheat) enabled multiple hands.");
        game_custom_hands_input.style = "display: block;";
        cheat_max_hands = 2;
    }
    cheat_max_hands_enabled = !cheat_max_hands_enabled;
}

// general start functions
deactivate_action_buttons();
activate_betting_buttons();
push_message("Welcome to Blackjack!");
push_message("Start the game with any bet.");
reset_game();