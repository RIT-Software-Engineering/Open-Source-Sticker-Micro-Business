ARG JAVA_VERSION=25

# STAGE 1: build the jar with the full JDK
FROM eclipse-temurin:${JAVA_VERSION}-jdk AS build
WORKDIR /app

# Download dependencies and cache them until pom.xml changes.
# This will result in a slow first-run of docker,
# but will be faster for later builds.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN sh mvnw -B dependency:go-offline

# Compile the source code
COPY src/ src/
# Tests and the Spotless format check run locally and in CI, NOT in Docker.
# (Spotless can't read git's line-ending settings inside the container,
# so it would wrongly flag CRLF files.)
RUN sh mvnw -B package -DskipTests -Dspotless.check.skip=true

# STAGE 2: run the jar with JRE
FROM eclipse-temurin:${JAVA_VERSION}-jre
WORKDIR /app

# Run as non-root user
RUN useradd --system spring
USER spring
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
