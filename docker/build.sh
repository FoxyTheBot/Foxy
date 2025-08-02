#!/bin/bash
set -e

IMAGE_NAME="foxy-bot"
TAG="latest"

echo "Building: $IMAGE_NAME:$TAG..."

docker build -f docker/Dockerfile -t "$IMAGE_NAME:$TAG" .

echo "Build completed successfully!"