# Lab 7

1. Screenshot of the first time you ran Hadolint on your Dockerfile, showing any
   warnings or errors you had to correct.

![hadolint_error](img/hadolint_error.png)

2. Screenshot of a successful CI workflow, showing your new Dockerfile Lint and
   Docker Hub jobs succeeding.

![ci_workflow](img/ci_workflow.png)

3. Screenshot of your main and latest Tags in Docker Hub, created by your GitHub
   Actions ci.yml workflow.

![all_docker_tags](img/all_docker_tags.png)

4. Screenshot of a successful CD workflow, showing your AWS login, build and
   push jobs succeeding.

![ci_after_tagging](img/ci_after_tagging.png)

5. Screenshot of your Amazon Elastic Container Registry showing your fragments
   Image and tags, built via GitHub Actions.

![aws_container_registry](img/aws_container_registry.png)

6. Screenshot of of your local machine running the main image from Docker Hub,
   built and pushed by your GitHub Actions ci.yml workflow.

![docker_on_localhost](img/docker_on_localhost.png)

7. Screenshot of of EC2 instance running the v0.7.0 image (or your latest
   version tag) your Amazon Elastic Container Registry and fragments repo, built
   and pushed by your GitHub Actions cd.yml workflow.

![docker_on_aws](img/docker_on_aws.png)

