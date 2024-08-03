import chalk from 'chalk';
import readlineSync from 'readline-sync';

// Constants for the game
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = [
  'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'
];

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  getValue() {
    if (['Jack', 'Queen', 'King'].includes(this.value)) {
      return 10;
    } else if (this.value === 'Ace') {
      return 11;
    } else {
      return parseInt(this.value);
    }
  }

  toString() {
    return `${this.value} of ${this.suit}`;
  }
}

class Deck {
  constructor() {
    this.cards = [];
    suits.forEach(suit => {
      values.forEach(value => {
        this.cards.push(new Card(suit, value));
      });
    });
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal() {
    return this.cards.pop();
  }
}

class Hand {
  constructor() {
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  getScore() {
    let score = 0;
    let aceCount = 0;

    this.cards.forEach(card => {
      score += card.getValue();
      if (card.value === 'Ace') {
        aceCount++;
      }
    });

    while (score > 21 && aceCount > 0) {
      score -= 10;
      aceCount--;
    }

    return score;
  }

  toString() {
    return this.cards.join(', ');
  }
}

// Game logic
function playBlackjack() {
  const deck = new Deck();
  deck.shuffle();

  const playerHand = new Hand();
  const dealerHand = new Hand();

  playerHand.addCard(deck.deal());
  playerHand.addCard(deck.deal());
  dealerHand.addCard(deck.deal());
  dealerHand.addCard(deck.deal());

  console.log(chalk.green('Welcome to Blackjack!'));
  console.log(chalk.blue(`Your hand: ${playerHand}`));
  console.log(chalk.blue(`Dealer's hand: ${dealerHand.cards[0]}, [hidden]`));

  let playerTurn = true;
  while (playerTurn) {
    const choice = readlineSync.question('Do you want to (h)it or (s)tand? ');
    if (choice.toLowerCase() === 'h') {
      playerHand.addCard(deck.deal());
      console.log(chalk.blue(`Your hand: ${playerHand}`));
      if (playerHand.getScore() > 21) {
        console.log(chalk.red('You busted! Dealer wins.'));
        return;
      }
    } else {
      playerTurn = false;
    }
  }

  console.log(chalk.blue(`Dealer's hand: ${dealerHand}`));
  while (dealerHand.getScore() < 17) {
    dealerHand.addCard(deck.deal());
    console.log(chalk.blue(`Dealer's hand: ${dealerHand}`));
  }

  const playerScore = playerHand.getScore();
  const dealerScore = dealerHand.getScore();

  console.log(chalk.yellow(`Your score: ${playerScore}`));
  console.log(chalk.yellow(`Dealer's score: ${dealerScore}`));

  if (dealerScore > 21 || playerScore > dealerScore) {
    console.log(chalk.green('You win!'));
  } else if (playerScore === dealerScore) {
    console.log(chalk.gray('It\'s a tie!'));
  } else {
    console.log(chalk.red('Dealer wins.'));
  }
}

// Start the game
playBlackjack();

