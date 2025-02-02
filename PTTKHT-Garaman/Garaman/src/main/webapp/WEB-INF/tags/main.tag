<%@tag description="Main Page template" pageEncoding="UTF-8" isELIgnored="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@attribute name="title" type="java.lang.String" %>
<%@attribute name="role" type="java.lang.String" %>
<%@attribute name="js" type="java.lang.String"%>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%=title%></title>
    <script src="/js/tailwind.js"></script>
    <script src="/js/tailwind.config.js"></script>
    <script src="/js/datepicker.js"></script>
    <link rel="stylesheet" href="/css/toastify.css">
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
<jsp:include page="../../partials/header.jsp">
    <jsp:param name="role" value="${role}"/>
</jsp:include>
<div id="main">
    <jsp:doBody/>
</div>
<jsp:include page="../../partials/footer.jsp"/>
<script src="/js/toastify.js"></script>
<script src="/js/main.js"></script>
<c:if test="${js != null}">
    <script src="${js}"></script>
</c:if>
</body>
</html>