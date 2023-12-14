// this script will handle data saving and exporting to a csv file for data visualization purposes
// will not actually save your money and stuff.
// saves blackjack related data

// variables
let data_save = false;  // whether to save data or not
let data_entries = [];  // the data entries
let data_indexed_entries = 0;  // the number of entries in the current data entry

// elements
const game_export_data_div = document.getElementById("export_data_div");
const game_data_current_entries_text = document.getElementById("game_data_current_entries_text");
const game_export_data_button = document.getElementById("export_data_button");

// toggle data saving
function data_save_toggle() {
    if (data_save) {
        push_message("Data recording disabled.");
        game_export_data_div.style = "display: none;";
    }
    else
    {
        push_message("Data recording enabled.");
        game_export_data_div.style = "display: block;";
    }
    data_save = !data_save;
}

// save current data entry
function save_current_data_entry() {
    var deck_size = temp_deck.length;
    // if infinite deck, set deck size to 0
    if (infinite_deck) {
        deck_size = 0;
    }

    if (data_save) {
        data_entries.push(
        {"game": total_resets, 
        "money" : money,
        "bet": bet,
        "potential_earnings": potential_earnings,
        "hands_played": maximum_hands,
        "wins": total_wins,
        "loss" : total_losses,
        "pushes": total_pushes,
        "bankruptices": total_banruptcy,
        "cards_left" : deck_size,});

        data_indexed_entries++;
        game_data_current_entries_text.innerHTML = data_indexed_entries.toString() + " entries";
        console.log(data_entries);
    }
}

// export data to csv
function export_data_csv() {
    if (data_save && data_entries.length > 0) {
        push_message("Exporting data to csv...");
        // funky shit, helped by https://www.geeksforgeeks.org/how-to-create-and-download-csv-file-in-javascript/
        csv_rows = [];
        const headers = Object.keys(data_entries[0]);
        csv_rows.push(headers.join(","));
        const values = data_entries.map(row => {
            const values = headers.map(header => {
                const escaped = ("" + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            return values.join(",");
        });

        // i dunno how this shit works
        csv_rows.push(values.join("\n"));
        const csvData = csv_rows.join("\n");
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        // what
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", "blackjack_data.csv");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}