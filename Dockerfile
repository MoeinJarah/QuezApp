# Base image با JDK 17
FROM eclipse-temurin:17-jdk-alpine

# مسیر کاری در کانتینر
WORKDIR /app

# Copy فایل JAR به داخل کانتینر
COPY target/quezApplication-0.0.1-SNAPSHOT.jar quezapp.jar

# پورت اپلیکیشن
EXPOSE 8080 5005

# دستور اجرای برنامه
ENTRYPOINT ["java","-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-jar", "quezapp.jar"]
