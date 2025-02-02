package filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebFilter(urlPatterns = "*")
public class AuthFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpSession session = request.getSession(false);

        boolean isLogin = session != null && session.getAttribute("user") != null;

        if (isLogin || excludePages(request)) {
            filterChain.doFilter(request, response); // User is logged in, just continue request.
        } else {
            response.sendRedirect(request.getContextPath() + "/login"); // Not logged in, show login page.
        }
    }

    public boolean excludePages(HttpServletRequest req) {
        String requestURI = req.getRequestURI();

        String[] publicFolders = {"/js", "/css", "/image"};
        for (String folder : publicFolders) {
            if (requestURI.startsWith(folder)) {
                return true;
            }
        }

        String[] pages = {"/register", "/login", "/"};
        for (String page : pages) {
            if (requestURI.equals(req.getContextPath() + page)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void destroy() {
        Filter.super.destroy();
    }
}
