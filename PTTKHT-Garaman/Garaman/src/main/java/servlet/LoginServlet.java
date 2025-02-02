package servlet;

import dao.Khachhang248DAO;
import dao.Nhanvien248DAO;
import dao.Thanhvien248DAO;
import model.Khachhang248;
import model.Nhanvien248;
import model.Thanhvien248;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/view/login.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("taikhoan");
        String password = req.getParameter("matkhau");
        Thanhvien248 user = Thanhvien248DAO.instance().findOne(username);
        if (user != null && user.getMatkhau().equals(password)) {
            req.getSession().setAttribute("user", user);
            Khachhang248 kh = Khachhang248DAO.instance().findOne(user);
            Nhanvien248 nv = Nhanvien248DAO.instance().findOne(user);
            if (kh != null) {
                resp.sendRedirect("/");
            }
            if (nv != null) {
                resp.sendRedirect("/quanli");
            }
        } else {
            req.setAttribute("error", "Tài khoản hoặc mật khẩu sai");
            req.getRequestDispatcher("/view/login.jsp").forward(req, resp);
        }
    }
}
