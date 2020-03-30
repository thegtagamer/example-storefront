#!/bin/bash
echo "Building rc-storefrnt"
docker build -t rc-front
docker-compose up
