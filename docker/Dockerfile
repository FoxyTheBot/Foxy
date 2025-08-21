FROM eclipse-temurin:24-jdk

ARG BUILD_NUMBER
ARG COMMIT_HASH

ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV COMMIT_HASH=${COMMIT_HASH}

WORKDIR /app

COPY foxy/build/libs/Foxy-*.jar Foxy.jar

ENV JAVA_OPTS="-Xms1G -Xmx3G"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar Foxy.jar"]