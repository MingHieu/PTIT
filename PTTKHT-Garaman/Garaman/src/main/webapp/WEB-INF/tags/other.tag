<%@tag description="Other Page template" pageEncoding="UTF-8" %>
<%@attribute name="title" type="java.lang.String" %>

<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%=title%></title>
    <script src="/js/tailwind.js"></script>
    <script src="/js/tailwind.config.js"></script>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
<div id="main">
    <jsp:doBody/>
</div>
</body>
</html>

