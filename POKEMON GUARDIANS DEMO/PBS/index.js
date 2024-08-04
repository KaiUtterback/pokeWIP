const fs = require('fs');

// Function to decode the trainers from the file
function decodeTrainers(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');
    const trainers = [];
    let currentTrainer = null;
    let currentPokemon = null;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#')) return;
        if (line.startsWith('[')) {
            if (currentTrainer) {
                if (currentPokemon) {
                    currentTrainer.Pokemon.push(currentPokemon);
                }
                trainers.push(currentTrainer);
            }
            const id = line.slice(1, -1);
            currentTrainer = { id, Pokemon: [] };
            currentPokemon = null;
        } else if (line.startsWith('LoseText')) {
            currentTrainer.LoseText = line.split('=')[1].trim();
        } else if (line.startsWith('Items')) {
            currentTrainer.Items = line.split('=')[1].trim().split(',');
        } else if (line.startsWith('Pokemon')) {
            if (currentPokemon) {
                currentTrainer.Pokemon.push(currentPokemon);
            }
            const [name, level] = line.split('=')[1].trim().split(',');
            currentPokemon = { name, level };
        } else if (line.startsWith('Moves')) {
            currentPokemon.Moves = line.split('=')[1].trim().split(',');
        } else if (line.startsWith('AbilityIndex')) {
            currentPokemon.AbilityIndex = parseInt(line.split('=')[1].trim());
        } else if (line.startsWith('Gender')) {
            currentPokemon.Gender = line.split('=')[1].trim();
        } else if (line.startsWith('IV')) {
            currentPokemon.IV = line.split('=')[1].trim().split(',').map(Number);
        } else if (line.startsWith('Item')) {
            currentPokemon.Item = line.split('=')[1].trim();
        } else if (line.startsWith('Shiny')) {
            currentPokemon.Shiny = line.split('=')[1].trim() === 'true';
        } else if (line.startsWith('Ball')) {
            currentPokemon.Ball = line.split('=')[1].trim();
        } else if (line.startsWith('Name')) {
            currentPokemon.Name = line.split('=')[1].trim();
        } else if (line.startsWith('Shadow')) {
            currentPokemon.Shadow = line.split('=')[1].trim() === 'true';
        }
    });

    if (currentTrainer) {
        if (currentPokemon) {
            currentTrainer.Pokemon.push(currentPokemon);
        }
        trainers.push(currentTrainer);
    }

    return trainers;
}

// Function to encode the trainers to the file
function encodeTrainers(trainers, filePath) {
    let output = '';

    trainers.forEach(trainer => {
        output += `#-------------------------------\n`;
        output += `[${trainer.id}]\n`;
        if (trainer.Items) {
            output += `Items = ${trainer.Items.join(',')}\n`;
        }
        output += `LoseText = ${trainer.LoseText}\n`;
        trainer.Pokemon.forEach(pokemon => {
            output += `Pokemon = ${pokemon.name},${pokemon.level}\n`;
            if (pokemon.Moves) {
                output += `    Moves = ${pokemon.Moves.join(',')}\n`;
            }
            if (pokemon.AbilityIndex !== undefined) {
                output += `    AbilityIndex = ${pokemon.AbilityIndex}\n`;
            }
            if (pokemon.Gender) {
                output += `    Gender = ${pokemon.Gender}\n`;
            }
            if (pokemon.IV) {
                output += `    IV = ${pokemon.IV.join(',')}\n`;
            }
            if (pokemon.Item) {
                output += `    Item = ${pokemon.Item}\n`;
            }
            if (pokemon.Shiny) {
                output += `    Shiny = ${pokemon.Shiny}\n`;
            }
            if (pokemon.Ball) {
                output += `    Ball = ${pokemon.Ball}\n`;
            }
            if (pokemon.Name) {
                output += `    Name = ${pokemon.Name}\n`;
            }
            if (pokemon.Shadow) {
                output += `    Shadow = ${pokemon.Shadow}\n`;
            }
        });
    });

    fs.writeFileSync(filePath, output);
}

// Function to update the LoseText of a trainer by ID and save the updated trainers back to the file
function updateLoseText(filePath, trainerId, newLoseText) {
    const trainers = decodeTrainers(filePath);

    trainers.forEach(trainer => {
        if (trainer.id === trainerId) {
            trainer.LoseText = newLoseText;
        }
    });

    encodeTrainers(trainers, filePath);
}

// Example usage
const filePath = './trainers.txt';
const trainerId = 'PICNICKER,Susie';
const newLoseText = 'rigged.';
updateLoseText(filePath, trainerId, newLoseText);