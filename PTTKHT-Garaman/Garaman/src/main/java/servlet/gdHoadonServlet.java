package servlet;

import dao.Hoadon248DAO;
import response.HoadonRes;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@WebServlet("/hoadon")

public class gdHoadonServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String idReq = req.getParameter("id");
        long id = idReq != null ? Long.parseLong(idReq) : 1;
        HoadonRes hoadonRes = Hoadon248DAO.instance().findOne(id);
        req.setAttribute("hoadonRes", hoadonRes);
        req.getRequestDispatcher("/view/ql/gdHoadon.jsp").forward(req, resp);
    }
}