import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.Random;
import java.util.Scanner;

public class HangmanTest {
    private static int checks;
    private static void check(boolean condition, String message) {
        checks++;
        if (!condition) throw new AssertionError(message);
    }
    private static String session(String input) {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        Random fixed = new Random() {
            @Override public int nextInt(int bound) { return 0; } // "java"
        };
        Hangman.play(new Scanner(input), new PrintStream(buffer), fixed);
        return buffer.toString();
    }
    public static void main(String[] args) {
        Hangman.Round game = new Hangman.Round("Java");
        check(game.maskedWord().equals("_ _ _ _"), "Initially hidden");
        check(game.remaining() == 6, "Six wrong guesses");
        check(game.guess(" A ") == Hangman.GuessResult.CORRECT, "Case and whitespace");
        check(game.maskedWord().equals("_ a _ a"), "All repeated letters revealed");
        check(game.guess("a") == Hangman.GuessResult.REPEATED, "Repeated correct guess");
        check(game.remaining() == 6, "Repeat costs nothing");
        check(game.guess("x") == Hangman.GuessResult.WRONG, "Wrong guess");
        check(game.remaining() == 5, "One mistake deducted");
        check(game.guess("X") == Hangman.GuessResult.REPEATED, "Repeated wrong guess");
        for (String invalid : new String[]{"", " ", "12", "ab", "!", "1", null}) {
            check(game.guess(invalid) == Hangman.GuessResult.INVALID, "Invalid rejected");
        }
        check(game.remaining() == 5, "Invalid costs nothing");
        game.guess("j"); game.guess("v");
        check(game.isWon() && game.isFinished(), "Win state");
        check(game.guess("z") == Hangman.GuessResult.FINISHED, "Finished state immutable");
        Hangman.Round lose = new Hangman.Round("java");
        for (char letter : "bcdefg".toCharArray()) lose.guess(String.valueOf(letter));
        check(lose.remaining() == 0 && lose.isFinished() && !lose.isWon(), "Loss state");
        check(lose.guess("h") == Hangman.GuessResult.FINISHED && lose.remaining() == 0, "No negative lives");
        boolean rejected = false;
        try { new Hangman.Round(""); } catch (IllegalArgumentException e) { rejected = true; }
        check(rejected, "Empty word rejected");
        check(session("j\na\nv\nn\n").contains("You won! The word was java."), "Console win");
        check(session("b\nc\nd\ne\nf\ng\nn\n").contains("No guesses left. The word was java."), "Console loss");
        check(session("").contains("Goodbye!"), "EOF at guess");
        check(session(":quit\n").contains("Goodbye!"), "Quit command");
        check(session("j\na\nv\n").contains("Goodbye!"), "EOF at replay");
        check(session("j\na\nv\nmaybe\nn\n").contains("Please enter y or n."), "Replay validation");
        String replay = session("j\na\nv\ny\nj\na\nv\nn\n");
        check(replay.split("You won!", -1).length == 3, "Two complete rounds");
        System.out.println("PASS: " + checks + " checks.");
    }
}
