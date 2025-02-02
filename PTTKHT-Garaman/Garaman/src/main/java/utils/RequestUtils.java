package utils;

import com.google.gson.Gson;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

public class RequestUtils {
    public static <T> T convertBodyToObject(HttpServletRequest req, Class<T> t) {
        Map<String, String> body = new HashMap<>();
        req.getParameterMap().forEach((key, value) -> {
            body.put(key, value[0]);
        });
        Gson gson = new Gson();
        String jsonBody = gson.toJson(body);
        return gson.fromJson(jsonBody, t);
    }
}
