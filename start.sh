#!/bin/sh
# Install curl for health checking
apk add --no-cache curl

# Start Ollama server in the background
ollama serve &

# Wait for Ollama to start up
echo "Waiting for Ollama server to start..."
until curl -s -f http://localhost:11434 > /dev/null; do
  sleep 1
done
echo "Ollama server is up!"

# Pull the mixtral model
echo "Pulling mixtral model..."
ollama pull llama3

# Keep the container running
echo "Ollama is now running with mixtral model ready!"
tail -f /dev/null