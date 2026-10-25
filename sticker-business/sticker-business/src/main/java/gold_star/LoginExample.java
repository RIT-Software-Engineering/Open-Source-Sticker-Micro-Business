
import java.util.Scanner;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

public class LoginExample {
    static Argon2PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    static Scanner scan = Scanner(System.in);

    static String password = "default";
    static String pepper = "totally-secure-secretPepper"; // in a real app, this would NEVER be stored somewhere visible

    private static void setPassword() {
        System.out.println("Set the password:");
        String input = scan.nextLine();
        password = encoder.encode(pepper + input);
        // Spring Security handles the salt for us, so in reality it is like (pepper + input + salt) is hashed
    }

    public static void main(String[] args) {
        setPassword();
        System.out.println("Try to log in: ");
        String input = scan.nextLine(); // take input again
        if(encoder.matches(input, password)) {
            System.out.println("Correct!");
        } else {
            System.out.println("Incorrect password");
        }

        System.out.println("What the database stores:");
        System.out.println(password);
    }
    
}
