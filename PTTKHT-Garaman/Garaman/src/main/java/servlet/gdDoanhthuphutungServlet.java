package servlet;

import dao.Phutung248DAO;
import response.DoanhthuRes;
import utils.DateUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Timestamp;


@WebServlet("/doanhthuphutung")

public class gdDoanhthuphutungServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pageReq = req.getParameter("page");
        String fromReq = req.getParameter("from");
        String toReq = req.getParameter("to");
        int pageNumber = pageReq != null ? Integer.parseInt(pageReq) : 1;
        Timestamp from = fromReq != null ? new Timestamp(Long.parseLong(fromReq)) : DateUtils.getStartTimeOfCurrentDay();
        Timestamp to = toReq != null ? new Timestamp(Long.parseLong(toReq)) : DateUtils.getCurrentTime();

        DoanhthuRes doanhthuRes = Phutung248DAO.instance().getDoanhThu(pageNumber, from, to);
        doanhthuRes.setPageNumber(pageNumber);

        req.setAttribute("doanhthuRes", doanhthuRes);
        req.getRequestDispatcher("/view/ql/gdDoanhthuphutung.jsp").forward(req, resp);
    }
}