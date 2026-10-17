FROM node:22-alpine AS frontend-build

WORKDIR /workspace
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM maven:3.9-eclipse-temurin-21-alpine AS backend-build

WORKDIR /workspace
COPY pom.xml ./
COPY src/main/java ./src/main/java
COPY src/main/resources ./src/main/resources
COPY --from=frontend-build /workspace/dist/ ./src/main/resources/static/
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine AS runtime

RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=backend-build /workspace/target/aidx-1.0.0.jar ./app.jar
USER app

EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
