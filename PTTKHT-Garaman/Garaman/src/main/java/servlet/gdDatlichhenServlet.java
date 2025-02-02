package servlet;

import dao.Lichhen248DAO;
import model.Khachhang248;
import model.Lichhen248;
import model.Thanhvien248;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

@WebServlet("/datlichhen")
public class gdDatlichhenServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/view/kh/gdDatlichhen.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
            Timestamp thoigian = new Timestamp(sdf.parse(req.getParameter("thoigian")).getTime());
            Lichhen248 lichhen248 = new Lichhen248();
            lichhen248.setKhachhang248id(((Thanhvien248) req.getSession().getAttribute("user")).getId());
            lichhen248.setTen(req.getParameter("ten"));
            lichhen248.setDt(req.getParameter("dt"));
            lichhen248.setThoigian(thoigian);
            lichhen248.setTrangthai(0);
            Lichhen248DAO.instance().createOne(lichhen248);
            req.setAttribute("success", true);
            req.getRequestDispatcher("/view/kh/gdDatlichhen.jsp").forward(req, resp);
        } catch (Exception e) {
            e.printStackTrace();
            req.setAttribute("success", false);
            req.getRequestDispatcher("/view/kh/gdDatlichhen.jsp").forward(req, resp);
        }
    }
}
