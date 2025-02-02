package dao;

import model.NVKithuatHoadon248;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class NVKithuatHoadon248DAO {
    static NVKithuatHoadon248DAO shared = null;

    public static NVKithuatHoadon248DAO instance() {
        if (shared == null) {
            shared = new NVKithuatHoadon248DAO();
        }
        return shared;
    }

    public int createOne(NVKithuatHoadon248 nvKithuatHoadon248) {
        String sql = "insert into NVKithuatHoadon248" + " (NVKithuat248id, Hoadon248id) values " + "(?, ?);";
        int result = 0;

        try {
            Connection conn = Database.instance().conn;
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setLong(1, nvKithuatHoadon248.getNhanvien248id());
            ps.setLong(2, nvKithuatHoadon248.getHoadon248id());
            result = ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }
}
