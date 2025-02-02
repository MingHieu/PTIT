<%@ page contentType="text/html;charset=UTF-8" isELIgnored="false" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<c:set var="role" value="${param.get('role')}"/>

<c:choose>
    <c:when test="${role == 'KH'}">
        <jsp:include page="userHeader.jsp"/>
    </c:when>

    <c:when test="${role == 'QL'}">
        <jsp:include page="adminHeader.jsp"/>
    </c:when>

    <c:otherwise>
        <jsp:include page="userHeader.jsp"/>
    </c:otherwise>
</c:choose>