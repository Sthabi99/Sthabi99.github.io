# Hangman - Java Console Edition

A small Java word-guessing game that runs entirely in a terminal. No browser,
external libraries, server or network connection is needed.

This is a new implementation created during the portfolio refresh. An older
Hangman project was searched for on G: but was not located; this is not a
recovered copy of that earlier work.

## Requirements

JDK 17 or newer. Confirm that both `java -version` and `javac -version` work.

## Compile and play

From this folder:

```powershell
javac -d out src/Hangman.java src/HangmanTest.java
java -cp out Hangman
```

## Run tests

```powershell
java -cp out HangmanTest
```

The tests use a fixed word to cover winning, losing, repeated and invalid
guesses, all matching letters, replay, quitting and end-of-input.

## Rules

Guess a programming-related word one letter at a time. Six different wrong
guesses end the round. Repeated and invalid guesses do not use a chance.
Uppercase letters are accepted. Type `:quit` to stop, or choose y/n after a round.

The game demonstrates console input, loops, methods, strings, sets, enums,
encapsulated game state and automated tests.
