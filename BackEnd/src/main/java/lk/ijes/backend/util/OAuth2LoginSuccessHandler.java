package lk.ijes.backend.util;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.ijes.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
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
        String picture = oAuth2User.getAttribute("picture");

        // handleGoogleUser eka athule User wa DB save karala JWT hadanna ona
        Map<String, String> authData = authService.handleGoogleUser(email, name, picture);

        String token = authData.get("token");
        String profilePic = authData.get("picture");
        String role = authData.get("role");

        // URL Parameters widiyata token eka yawima (LoginPage.html ekata)
        String targetUrl = "http://127.0.0.1:5500/FrontEnd/Web/Pages/LoginPage.html?token="
                + URLEncoder.encode(token, StandardCharsets.UTF_8)
                + "&picture=" + URLEncoder.encode(profilePic != null ? profilePic : "", StandardCharsets.UTF_8)
                + "&role=" + URLEncoder.encode(role, StandardCharsets.UTF_8);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}