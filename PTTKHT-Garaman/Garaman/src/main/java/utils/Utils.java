package utils;

import java.util.concurrent.ThreadLocalRandom;

public class Utils {
    public static int getRandInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}
