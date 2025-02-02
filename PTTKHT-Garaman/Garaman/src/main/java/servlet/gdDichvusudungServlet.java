package servlet;

import dao.DichvuHoadon248DAO;
import response.DichvuHoadon248Res;
import response.DichvuHoadonRes;
import utils.DateUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;


@WebServlet("/dichvusudung")

public class gdDichvusudungServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String idReq = req.getParameter("id");
        String pageReq = req.getParameter("page");
        String fromReq = req.getParameter("from");
        String toReq = req.getParameter("to");
        long id = idReq != null ? Long.parseLong(idReq) : 1;
        int pageNumber = pageReq != null ? Integer.parseInt(pageReq) : 1;
        Timestamp from = fromReq != null ? new Timestamp(Long.parseLong(fromReq)) : DateUtils.getStartTimeOfCurrentDay();
        Timestamp to = toReq != null ? new Timestamp(Long.parseLong(toReq)) : DateUtils.getCurrentTime();
        int pageSize = 10;

        List<DichvuHoadon248Res> dichvuHoadon248List = DichvuHoadon248DAO.instance().findMany(id, from, to, pageNumber);
        DichvuHoadonRes dichvuHoadonRes = new DichvuHoadonRes();
        dichvuHoadonRes.setDichvuHoadon248List(dichvuHoadon248List);
        dichvuHoadonRes.setPageNumber(pageNumber);
        dichvuHoadonRes.setEnd(dichvuHoadon248List.size() < pageSize);

        req.setAttribute("dichvuHoadonRes", dichvuHoadonRes);
        req.getRequestDispatcher("/view/ql/gdDichvusudung.jsp").forward(req, resp);
    }
}