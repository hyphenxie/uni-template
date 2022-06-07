#!/bin/bash

sonar-scanner \
    -Dsonar.projectKey=$CI_PROJECT_NAMESPACE/$CI_PROJECT_NAME#$CI_COMMIT_REF_NAME \
    -Dsonar.projectName=web/uni模板v2 \
    -Dsonar.sources=./src \
    -Dsonar.host.url=http://183.6.107.160:47118 \
    -Dsonar.exclusions=src/pages/entry/index.less/*\
    -Dsonar.gitlab.project_id=$CI_PROJECT_ID \
    -Dsonar.gitlab.commit_sha=$CI_COMMIT_SHA \
    -Dsonar.gitlab.ref_name=$CI_COMMIT_REF_NAME


if [ $? -eq 0 ]; then
    echo "sonarqube code-analyze over."
fi
