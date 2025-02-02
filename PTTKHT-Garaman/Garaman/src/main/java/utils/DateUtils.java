package utils;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {
    public static Timestamp convertDateStringToTimeStamp(String dateString) {
        Timestamp timestamp = new Timestamp(new Date().getTime());
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss.SSS");
            Date parsedDate = dateFormat.parse(dateString);
            timestamp = new Timestamp(parsedDate.getTime());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return timestamp;
    }

    public static Timestamp getStartTimeOfCurrentDay() {
        long time = -1;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
            time = dateFormat.parse(dateFormat.format(new Date())).getTime();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return time == -1 ? new Timestamp(new Date().getTime()) : new Timestamp(time);
    }

    public static Timestamp getCurrentTime() {
        return new Timestamp(new Date().getTime());
    }

    public static Timestamp getRandomTime(long start, long end) {
        long diff = end - start + 1;
        Timestamp rand = new Timestamp(start + (long) (Math.random() * diff));
        return rand;
    }
}
