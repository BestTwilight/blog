package com.novatech.blog.config;

import com.novatech.blog.entity.Post;
import com.novatech.blog.entity.Role;
import com.novatech.blog.entity.User;
import com.novatech.blog.repository.PostRepository;
import com.novatech.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        initializeUsers();
        initializePosts();
    }
    
    private void initializeUsers() {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            
            userRepository.save(admin);
            log.info("✅ Default admin user created: username='admin', password='admin123'");
        }
    }
    
    private void initializePosts() {
        if (postRepository.count() == 0) {
            Post post1 = Post.builder()
                    .slug("welcome-to-novatech")
                    .title("Architecting the Future: Why I Built NovaTech")
                    .excerpt("A deep dive into the tech stack behind this blog, featuring React 19, Tailwind CSS, and Gemini AI integration.")
                    .category("Frontend")
                    .readTime("5 min")
                    .tags(List.of("React", "Architecture", "Design"))
                    .content("""
                        <div class="space-y-6">
                          <p class="lead text-xl text-slate-300">
                            Building a personal blog in 2024 isn't just about putting text on a screen. It's about creating an 
                            <span class="text-cyan-400">experience</span>. In this post, I'll break down the architectural decisions behind NovaTech.
                          </p>
                        
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">The Stack</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li><strong>React 19:</strong> Leveraging concurrent features for smooth transitions.</li>
                            <li><strong>Tailwind CSS:</strong> For rapid, atomic styling and dark mode handling.</li>
                            <li><strong>Framer Motion:</strong> The engine behind the fluid animations and glassmorphism effects.</li>
                            <li><strong>Gemini API:</strong> Acting as a dynamic content generator for experimental posts.</li>
                          </ul>
                        
                          <h3 class="text-xl font-bold text-cyan-400 mt-8 mb-4">Why No Database Initially?</h3>
                          <p>
                            You might notice this blog feels incredibly fast. That's because, initially, it's serverless in the truest sense. 
                            Content is either statically defined (like this post) or generated on-the-fly by AI. This hybrid approach allows for 
                            zero-latency navigation while keeping the content feeling "alive".
                          </p>
                        
                          <div class="bg-slate-900/50 border-l-4 border-purple-500 p-4 my-6 rounded-r-lg">
                            <p class="italic text-slate-300">
                              "The best code is no code. The second best code is code that writes itself."
                            </p>
                          </div>
                        
                          <p>
                            Stay tuned as I continue to iterate on this platform, adding real-time backend integrations and more complex 
                            AI agents to help curate content.
                          </p>
                        </div>
                        """)
                    .build();
            
            Post post2 = Post.builder()
                    .slug("understanding-react-server-components")
                    .title("Understanding React Server Components")
                    .excerpt("RSC is shifting the paradigm of frontend development. Here is what you need to know.")
                    .category("Frontend")
                    .readTime("7 min")
                    .tags(List.of("React", "RSC", "Next.js"))
                    .content("""
                        <div class="space-y-6">
                          <p class="text-lg text-slate-300">
                            React Server Components (RSC) represent a fundamental shift in how we think about building React applications.
                            This new paradigm allows components to run on the server, reducing the JavaScript bundle size and improving performance.
                          </p>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Key Benefits</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Zero bundle size for server components</li>
                            <li>Direct access to backend resources</li>
                            <li>Automatic code splitting</li>
                            <li>Improved SEO and initial page load</li>
                          </ul>
                          
                          <p class="text-slate-300 mt-6">
                            The system will auto-complete more technical details soon as we explore this technology further.
                          </p>
                        </div>
                        """)
                    .build();
            
            postRepository.saveAll(List.of(post1, post2,
                    createBackendArchitecturePost(),
                    createDevOpsPost(),
                    createAIPost(),
                    createDesignPatternsPost(),
                    createPerformancePost(),
                    createSecurityPost()
            ));
            log.info("✅ Sample posts created");
        }
    }
    
    private Post createBackendArchitecturePost() {
        return Post.builder()
                .slug("spring-boot-architecture-best-practices")
                .title("Spring Boot Architecture: Best Practices for 2024")
                .excerpt("Designing scalable and maintainable Spring Boot applications using layered architecture, dependency injection, and clean code principles.")
                .category("Backend")
                .readTime("8 min")
                .tags(List.of("Spring Boot", "Java", "Architecture", "Best Practices"))
                .content("""
                        <div class="space-y-6">
                          <p class="text-lg text-slate-300">
                            Spring Boot has revolutionized Java development by simplifying configuration and deployment. 
                            In this comprehensive guide, we'll explore architectural patterns that make Spring Boot applications 
                            scalable, testable, and maintainable.
                          </p>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Layered Architecture Pattern</h2>
                          <p class="text-slate-400">
                            The traditional layered architecture divides an application into distinct layers:
                          </p>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li><strong>Controller Layer:</strong> Handles HTTP requests and responses</li>
                            <li><strong>Service Layer:</strong> Contains business logic and orchestration</li>
                            <li><strong>Repository Layer:</strong> Manages data persistence and database access</li>
                            <li><strong>Entity Layer:</strong> Represents domain objects and database models</li>
                          </ul>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Dependency Injection Benefits</h2>
                          <p class="text-slate-300">
                            Spring's dependency injection container enables loose coupling, easier testing, and better code reusability. 
                            Using constructor injection ensures that dependencies are immutable and required.
                          </p>
                          
                          <div class="bg-slate-900/50 border-l-4 border-green-500 p-4 my-6 rounded-r-lg">
                            <p class="italic text-slate-300">
                              "Well-structured code is easier to test, maintain, and extend. Invest in architecture early."
                            </p>
                          </div>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Key Takeaways</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Use dependency injection for better testability</li>
                            <li>Separate concerns across layers</li>
                            <li>Implement proper error handling and logging</li>
                            <li>Follow SOLID principles in your design</li>
                          </ul>
                        </div>
                        """)
                .build();
    }
    
    private Post createDevOpsPost() {
        return Post.builder()
                .slug("containerization-with-docker-kubernetes")
                .title("Containerization Journey: Docker and Kubernetes")
                .excerpt("From development to production: deploying applications using Docker containers and orchestrating them with Kubernetes.")
                .category("DevOps")
                .readTime("10 min")
                .tags(List.of("Docker", "Kubernetes", "DevOps", "Cloud"))
                .content("""
                        <div class="space-y-6">
                          <p class="text-lg text-slate-300">
                            Containerization has become the de facto standard for application deployment. Learn how to containerize your applications 
                            and orchestrate them at scale using Kubernetes.
                          </p>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Docker Fundamentals</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Images: Immutable snapshots of your application</li>
                            <li>Containers: Running instances of images</li>
                            <li>Registries: Centralized storage for images</li>
                            <li>Networks: Inter-container communication</li>
                          </ul>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Kubernetes Orchestration</h2>
                          <p class="text-slate-300">
                            Kubernetes automates deployment, scaling, and management of containerized applications across clusters.
                          </p>
                          
                          <div class="bg-slate-900/50 border-l-4 border-orange-500 p-4 my-6 rounded-r-lg">
                            <p class="italic text-slate-300">
                              "Container orchestration is not a luxury—it's essential for modern DevOps practices."
                            </p>
                          </div>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Deployment Pipeline</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Build Docker image</li>
                            <li>Push to container registry</li>
                            <li>Deploy to Kubernetes cluster</li>
                            <li>Monitor and scale automatically</li>
                          </ul>
                        </div>
                        """)
                .build();
    }
    
    private Post createAIPost() {
        return Post.builder()
                .slug("gemini-ai-integration-web-apps")
                .title("Integrating Gemini AI into Your Web Applications")
                .excerpt("Leverage Google's powerful Gemini API to add intelligent features to your applications with minimal effort.")
                .category("AI")
                .readTime("9 min")
                .tags(List.of("AI", "Gemini", "API", "Integration"))
                .content("""
                        <div class="space-y-6">
                          <p class="text-lg text-slate-300">
                            Artificial Intelligence is no longer a distant future technology—it's here and accessible. 
                            Gemini API makes it easy to integrate advanced AI capabilities into your applications.
                          </p>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Why Gemini?</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>State-of-the-art language model</li>
                            <li>Easy-to-use REST API</li>
                            <li>Affordable pricing tiers</li>
                            <li>Fast response times</li>
                            <li>Multimodal capabilities (text, images, code)</li>
                          </ul>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Use Cases</h2>
                          <p class="text-slate-300">
                            Gemini can power content generation, code completion, question answering, and much more.
                          </p>
                          
                          <div class="bg-slate-900/50 border-l-4 border-purple-500 p-4 my-6 rounded-r-lg">
                            <p class="italic text-slate-300">
                              "AI is not about replacing humans—it's about augmenting human creativity and productivity."
                            </p>
                          </div>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Getting Started</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Get API key from Google Cloud Console</li>
                            <li>Install Gemini SDK for your language</li>
                            <li>Make your first API call</li>
                            <li>Build amazing features!</li>
                          </ul>
                        </div>
                        """)
                .build();
    }
    
    private Post createDesignPatternsPost() {
        return Post.builder()
                .slug("design-patterns-in-modern-development")
                .title("Design Patterns: Building Better Code Architecture")
                .excerpt("Master essential design patterns that solve common software design problems and improve code quality.")
                .category("Backend")
                .readTime("11 min")
                .tags(List.of("Design Patterns", "Architecture", "Best Practices"))
                .content("""
                        <div class="space-y-6">
                          <p class="text-lg text-slate-300">
                            Design patterns are proven solutions to common problems in software design. 
                            Understanding and applying them can significantly improve code quality and maintainability.
                          </p>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Creational Patterns</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li><strong>Singleton:</strong> Ensure a class has only one instance</li>
                            <li><strong>Factory:</strong> Create objects without specifying exact classes</li>
                            <li><strong>Builder:</strong> Construct complex objects step by step</li>
                          </ul>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Structural Patterns</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li><strong>Adapter:</strong> Make incompatible interfaces work together</li>
                            <li><strong>Decorator:</strong> Add new functionality to objects dynamically</li>
                            <li><strong>Facade:</strong> Provide simplified interface to complex subsystem</li>
                          </ul>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Behavioral Patterns</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li><strong>Observer:</strong> Define one-to-many object dependencies</li>
                            <li><strong>Strategy:</strong> Encapsulate interchangeable algorithms</li>
                            <li><strong>Command:</strong> Encapsulate requests as objects</li>
                          </ul>
                          
                          <div class="bg-slate-900/50 border-l-4 border-cyan-500 p-4 my-6 rounded-r-lg">
                            <p class="italic text-slate-300">
                              "Don't reinvent the wheel. Use proven design patterns to solve problems."
                            </p>
                          </div>
                        </div>
                        """)
                .build();
    }
    
    private Post createPerformancePost() {
        return Post.builder()
                .slug("web-performance-optimization-techniques")
                .title("Web Performance Optimization: A Complete Guide")
                .excerpt("Techniques to measure, analyze, and optimize your web application's performance for faster load times and better UX.")
                .category("Frontend")
                .readTime("12 min")
                .tags(List.of("Performance", "Optimization", "Frontend"))
                .content("""
                        <div class="space-y-6">
                          <p class="text-lg text-slate-300">
                            Performance is a feature, not an afterthought. Every second of delay costs you users. 
                            Learn essential techniques to optimize your web applications.
                          </p>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Core Web Vitals</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li><strong>LCP (Largest Contentful Paint):</strong> Load performance</li>
                            <li><strong>FID (First Input Delay):</strong> Interactivity</li>
                            <li><strong>CLS (Cumulative Layout Shift):</strong> Visual stability</li>
                          </ul>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Optimization Strategies</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Code splitting and lazy loading</li>
                            <li>Image optimization and responsive images</li>
                            <li>CSS and JavaScript minification</li>
                            <li>Caching strategies and CDN usage</li>
                            <li>Browser rendering optimization</li>
                          </ul>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Measurement Tools</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Google Lighthouse</li>
                            <li>Web Vitals API</li>
                            <li>Chrome DevTools</li>
                            <li>PageSpeed Insights</li>
                          </ul>
                          
                          <div class="bg-slate-900/50 border-l-4 border-cyan-500 p-4 my-6 rounded-r-lg">
                            <p class="italic text-slate-300">
                              "Fast websites are happy websites. Invest in performance optimization."
                            </p>
                          </div>
                        </div>
                        """)
                .build();
    }
    
    private Post createSecurityPost() {
        return Post.builder()
                .slug("security-best-practices-modern-web")
                .title("Security Best Practices for Modern Web Applications")
                .excerpt("Protect your users and data by implementing essential security measures and following industry best practices.")
                .category("Backend")
                .readTime("10 min")
                .tags(List.of("Security", "Best Practices", "Authentication"))
                .content("""
                        <div class="space-y-6">
                          <p class="text-lg text-slate-300">
                            Security is everyone's responsibility. In this post, we'll cover essential practices to secure your web applications 
                            against common vulnerabilities.
                          </p>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Authentication & Authorization</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Use strong password hashing (BCrypt, Argon2)</li>
                            <li>Implement JWT or OAuth2 for stateless auth</li>
                            <li>Enforce multi-factor authentication</li>
                            <li>Use HTTPS for all communications</li>
                          </ul>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Common Vulnerabilities</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li><strong>SQL Injection:</strong> Use parameterized queries</li>
                            <li><strong>XSS (Cross-Site Scripting):</strong> Sanitize user input</li>
                            <li><strong>CSRF (Cross-Site Request Forgery):</strong> Use CSRF tokens</li>
                            <li><strong>Rate Limiting:</strong> Prevent brute force attacks</li>
                          </ul>
                          
                          <h2 class="text-2xl font-bold text-white mt-8 mb-4">Data Protection</h2>
                          <ul class="list-disc list-inside space-y-2 text-slate-400 ml-4">
                            <li>Encrypt sensitive data at rest and in transit</li>
                            <li>Implement proper access controls</li>
                            <li>Regular security audits and penetration testing</li>
                            <li>Keep dependencies updated</li>
                          </ul>
                          
                          <div class="bg-slate-900/50 border-l-4 border-red-500 p-4 my-6 rounded-r-lg">
                            <p class="italic text-slate-300">
                              "Security is not a feature—it's a necessity. Build it into your application from day one."
                            </p>
                          </div>
                        </div>
                        """)
                .build();
    }
}