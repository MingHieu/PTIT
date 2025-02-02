<%@ page import="java.util.Map" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.HashMap" %>
<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%
    ArrayList<Map<String, String>> statisticRoutes = new ArrayList<>();
    statisticRoutes.add(new HashMap<String, String>() {{
        put("uri", "/doanhthuphutung");
        put("title", "Thống kê doanh thu phụ tùng");
    }});
    statisticRoutes.add(new HashMap<String, String>() {{
        put("uri", "/doanhthudichvu");
        put("title", "Thống kê doanh thu dịch vụ");
    }});

    request.setAttribute("statisticRoutes", statisticRoutes);
%>

<t:main title="Xem thống kê" role="QL">
    <jsp:body>
        <div>
            <c:forEach var="i" begin="0" end="${statisticRoutes.size() - 1}">
                <div class="mx-auto my-10 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${statisticRoutes.get(i).get("title")}</h5>
                    <a href="${statisticRoutes.get(i).get("uri")}"
                       class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Xem
                        <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </a>
                </div>
            </c:forEach>
        </div>
    </jsp:body>
</t:main>



