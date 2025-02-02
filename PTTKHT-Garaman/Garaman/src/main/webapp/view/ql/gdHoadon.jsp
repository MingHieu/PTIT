<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<t:main title="Hoá đơn" role="QL">
    <jsp:body>
        <div class="max-w-md mx-auto mb-5">
            <a href="javascript:history.back()"
               class="flex items-center py-2 pr-4 pl-3 text-primary-700  lg:p-0 dark:text-white">
                <svg class="w-5 h-5 mr-2 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"/>
                </svg>
                <span>Quay lại</span>
            </a>
            <div class="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto my-8">
                <h1 class="font-bold text-2xl my-4 text-center text-blue-600">Garaman</h1>
                <hr class="mb-2">
                <div class="flex justify-between mb-6">
                    <h1 class="text-lg font-bold">Hoá đơn</h1>
                    <div class="text-gray-700">
                        <div>Thời gian: ${hoadonRes.getThoigian()}</div>
                        <div>Mã hoá đơn: HD${hoadonRes.getId()}</div>
                    </div>
                </div>
                <div class="mb-8">
                    <h2 class="text-lg font-bold mb-4">Khách hàng:</h2>
                    <div class="text-gray-700 mb-2">${hoadonRes.getKhachhang248().getTen()}</div>
                    <div class="text-gray-700 mb-2">${hoadonRes.getKhachhang248().getDiachi()}</div>
                    <div class="text-gray-700 mb-2">${hoadonRes.getKhachhang248().getEmail()}</div>
                    <div class="text-gray-700">0${hoadonRes.getKhachhang248().getDt()}</div>
                </div>
                <div class="mb-8">
                    <h2 class="text-lg font-bold mb-4">Nhân viên:</h2>
                    <div class="text-gray-700 mb-2">Nhân viên bán hàng: </div>
                    <div class="text-gray-700 mb-2">${hoadonRes.getNvBanhang248().getTen()} - BH${hoadonRes.getNvBanhang248().getId()}</div>
                    <div class="text-gray-700 mb-2">Nhân viên kĩ thuật:</div>
                    <c:if test="${hoadonRes.getNvKithuat248List().size() - 1 >= 0}">
                        <c:forEach var="i" begin="0" end="${hoadonRes.getNvKithuat248List().size() - 1}">
                            <div class="text-gray-700 mb-2">${hoadonRes.getNvKithuat248List().get(i).getTen()} - KT${hoadonRes.getNvKithuat248List().get(i).getId()}</div>
                        </c:forEach>
                    </c:if>
                </div>
                <table class="w-full mb-8">
                    <thead>
                    <tr>
                        <th class="text-left font-bold text-gray-700">Thông tin</th>
                        <th class="text-right font-bold text-gray-700">Giá</th>
                    </tr>
                    </thead>
                    <tbody>
                    <c:if test="${hoadonRes.getDichvu248List().size() - 1 >= 0}">
                        <c:forEach var="i" begin="0" end="${hoadonRes.getDichvu248List().size() - 1}">
                            <tr>
                                <td class="text-left text-gray-700">${hoadonRes.getDichvu248List().get(i).getTen()}
                                    x ${hoadonRes.getDichvu248List().get(i).getSoluong()}</td>
                                <td class="text-right text-gray-700">${hoadonRes.getDichvu248List().get(i).getGia() * hoadonRes.getDichvu248List().get(i).getSoluong()}</td>
                            </tr>
                        </c:forEach>
                    </c:if>

                    <c:if test="${hoadonRes.getPhutung248List().size() - 1 >= 0}">
                        <c:forEach var="i" begin="0" end="${hoadonRes.getPhutung248List().size() - 1}">
                            <tr>
                                <td class="text-left text-gray-700">${hoadonRes.getPhutung248List().get(i).getTen()}
                                    x ${hoadonRes.getPhutung248List().get(i).getSoluong()}</td>
                                <td class="text-right text-gray-700">${hoadonRes.getPhutung248List().get(i).getGia() * hoadonRes.getPhutung248List().get(i).getSoluong()}</td>
                            </tr>
                        </c:forEach>
                    </c:if>

                    </tbody>
                    <tfoot>
                    <tr>
                        <td class="text-left font-bold text-gray-700">Tổng tiền</td>
                        <td class="text-right font-bold text-gray-700">${hoadonRes.getTongtien()}</td>
                    </tr>
                    </tfoot>
                </table>

                <div class="text-gray-700 mb-2">Cảm ơn vì đã sử dụng dịch vụ!</div>
            </div>
        </div>
    </jsp:body>
</t:main>

