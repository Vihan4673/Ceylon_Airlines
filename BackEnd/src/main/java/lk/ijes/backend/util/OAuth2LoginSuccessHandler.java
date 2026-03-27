package lk.ijes.backend.util;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.ijes.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        String token = authService.handleGoogleUser(email, name);


        //     String targetUrl = "http://localhost:63342/Ceylon%20Airlines/FrontEnd/Web/Pages/HomePage.html#token=" + token;
        //      getRedirectStrategy().sendRedirect(request, response, targetUrl);

        String encodedToken = java.net.URLEncoder.encode(token, "UTF-8");
        String targetUrl = "http://127.0.0.1:5500/FrontEnd/Web/Pages/HomePage.html#token=" + encodedToken;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}