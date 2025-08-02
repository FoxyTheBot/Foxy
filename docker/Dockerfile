FROM eclipse-temurin:24-jdk

WORKDIR /app

COPY foxy/build/libs/Foxy-*.jar Foxy.jar

ENV JAVA_OPTS="-Xms2G -Xmx4G"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar Foxy.jar"]