package lk.ijes.backend.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * CORS configuration for ALL endpoints
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 1. සියලුම endpoints (API ඇතුළුව) සඳහා අවසර දුන්නා
                .allowedOriginPatterns("*") // 2. credentials true නිසා patterns "*" ලෙස භාවිතා කිරීම වඩාත් ආරක්ෂිතයි
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * Static resource handler for uploaded files
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // user.dir එකෙන් uploads folder එක ගන්නවා
        String uploadPath = System.getProperty("user.dir") + "/uploads/";

        // ලිනක්ස් හෝ මැක් වලදී පාවිච්චි කරද්දී path එක නිවැරදිව ලැබීමට "/" අගට තිබිය යුතුයි
        if (!uploadPath.endsWith("/")) {
            uploadPath += "/";
        }

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath)
                .setCachePeriod(3600)
                .resourceChain(true)
                .addResolver(new PathResourceResolver());
    }
}