import java.io.PrintStream;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Random;
import java.util.Scanner;
import java.util.Set;

/** A small, dependency-free Java console game. */
public class Hangman {
    private static final String[] WORDS = {
        "java", "object", "method", "variable", "compiler",
        "database", "interface", "array", "spring", "boolean"
    };
    private static final String[] DRAWINGS = {
        " +---+\n |   |\n     |\n     |\n     |\n=====",
        " +---+\n |   |\n O   |\n     |\n     |\n=====",
        " +---+\n |   |\n O   |\n |   |\n     |\n=====",
        " +---+\n |   |\n O   |\n/|   |\n     |\n=====",
        " +---+\n |   |\n O   |\n/|\\  |\n     |\n=====",
        " +---+\n |   |\n O   |\n/|\\  |\n/    |\n=====",
        " +---+\n |   |\n O   |\n/|\\  |\n/ \\  |\n====="
    };

    enum GuessResult { CORRECT, WRONG, REPEATED, INVALID, FINISHED }

    static class Round {
        private final String word;
        private final Set<Character> guesses = new LinkedHashSet<>();
        private int mistakes;

        Round(String word) {
            if (word == null || !word.matches("[a-zA-Z]+")) {
                throw new IllegalArgumentException("A word must contain only letters A-Z.");
            }
            this.word = word.toLowerCase(Locale.ROOT);
        }

        GuessResult guess(String input) {
            if (isFinished()) return GuessResult.FINISHED;
            if (input == null || !input.trim().matches("[a-zA-Z]")) {
                return GuessResult.INVALID;
            }
            char letter = input.trim().toLowerCase(Locale.ROOT).charAt(0);
            if (!guesses.add(letter)) return GuessResult.REPEATED;
            if (word.indexOf(letter) >= 0) return GuessResult.CORRECT;
            mistakes++;
            return GuessResult.WRONG;
        }

        String maskedWord() {
            StringBuilder visible = new StringBuilder();
            for (char letter : word.toCharArray()) {
                if (visible.length() > 0) visible.append(' ');
                visible.append(guesses.contains(letter) ? letter : '_');
            }
            return visible.toString();
        }

        String guessedLetters() {
            if (guesses.isEmpty()) return "(none)";
            StringBuilder result = new StringBuilder();
            for (char letter : guesses) {
                if (result.length() > 0) result.append(", ");
                result.append(letter);
            }
            return result.toString();
        }

        boolean isWon() {
            for (char letter : word.toCharArray()) {
                if (!guesses.contains(letter)) return false;
            }
            return true;
        }

        boolean isFinished() { return isWon() || mistakes == 6; }
        int remaining() { return 6 - mistakes; }
    }

    public static void main(String[] args) {
        play(new Scanner(System.in), System.out, new Random());
    }

    static void play(Scanner input, PrintStream output, Random random) {
        output.println("HANGMAN - Java Console Edition");
        output.println("Category: programming. Guess one letter at a time.");
        output.println("You have 6 wrong guesses. Repeated or invalid guesses cost nothing.");
        output.println("Type :quit at any prompt to leave.");
        while (true) {
            Round round = new Round(WORDS[random.nextInt(WORDS.length)]);
            while (!round.isFinished()) {
                output.println();
                output.println(DRAWINGS[6 - round.remaining()]);
                output.println("Word: " + round.maskedWord());
                output.println("Guessed: " + round.guessedLetters());
                output.println("Wrong guesses left: " + round.remaining());
                output.print("Your letter: ");
                if (!input.hasNextLine()) {
                    output.println("\nGoodbye!");
                    return;
                }
                String guess = input.nextLine().trim();
                if (guess.equalsIgnoreCase(":quit")) {
                    output.println("Goodbye!");
                    return;
                }
                switch (round.guess(guess)) {
                    case CORRECT -> output.println("Good guess!");
                    case WRONG -> output.println("That letter is not in the word.");
                    case REPEATED -> output.println("You already tried that letter.");
                    case INVALID -> output.println("Enter exactly one letter from A to Z.");
                    default -> { }
                }
            }
            output.println(DRAWINGS[6 - round.remaining()]);
            output.println(round.isWon() ? "You won! The word was " + round.word + "."
                : "No guesses left. The word was " + round.word + ".");
            while (true) {
                output.print("Play again? (y/n): ");
                if (!input.hasNextLine()) { output.println("\nGoodbye!"); return; }
                String answer = input.nextLine().trim();
                if (answer.equalsIgnoreCase("y")) break;
                if (answer.equalsIgnoreCase("n") || answer.equalsIgnoreCase(":quit")) {
                    output.println("Thanks for playing!");
                    return;
                }
                output.println("Please enter y or n.");
            }
        }
    }
}
