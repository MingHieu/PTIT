package seeder;

import dao.DichvuHoadon248DAO;
import model.DichvuHoadon248;
import utils.Utils;

public class DichvuHoadon248Seeder {
    public static void run(long hoadon248id) {
        DichvuHoadon248 dichvuHoadon248 = new DichvuHoadon248();
        dichvuHoadon248.setHoadon248id(hoadon248id);
        dichvuHoadon248.setDichvu248id(Utils.getRandInt(1, 35));
        dichvuHoadon248.setSoluong(Utils.getRandInt(1, 5));
        DichvuHoadon248DAO.instance().createOne(dichvuHoadon248);
    }
}
