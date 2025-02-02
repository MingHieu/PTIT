package seeder;

import dao.PhutungHoadon248DAO;
import model.PhutungHoadon248;
import utils.Utils;

public class PhutungHoadon248Seeder {
    public static void run(long hoadon248id) {
        PhutungHoadon248 phutungHoadon248 = new PhutungHoadon248();
        phutungHoadon248.setHoadon248id(hoadon248id);
        phutungHoadon248.setPhutung248id(Utils.getRandInt(1, 44));
        phutungHoadon248.setSoluong(Utils.getRandInt(1, 5));
        PhutungHoadon248DAO.instance().createOne(phutungHoadon248);
    }
}
