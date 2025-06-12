FROM eclipse-temurin:17-jdk-alpine

WORKDIR /quezApp

COPY target/quezApplication-0.0.1-SNAPSHOT.jar quezApp.jar

EXPOSE 8080

ENTRYPOINT ["java" , "-jar" , "quezApp.jar"]