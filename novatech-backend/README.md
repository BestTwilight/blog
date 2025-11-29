# NovaTech Blog Backend

Spring Boot backend for NovaTech Blog CMS.

## Tech Stack
- Java 17
- Spring Boot 3.2.0
- Spring Security 6 (JWT Authentication)
- Spring Data JPA
- H2 Database (In-Memory)
- Lombok

## Quick Start

### Prerequisites
- JDK 17 or higher
- Maven 3.6+

### Run the Application

```bash
# Clone and navigate to project
cd novatech-backend

# Build and run
mvn clean install
mvn spring-boot:run
```

Server will start on `http://localhost:8080`

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)

### Posts (Public Read, Admin Write)
- `GET /api/posts` - Get all posts
- `GET /api/posts/{slug}` - Get post by slug
- `POST /api/posts` - Create post (Admin only)
- `PUT /api/posts/{id}` - Update post (Admin only)
- `DELETE /api/posts/{id}` - Delete post (Admin only)

### Database Console
- H2 Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:blogdb`
  - Username: `sa`
  - Password: (leave empty)

## Sample API Usage

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```

### Get All Posts
```bash
curl http://localhost:8080/api/posts
```

### Create Post (with JWT)
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My New Post",
    "excerpt": "A brief summary",
    "content": "<p>Full content here</p>",
    "category": "Backend",
    "tags": ["Java", "Spring"],
    "readTime": "5 min"
  }'
```

## CORS Configuration
Allowed origins:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

## Database Schema

### Users Table
- `id` (BIGINT, PK)
- `username` (VARCHAR, UNIQUE)
- `password` (VARCHAR, BCrypt)
- `role` (VARCHAR - ADMIN/VISITOR)

### Posts Table
- `id` (BIGINT, PK)
- `slug` (VARCHAR, UNIQUE)
- `title` (VARCHAR)
- `excerpt` (VARCHAR)
- `content` (TEXT)
- `category` (VARCHAR)
- `read_time` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Post Tags Table
- `post_id` (BIGINT, FK)
- `tag` (VARCHAR)

## Switching to MySQL

Update `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blogdb
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: yourpassword
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

Add MySQL dependency to `pom.xml`:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

## Project Structure
```
src/main/java/com/novatech/blog/
├── config/          # DataInitializer, Security configs
├── controller/      # REST Controllers
├── dto/            # Data Transfer Objects
├── entity/         # JPA Entities
├── exception/      # Global exception handling
├── repository/     # JPA Repositories
├── security/       # JWT, Filters, SecurityConfig
└── service/        # Business logic
```

## License
MIT
