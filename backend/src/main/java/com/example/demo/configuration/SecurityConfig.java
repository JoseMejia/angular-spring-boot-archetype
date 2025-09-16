package com.example.demo.configuration;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.*;
import org.springframework.security.web.header.HeaderWriterFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.function.Supplier;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    private final AppProperties appProperties;

    public SecurityConfig(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf((csrf) -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
                )
                .addFilterBefore(new NonceFilter(), HeaderWriterFilter.class)
                .headers(headers ->
                        headers
                                .xssProtection(
                                        xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK)
                                )
                                .referrerPolicy(
                                        (referrerPolicy ->
                                                referrerPolicy
                                                        .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.SAME_ORIGIN)
                                        )
                                )

                )
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/login-form/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(httpSecurityFormLoginConfigurer ->
                        httpSecurityFormLoginConfigurer
                                .loginProcessingUrl("/login")
                                .loginPage("/login-form/index.html")
                                .successHandler((request, response, authentication) -> log.debug("Authentication success"))
                                .failureHandler((request, response, exception) -> log.error(exception.getMessage(), exception))

                )
        .formLogin(Customizer.withDefaults())
                .logout((httpSecurityLogoutConfigurer ->
                        httpSecurityLogoutConfigurer.deleteCookies("CSP-NONCE", "JSESSIONID", "XSRF-TOKEN")))


        ;

        return http.build();
    }

    @Bean
    public UserDetailsManager userDetailsService() {
        User.UserBuilder builder = User.builder();
        List<UserDetails> users = appProperties.getUsers().stream()
                .map(client -> builder.username(client.name())
                        .password(client.password())
                        .roles(client.roles().toArray(String[]::new)).build())
                .toList();
        return new InMemoryUserDetailsManager(users);
    }

    final class SpaCsrfTokenRequestHandler implements CsrfTokenRequestHandler {
        private final CsrfTokenRequestHandler plain = new CsrfTokenRequestAttributeHandler();
        private final CsrfTokenRequestHandler xor = new XorCsrfTokenRequestAttributeHandler();

        @Override
        public void handle(HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
            /*
             * Always use XorCsrfTokenRequestAttributeHandler to provide BREACH protection of
             * the CsrfToken when it is rendered in the response body.
             */
            this.xor.handle(request, response, csrfToken);
            /*
             * Render the token value to a cookie by causing the deferred token to be loaded.
             */
            csrfToken.get();
        }

        @Override
        public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
            String headerValue = request.getHeader(csrfToken.getHeaderName());
            /*
             * If the request contains a request header, use CsrfTokenRequestAttributeHandler
             * to resolve the CsrfToken. This applies when a single-page application includes
             * the header value automatically, which was obtained via a cookie containing the
             * raw CsrfToken.
             *
             * In all other cases (e.g. if the request contains a request parameter), use
             * XorCsrfTokenRequestAttributeHandler to resolve the CsrfToken. This applies
             * when a server-side rendered form includes the _csrf request parameter as a
             * hidden input.
             */
            return (StringUtils.hasText(headerValue) ? this.plain : this.xor).resolveCsrfTokenValue(request, csrfToken);
        }
    }

}
