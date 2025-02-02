package dao;

import java.sql.Connection;
import java.sql.DriverManager;

public class Database {
    static Database shared = null;
    Connection conn = null;

    Database() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/garaman", "root", "");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static Database instance() {
        if (shared == null) {
            shared = new Database();
        }
        return shared;
    }
}
