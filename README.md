This repository is intended to create an archetype
for the generation of a Spring Boot Application
with MVC and SPA preconfigured.

1. Create archetype from this project

        ./mvnw -U clean archetype:create-from-project \
              -Dinteractive=false \
              -DkeepParent=false \
              -DpropertyFile=archetype.properties \
              -Darchetype.postPhase=install


2. Generate a Spring Boot project

        ./mvnw archetype:generate \
             -DarchetypeGroupId=pa.mejia \
             -DarchetypeArtifactId=spring-boot-spa-archetype \
             -Dinteractive=true \
             -DaskForDefaultPropertyValues=true \
             -DoutputDirectory=$PWD/../spring-boot-spa